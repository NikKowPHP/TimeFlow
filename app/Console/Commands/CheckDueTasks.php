<?php

namespace App\Console\Commands;

use App\Events\DesktopNotificationEvent;
use App\Models\Task;
use App\Notifications\DesktopNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Http;

class CheckDueTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:check-due-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for tasks with approaching due dates and send notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tasks = Task::where('date', '>=', now())
            ->where('notified', 0)
            ->get();
        foreach ($tasks as $task) {
            $notificationTime = $this->calculateNotificationTime($task);

            if (now() >= $notificationTime) {
                $this->sendNotification($task);
            }
        }
    }
    protected function calculateNotificationTime($task)
    {
        if ($task->notification_preference === '1_day_before') {
            return $task->due_datetime->subDay();
        }
        return $task->due_datetime;
    }
    protected function sendNotification($task)
    {
        $user = $task->user;
        try {

            event(new DesktopNotificationEvent($task->title, 'The task is about to start'));
            $task->update(['notified'=> 1]);

        } catch (\Exception $e) {
            $user->notify(new DesktopNotification($task));
            $task->update(['notified' => 1]);
        }
    }
}