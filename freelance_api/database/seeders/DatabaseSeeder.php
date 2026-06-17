<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $roles = ['freelancer', 'recruiter', 'admin'];

        foreach ($roles as $role) {
            $user = User::create([
                'email' => "{$role}@demo.com",
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => $role,
                'phone' => '123456789' . $role[0], // Mora biti unique
            ]);

            // Ako koristis profil/kompaniju, napravi i to
            if ($role === 'freelancer') {
                $user->profile()->create(['first_name' => 'Demo', 'last_name' => 'Freelancer']);
            } elseif ($role === 'recruiter') {
                $user->company()->create(['company_name' => 'Demo Company', 'address' => 'Demo Street']);
            }
        }
        // 1. Kreiraj tvoj TEST nalog (Recruiter)
        $testRecruiter = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('test123123'),
            'role' => 'recruiter'
        ]);

        // Odmah mu napravi firmu
        \DB::table('companies')->insert([
            'user_id' => $testRecruiter->id,
            'company_name' => 'Test Doj d.o.o.',
            'address' => 'Ulica Testova 123',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Kreiraj 10 nasumičnih usera (neka factory odluči ulogu)
        $users = User::factory(10)->create();

        foreach ($users as $user) {
            if ($user->role === 'recruiter') {
                // Ako je recruiter, ubaci u companies
                \DB::table('companies')->insert([
                    'user_id' => $user->id,
                    'company_name' => fake()->company(),
                    'address' => fake()->address(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Daj mu odmah i jedan projekat da ne bude prazno
                Project::factory()->create(['user_id' => $user->id]);

            } else {
                // Ako je freelancer, ubaci u profiles
                \DB::table('profiles')->insert([
                    'user_id' => $user->id,
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Dodaj još par nasumičnih projekata za tvoj test nalog
        Project::factory(3)->create([
            'user_id' => $testRecruiter->id
        ]);
    }
}
