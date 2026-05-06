<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StudentDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student?->id,
                    'full_name' => $this->student?->full_name,
                ];
            }),
            'document_type' => $this->document_type,
            'document_name' => $this->document_name,
            'file_path' => $this->file_path,
            'file_url' => Storage::url($this->file_path),
            'original_file_name' => $this->original_file_name,
            'mime_type' => $this->mime_type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
