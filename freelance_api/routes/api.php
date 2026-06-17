<?php

use App\Http\Controllers\Api\Admin\ProjectController as AdminController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController as FreelancerController;
use App\Http\Controllers\Api\Recruiter\ProjectController as RecruiterController;
use Illuminate\Support\Facades\Route;

// --- Public Routes ---
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

Route::get('/projects', [FreelancerController::class, 'index']);
Route::get('/projects/{id}', [FreelancerController::class, 'show']);

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::get('/profile/edit-data', [ProfileController::class, 'editData']);
    Route::get('/user', [ProfileController::class, 'getUser']); 

    // --- FREELANCER GROOP ---
    Route::middleware(['auth:sanctum', 'role:freelancer'])->group(function () {
        Route::get('projects/{id}/apply', [FreelancerController::class, 'apply_render']);
        Route::post('projects/applications', [FreelancerController::class, 'apply_store']);
        Route::get('freelancer/my-applications', [FreelancerController::class, 'getMyApplications']);
    });

    // --- RECRUITER GROOP ---
    Route::prefix('recruiter')->middleware(['auth:sanctum', 'role:recruiter'])->group(function () {
        Route::get('/projects', [RecruiterController::class, 'index']);
        Route::post('/projects', [RecruiterController::class, 'store']);
        Route::get('/projects/{id}', [RecruiterController::class, 'show']);
        Route::patch('/projects/{id}', [RecruiterController::class, 'update']);
        Route::delete('/projects/{id}', [RecruiterController::class, 'destroy']);
        
        // Applications on Projects and Download
        Route::get('/projects/{id}/applications', [RecruiterController::class, 'getProjectApplications']);
        Route::get('applications/{id}/download/{type}', [RecruiterController::class, 'downloadDocument']);
    });

    // --- ADMIN GROOP ---
    Route::prefix('admin')->middleware('is_admin')->group(function () {
        Route::get('/projects', [AdminController::class, 'index']);
        Route::get('/projects/{id}', [AdminController::class, 'show']);
        Route::patch('/projects/{id}/status', [AdminController::class, 'updateStatus']);
        Route::delete('/projects/{id}', [AdminController::class, 'destroy']);
    });
});