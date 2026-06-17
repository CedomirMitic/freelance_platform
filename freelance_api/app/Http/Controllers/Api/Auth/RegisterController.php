<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validation for common fields for both users(recruiter , freelancer)
        $commonRules = [
            'email' => 'required|email:rfc,dns|unique:users,email',
            'phone' => 'required|phone:AUTO,mobile|unique:users,phone',
            'password' => 'required|min:8',
            'role' => 'required|string|in:freelancer,recruiter',
        ];

        // 2. We get data dynamically depending on what form was chosen to validate
        if ($request->role === 'freelancer') {
            $roleRules = [
                'first_name' => 'required|string|max:255|min:2',
                'last_name' => 'required|string|max:255|min:2',
            ];
        } elseif ($request->role === 'recruiter') {
            $roleRules = [
                'company_name' => 'required|string|max:255|min:4',
                'address' => 'required|string|max:255|min:4'
            ];
        } else {
            $roleRules = [];
        }

        // Merge all rules into one array
        $validated = $request->validate(
            array_merge($commonRules, $roleRules), 
            [
                'phone.phone' => 'Phone number not valid, or invalid format.',
                'phone.unique' => 'This phone is already registered.',
                'email.unique' => 'This email is already taken.',
            ]
        );

        // 3. Create User
        $user = User::create([
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // 4. Create profile depending on the role
        if ($user->role === 'freelancer') {
            $user->profile()->create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
            ]);
        } else {
            $user->company()->create([
                'company_name' => $validated['company_name'],
                'address' => $validated['address'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'User successfully registered. Please log in.'
        ], 201);
    }
}
