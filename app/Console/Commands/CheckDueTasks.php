<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

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
        //
    }
}
