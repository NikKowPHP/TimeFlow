<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Events\DesktopNotificationEvent;
use App\Notifications\DesktopNotification;

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
        $this->checkApproachingTasks();
    }
    protected function checkApproachingTasks()
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
            $dueDateTime = Carbon::parse($task->due_datetime);
            $dayBefore = $dueDateTime->subDay()->toDateTimeString();
            return $dayBefore;
        }
        return $task->due_datetime;
    }
    protected function sendNotification($task)
    {
        $user = $task->user;
        try {
            event(new DesktopNotificationEvent($task->title, 'The task is about to start'));
            $task->update(['notified' => 1]);

        } catch (\Exception $e) {
            $user->notify(new DesktopNotification($task));
            $task->update(['notified' => 1]);
        }
    }
}