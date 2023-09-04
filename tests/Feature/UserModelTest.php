<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;

class UserModelTest extends TestCase
{

    // Test to create a user and check if it's stored in the database.
    public function testCreateUser(): void
    {
        // Create a user using the User factory.
        $user = User::factory()->create();

        // Assert that the created object is an instance of the User model.
        $this->assertInstanceOf(User::class, $user);

        // Assert that the user's email exists in the 'users' table in the database.
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    // Test to check if a user has the admin role.
    public function testCheckIsUserAdmin()
    {
        // Create a regular user.
        $user = User::factory()->create();

        // Assert that the regular user is not an admin.
        $this->assertFalse($user->isAdmin());

        // Create an admin user and attach the 'admin' role to it.
        $admin_user = User::factory()->create();
        $admin_user->roles()->attach(Role::where('role', 'admin')->first());

        // Assert that the admin user is an admin.
        $this->assertTrue($admin_user->isAdmin());

    }

    // Test to check if a user has the tasks.
    public function testUserHasManyTasks()
    {
        // Create a user.
        $user = User::factory()->create();

        // Create some tasks for the user.
        $task1 = $user->tasks()->create([
            'title' => 'Task 1',
            'time_start' => '08:00',
            'time_end' => '09:00',
        ]);
        $task1 = $user->tasks()->create([
            'title' => 'Task 2',
            'time_start' => '08:00',
            'time_end' => '09:00',
        ]);

        // Check if the user has the tasks.
        $this->assertTrue($user->tasks->contains($task1));
        $this->assertTrue($user->tasks->contains($task1));

    }
}
