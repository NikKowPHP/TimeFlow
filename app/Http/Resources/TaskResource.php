<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */


    public function toArray(Request $request): array
    {
        $time_start = Carbon::parse($this->time_start);
        $time_end = Carbon::parse($this->time_end);
        $user = User::find($this->user_id);
        return [
            'id' => $this->id,
            'user' => $user,
            'date' => $this->date,
            'time_start' => $time_start->format('H:i'),
            'time_end' => $time_end->format('H:i'),
            'title' => $this->title,
        ];

    }
}
