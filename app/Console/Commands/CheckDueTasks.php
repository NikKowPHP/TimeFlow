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
    // TODO: 1 hour before 15 min before
    protected function calculateNotificationTime($task)
    {
        $due_date_time = Carbon::parse($task->due_datetime);
        $notification_day = $due_date_time;
        switch ($task->notification_preference) {
            case "1_day_before":
                $notification_day = $due_date_time->subDay()->toDateTimeString();
                break;
            case "1_hour_before":
                $notification_day = $due_date_time->subHour()->toDateTimeString();
                break;
            case "15_minutes_before":
                $notification_day = $due_date_time->subMinutes(15)->toDateTimeString();
                break;
            default:
                return $task->due_dateTime;

        }
        return $notification_day;
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