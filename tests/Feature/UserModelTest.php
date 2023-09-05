<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
/**
 * Class UserModelTest
 *
 * @package Tests\Feature
 */
class UserModelTest extends TestCase
{

    /**
     * Test to create a user and check if it's stored in the database.
     */
    public function testCreateUser(): void
    {
        // Arrange: Create a user using the User factory.
        $user = User::factory()->create();

        // Act: No specific action required as the user is created automatically.

        // Assert: Check if the created object is an instance of the User model.
        $this->assertInstanceOf(User::class, $user);

        // Assert that the user's email exists in the 'users' table in the database.
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    /**
     * Test to check if a user has the admin role.
     */
    public function testCheckIsUserAdmin()
    {
        // Arrange: Create a regular user.
        $user = User::factory()->create();

        // Assert: check if the regular user is not an admin.
        $this->assertFalse($user->isAdmin());

        // Arrange: Create an admin user and attach the 'admin' role to it.
        $admin_user = User::factory()->create();
        $admin_user->roles()->attach(Role::where('role', 'admin')->first());

        // Assert: Check if the admin user is an admin.
        $this->assertTrue($admin_user->isAdmin());

    }

    /**
     * Test to check if a user has the tasks.
     */
    public function testUserHasManyTasks()
    {
        // Arrange: Create a user.
        $user = User::factory()->create();

        // Act: Create some tasks for the user.
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

        // Assert: Check if the user has the tasks.
        $this->assertTrue($user->tasks->contains($task1));
        $this->assertTrue($user->tasks->contains($task1));
    }

    /**
     * Test to check of user retrieval from database.
     */
    public function testUserRetrieval()
    {
        // Arrange: Create a user.
        $user = User::factory()->create();

        // Act: Find the user by id and email.
        $found_by_id = User::find($user->id);
        $found_by_email = User::where('email', $user->email)->first();

        // Assert: Check if created user matches with the user from database.
        $this->assertEquals($user->id, $found_by_id->id);
        $this->assertEquals($user->email, $found_by_email->email);

    }

    /**
     * Test to check user-task relationship.
     */
    public function testUserTaskRelationship()
    {
        // Arrange: Create a user and a task associated with that user.
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        // Act: No specific action required as the user and task are created.

        // Assert: Check if the user has the task.
        $this->assertTrue($user->tasks->contains($task));
    }


    /**
     * Test to check user-role relationships.
     */
    public function testUserHasRoles()
    {
        // Arrange: Create a user.
        $user = User::factory()->create();

        // Act: Attach roles to the user.
        $role1 = Role::factory()->create(['role' => 'role1']);
        $role2 = Role::factory()->create(['role' => 'role2']);

        $user->roles()->attach([$role1->id, $role2->id]);

        // Assert: Check if the user has the assigned roles.
        $this->assertTrue($user->roles->contains($role1));
        $this->assertTrue($user->roles->contains($role2));
    }

    /**
     *  Test to check user-task relationship. 
     */
    public function testUserHasTasks()
    {
        // Arrange: Create a user.
        $user = User::factory()->create();

        // Act: Create tasks associated with the user.
        $task1= Task::factory()->create(['user_id'=> $user->id]);
        $task2= Task::factory()->create(['user_id'=> $user->id]);

        // Assert: Check if the user has the assigned roles.
        $this->assertTrue($user->tasks->contains($task1));
        $this->assertTrue($user->tasks->contains($task2));
    }
}