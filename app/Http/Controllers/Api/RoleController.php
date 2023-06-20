<?php

namespace App\Http\Controllers\api;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateRoleRequest;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return UserResource::collection($users);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
    public function getUserWithRoles($id)
    {
        $user = User::with('roles')->find($id);
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */

    public function updateUserRole(UpdateRoleRequest $request)
    {
        $data = $request->validated();
        $user = User::with('roles')->find($data['user_id']);
        $user->roles()->sync($request->role_id);
        return new UserResource($user);
    }
    public function update()
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getAllRoleNames()
    {
        $roles = Role::all();
        return RoleResource::collection($roles);
    }
}