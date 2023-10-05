<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Requests\StoreTaskRequest;
use App\Events\DesktopNotificationEvent;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Support\Facades\Broadcast;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return TaskResource::collection(
                Task::query()->orderBy('date', 'desc')->get()
            );
        }
        return TaskResource::collection($user->tasks);
    }
    public function indexByDate($date)
    {
        $date = Task::whereDate('date', $date)->get();

        if ($date->count() !== 0) {
            log::debug('index by date', ['data' => $date]);
            return TaskResource::collection($date);
        } else {
            return [];
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task_data_validated = $request->validated();
        $task = Task::create($task_data_validated);
        return response(new TaskResource($task), 201);
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
        $task_data_validated = $request->validated();
        $task->update($task_data_validated);
        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response('', 204);
    }

}