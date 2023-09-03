<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;
use App\Models\User;

class UserModelTest extends TestCase
{

    public function testCreateUser(): void
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(User::class, $user);
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    public function testCheckIsUserAdmin()
    {
        $user = User::factory()->create();
        $this->assertFalse($user->isAdmin());

        $admin_user = User::factory()->create();
        $admin_user->roles()->attach(Role::where('role', 'admin')->first());
        $this->assertTrue($admin_user->isAdmin());

    }
}
