<?php

namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{


    // For Admin
    public function index(Request $request)
    {
        // Safecheck if its rly admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Project::query();

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Check status
        if ($request->status === 'pending') {
            $query->where('status', 'pending');
        } elseif ($request->status === 'approved') {
            // Get everything thats not pending
            $query->where('status', '!=', 'pending');
        }

        return response()->json($query->get());
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending'
        ]);

        $project = Project::findOrFail($id);
        $project->update(['status' => $request->status]);

        return response()->json(['message' => "Status updated to {$request->status}"]);
    }



    public function show($id)
    {
        // Admin sees everything
        return Project::findOrFail($id);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }



}