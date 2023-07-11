<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Log::debug(Task::query()->orderBy('date', 'desc')->get());
        return TaskResource::collection(
            Task::query()->orderBy('date', 'desc')->get()
        );
    }
    public function indexByUser($user_id)
    {
        $user = User::where('user_id', $user_id);
        $tasks = $user->tasks;
        return TaskResource::collection($tasks);
    }
    public function indexByDate($date)
    {
        $date = Task::whereDate('date', $date)->get();
        return TaskResource::collection($date);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::find($id);
        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::find($id);
        $task->delete();
        return response('', 204);
    }
}
