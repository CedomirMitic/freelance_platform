<?php

namespace App\Http\Controllers\Api\Recruiter;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Get parameters from url for search
        $searchTerm = $request->query('search');
        $status = $request->query('status', 'approved'); // If theres no status default is approved

        // 2. Only owners projects
        $query = Project::where('user_id', $user->id);

        // 3. Filter by statusu 
        $query->where('status', $status);

        // 4. Filter by search term if its set
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('skills', 'LIKE', "%{$searchTerm}%");
            });
        }

        // 5. Return results ordered by date newest
        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        // 1. Validation - only fields that the user actually fills
        // We don't validate 'status' here because we don't want the user to send it
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
        ]);

        // 2. Default values for internal logic
        // We manually set the status to 'pending' every time a project is created
        $validatedData['user_id'] = $request->user()->id;
        $validatedData['status'] = 'pending';

        // Ensure skills is at least an empty array if not provided
        if (!isset($validatedData['skills'])) {
            $validatedData['skills'] = [];
        }

        // 3. Create the project
        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }

    public function show($id)
    {
        // Show project only if its the owner
        return Project::where('user_id', auth()->id())->findOrFail($id);
    }

    public function destroy($id)
    {
        $project = Project::where('user_id', auth()->id())->findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }
    public function update(Request $request, $id)
    {
        // 1. Find project or return 404 if not found
        $project = Project::where('id', $id)
            ->where('user_id', $request->user()->id) // Make sure only owner can edit
            ->firstOrFail();

        // 2. If its rejected dont allow it to be edited
        if ($project->status === 'rejected') {
            return response()->json([
                'message' => 'You cannot edit a rejected project.'
            ], 403);
        }

        // 3. Frontend validation
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'skills' => 'nullable|array',
        ]);

        // 4. If it is approved return it to pending after change
        if ($project->status === 'approved') {
            $project->status = 'pending';
        }
        // If its already pending do nothing

        // 5. Save new data
        $project->title = $validatedData['title'];
        $project->description = $validatedData['description'];
        $project->budget = $validatedData['budget'];
        $project->skills = $validatedData['skills'];

        $project->save();

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project
        ], 200);
    }
    public function getProjectApplications($id)
    {
        $project = Project::where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Projekat nije tvoj ili ne postoji'], 403);
        }

        $applications = Application::with('user:id,email')
            ->where('project_id', $id)
            ->latest()
            ->get();

        return response()->json($applications);
    }


    public function downloadDocument($applicationId, $type)
    {
        $application = Application::findOrFail($applicationId);

        $path = match ($type) {
            'cv' => $application->cv_path,
            'motivation' => $application->motivation_path,
            'extra' => $application->extra_path,
            default => null
        };

        if (!$path || !Storage::disk('s3')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Get stream from R2
        $stream = Storage::disk('s3')->readStream($path);

        // Manually setting up mimetype as pdf(cause all files are pdf)
        return response()->stream(function () use ($stream) {
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . basename($path) . '"',
        ]);
    }


}