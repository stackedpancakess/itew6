<?php

namespace Database\Seeders;

use App\Models\Deployment;
use App\Models\Employee;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeploymentSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $semesters = ['1st Semester', '2nd Semester'];
        $academicYears = ['2024-2025', '2025-2026', '2026-2027'];

        $students = Student::with('subjects')->get();
        $professors = Employee::where(function ($query) {
            $query->where('position', 'like', '%Professor%')
                ->orWhere('position', 'like', '%Dean%')
                ->orWhere('position', 'like', '%Chair%');
        })->with('subjects')->get();

        if ($students->isEmpty() || $professors->isEmpty()) {
            $this->command->info('Skipping deployment seeding because students or professors are missing.');
            return;
        }

        Deployment::truncate();

        foreach ($students as $student) {
            if ($student->subjects->isEmpty()) {
                continue;
            }

            $assignedSubjects = $student->subjects->shuffle()->take(rand(1, 3));
            foreach ($assignedSubjects as $subject) {
                $teachersForSubject = $professors->filter(function (Employee $professor) use ($subject) {
                    return $professor->subjects->contains('id', $subject->id);
                });

                $professor = $teachersForSubject->isNotEmpty()
                    ? $teachersForSubject->random()
                    : $professors->random();

                Deployment::create([
                    'student_id' => $student->id,
                    'professor_id' => $professor->id,
                    'subject_id' => $subject->id,
                    'semester' => $semesters[array_rand($semesters)],
                    'academic_year' => $academicYears[array_rand($academicYears)],
                    'status' => rand(0, 1) ? 'active' : 'completed',
                ]);
            }
        }

        $this->command->info('Random student deployments created.');
    }
}
