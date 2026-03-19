<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'description'  => $this->description,
            'priority'     => $this->priority,
            'status'       => $this->status,
            'due_date'     => $this->due_date?->toDateString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'category'     => $this->category ? new CategoryResource($this->category) : null,
            'created_at'   => $this->created_at?->toISOString(),
            'updated_at'   => $this->updated_at?->toISOString(),
        ];
    }
}
