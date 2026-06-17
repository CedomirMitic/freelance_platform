<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        // 1. Common fields validation with exception of same user ID for email and phone
        $commonData = $request->validate([
            'email' => 'required|email:rfc,dns|unique:users,email,' . $user->id,
            'phone' => 'required|phone:AUTO,mobile|unique:users,phone,' . $user->id,
            'password' => 'nullable|min:8', // Set to nullable so he doesnt have to change every time
        ], [
            'phone.phone' => 'Phone number not valid, or invalid format.',
            'phone.unique' => 'This phone is already registered.',
            'email.unique' => 'This email is already taken.',
        ]);

        // 2. Updating main users table
        $user->email = $commonData['email'];
        $user->phone = $commonData['phone'];

        // Change password only if user set the new password
        if (!empty($commonData['password'])) {
            $user->password = Hash::make($commonData['password']);
        }
        $user->save();

        // 3. Validation and updating specific tables depending on role
        if ($user->role === 'freelancer') {
            $profileData = $request->validate([
                'first_name' => 'required|string|max:255|min:2',
                'last_name' => 'required|string|max:255|min:2',
            ]);

            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData 
            );
        } elseif ($user->role === 'recruiter') {
            $companyData = $request->validate([
                'company_name' => 'required|string|max:255|min:4',
                'address' => 'required|string|max:255|min:4'
            ]);

            $user->company()->updateOrCreate(
                ['user_id' => $user->id],
                $companyData 
            );
        }

        return response()->json(['message' => 'Profil uspešno ažuriran!']);
    }

    public function editData(Request $request)
    {
        $user = $request->user();

        // Eager load relations to get all the data from database
        $user->load(['profile', 'company']);

        return response()->json([
            'email' => $user->email,
            'phone' => $user->phone,
            'first_name' => $user->profile?->first_name ?? '',
            'last_name' => $user->profile?->last_name ?? '',
            'company_name' => $user->company?->company_name ?? '',
            'address' => $user->company?->address ?? '',
        ]);
    }

    public function getUser(Request $request)
    {
        $user = $request->user();
        // Get relations to get data
        $user->load(['profile', 'company']);

        $displayName = '';
        if ($user->role === 'freelancer' && $user->profile) {
            $displayName = $user->profile->first_name . ' ' . $user->profile->last_name;
        } elseif ($user->role === 'recruiter' && $user->company) {
            $displayName = $user->company->company_name;
        } else {
            $displayName = $user->email;
        }

        return [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'display_name' => $displayName // set DisplayName for frontend render
        ];
    }
}