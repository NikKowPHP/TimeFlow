<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'user_id' => 1,

            'date' => $this->faker->dateTimeThisMonth(),
            'time_start' => $this->faker->dateTimeThisMonth(),
            'time_end' => $this->faker->dateTimeThisMonth(),
            'title' => $this->faker->title()
        ];
    }
}
