<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'user_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
