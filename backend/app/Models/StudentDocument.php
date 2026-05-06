<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDocument extends Model
{
    protected $fillable = [
        'student_id',
        'document_type',
        'document_name',
        'file_path',
        'original_file_name',
        'mime_type',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
