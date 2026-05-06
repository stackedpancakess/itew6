<?php

namespace App\Models;

use App\Models\Employee;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deployment extends Model
{
    protected $fillable = [
        'student_id',
        'professor_id',
        'subject_id',
        'semester',
        'academic_year',
        'status',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'professor_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
