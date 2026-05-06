<?php

namespace App\Models;

use App\Models\Employee;
use App\Models\Student;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_subject');
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_subject');
    }
}

