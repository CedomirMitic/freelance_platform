<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        static $userId = 1;

        return [
            'user_id' => $userId++,
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'skills' => fake()->randomElements(['React', 'Vue', 'Laravel', 'Tailwind', 'PHP'], 3),
            'budget' => fake()->numberBetween(100, 5000),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
        ];
    }
}
