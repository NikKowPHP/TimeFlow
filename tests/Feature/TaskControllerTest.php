<?php

namespace Tests\Feature;

use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase; // Refresh the database before each test.
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

    /**
     * Test that a regular user can view their tasks. 
     */
    public function testRegularUserCanViewTheirTasks(): void
    {
        // Arrange: Create an admin user.
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('role', 'user')->first());

        // Act: Create some tasks.
        $task = Task::factory()->count(3)->create();

        // Act: Simulate an authenticated regular user.
        $this->actingAs($user);

        // Act: Send a GET requeset to the index method.
        $response = $this->get('/api/tasks');

        // Assert: The response contains the user's tasks.
        $response->assertStatus(200)->assertJsonCount(3, 'data');
    }

    /**
     * Test creating a new task.
     */
    public function testCreateTask()
    {
        // Arrange: Create a regular user.
        $user = User::factory()->create();

        // Arrange: Prepare task data.
        $taskData = [
            'user_id' => $user->id,
            'date' => '2023-09-10',
            'time_start' => '08:00',
            'time_end' => '09:00',
            'title' => 'New Task',
        ];

        // Act: Simulate an authenticated user before accessing the route.
        $this->actingAs($user);

        // Act: Send a POST request to create a new task.
        $response = $this->post('/api/tasks', $taskData);

        // Assert: The response indicates a successful creation (HTTP status 201).
        $response->assertStatus(201);

        // Assert: The task has been created in the database.
        $this->assertDatabaseHas('tasks', $taskData);
    }

    /**
     * Test storing a new task.
     */
    public function testStoreMethod()
    {
        // Create a user for authentication.
        $user = User::factory()->create();

        // Simulate authentication as the user.
        $this->actingAs($user);

        // Arrange: Prepare task data.
        $taskData = [
            'user_id' => $user->id,
            'date' => '2023-09-10',
            'time_start' => '08:00',
            'time_end' => '09:00',
            'title' => 'New Task',
        ];


        // Send a POST request to the store method with the task data.
        $response = $this->post('/api/tasks', $taskData);

        // Assert that the response status is 201 (Created).
        $response->assertStatus(201);

        // Assert that the new task has been created in the database.
       $this->assertDatabaseHas('tasks', $taskData);
    }

    /**
     * Test removing a task.
     */
    public function testDestroyTask()
    {
        // Arrange: Create a user for authentication.
        $user = User::factory()->create();

        // Act: Simulate authentication as the user.
        $this->actingAs($user);

        // Arrange: Prepare task instance.
        $task = Task::factory()->state(['user_id' => $user->id])->create();

       // Act: Remove the task from database.
       $response = $this->delete("/api/tasks/{$task->id}");

       // Assert: The response status is 204 (No Content) for successful deletion.
       $response->assertStatus(204);

       // Assert: The new task has been removed from the database.
       $this->assertDatabaseMissing('tasks', $task->toArray());
    }

}