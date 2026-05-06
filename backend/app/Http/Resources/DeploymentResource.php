<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\SubjectResource;

class DeploymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'professor' => new EmployeeResource($this->whenLoaded('professor')),
            'subject' => new SubjectResource($this->whenLoaded('subject')),
            'semester' => $this->semester,
            'academic_year' => $this->academic_year,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
