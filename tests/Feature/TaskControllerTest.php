<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Test that an admin user can view all tasks. 
     */
    public function testAdminCanViewAllTasks(): void
    {
        // Arrange: Create an admin user.
        $adminUser = User::factory()->create();
        $adminUser->roles()->attach(Role::where('role', 'admin')->first());

        // Act: Create some tasks.
        $task = Task::factory()->count(5)->create();
        
        // Act: Simulate an authenticated admin user.
        $this->actingAs($adminUser);

        // Act: Send a GET requeset to the index method.
        $response = $this->get('/api/tasks');

        // Assert: The response contains the user's tasks.
        $response->assertStatus(200)->assertJsonCount(5, 'data');

    }
}
