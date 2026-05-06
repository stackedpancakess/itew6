<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deployments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('professor_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('semester')->default('1st Semester');
            $table->string('academic_year');
            $table->enum('status', ['active', 'completed'])->default('active');
            $table->timestamps();
            $table->unique(['student_id', 'professor_id', 'subject_id', 'academic_year', 'semester'], 'deployments_unique_assignment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deployments');
    }
};
