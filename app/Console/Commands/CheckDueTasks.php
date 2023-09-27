<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

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
        $tasks = Task::where('due_datetime', '>=', now())
            ->where('due_datetime', '<=', now()->addMinutes(15))
            ->where('notified', 0)
            ->get();
        Log::debug('Due tasks are comming ', $tasks);
    }
}