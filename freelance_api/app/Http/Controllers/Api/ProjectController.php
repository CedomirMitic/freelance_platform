<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // Freelancer
    public function index(Request $request)
    {
        $query = Project::query();
        $query->where('status', 'approved');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereJsonContains('skills', $searchTerm);
            });
        }
        return $query->latest()->get();
    }
    public function show($id)
    {
        return Project::where('status', 'approved')->findOrFail($id);
    }

    public function apply_render($id)
    {
        // Check if project exists
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Return only title and id of project
        return response()->json([
            'project_id' => $project->id,
            'project_title' => $project->title
        ]);
    }


    public function apply_store(Request $request)
    {
        // 1. Validation
        $request->validate([
            'cv_file' => 'required|mimes:pdf|max:5120',
            'motivation_letter_file' => 'required|mimes:pdf|max:5120',
            'extra_file' => 'nullable|mimes:pdf|max:5120',
            'project_id' => 'required|exists:projects,id',
        ]);

        $projectId = $request->project_id;
        $user = $request->user(); // Get logged in user

        // 2. Save filles on dynamic paths
        $cvPath = $request->file('cv_file')->store("applications/project_{$projectId}/cvs", 's3');
        $motivationPath = $request->file('motivation_letter_file')->store("applications/project_{$projectId}/letters", 's3');

        $extraPath = null;
        if ($request->hasFile('extra_file')) {
            $extraPath = $request->file('extra_file')->store("applications/project_{$projectId}/extra", 's3');
        }

        // 3. Insert into database 
        $application = Application::create([
            'project_id' => $projectId,
            'user_id' => $user->id,
            'cv_path' => $cvPath,
            'motivation_path' => $motivationPath,
            'extra_path' => $extraPath,
        ]);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'data' => $application
        ], 201);
    }
public function getMyApplications(Request $request)
{
    $applications = Application::with('project:id,title')
        ->where('user_id', $request->user()->id)
        ->latest()
        ->get();

    return response()->json($applications);
}
}
