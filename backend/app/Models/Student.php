<?php

namespace App\Models;

use App\Models\Subject;
use App\Models\StudentDocument;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'year_level',
        'program',
        'status',
        'date_enrolled',
    ];

    protected $casts = [
        'date_enrolled' => 'date',
        'year_level' => 'integer',
    ];

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'student_subject');
    }

    public function studentDocuments(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
