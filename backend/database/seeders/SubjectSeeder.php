<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $bsitSubjects = [
            ['code' => 'IT101', 'name' => 'Fundamentals of Information Technology', 'description' => 'Introduction to computer systems, software, and IT practices.'],
            ['code' => 'IT102', 'name' => 'Systems Analysis and Design', 'description' => 'Study of system requirements, modeling, and solution design.'],
            ['code' => 'IT201', 'name' => 'Programming Logic and Design', 'description' => 'Core programming concepts, algorithms, and problem solving.'],
            ['code' => 'IT202', 'name' => 'Web Development', 'description' => 'Front-end and back-end web application development techniques.'],
            ['code' => 'IT203', 'name' => 'Database Systems', 'description' => 'Database design, SQL, and data management fundamentals.'],
        ];

        $bsctSubjects = [
            ['code' => 'CS101', 'name' => 'Introduction to Computer Science', 'description' => 'Computer science principles, algorithms, and computational thinking.'],
            ['code' => 'CS102', 'name' => 'Data Structures and Algorithms', 'description' => 'Structures for organizing data and algorithm efficiency.'],
            ['code' => 'CS201', 'name' => 'Object-Oriented Programming', 'description' => 'OOP concepts using modern programming languages.'],
            ['code' => 'CS202', 'name' => 'Computer Networks', 'description' => 'Network layers, protocols, and infrastructure concepts.'],
            ['code' => 'CS203', 'name' => 'Software Engineering', 'description' => 'Software development lifecycle, team workflows, and quality practices.'],
        ];

        foreach (array_merge($bsitSubjects, $bsctSubjects) as $subjectData) {
            Subject::updateOrCreate([
                'code' => $subjectData['code'],
            ], [
                'name' => $subjectData['name'],
                'description' => $subjectData['description'],
            ]);
        }

        $allSubjectIds = Subject::pluck('id')->toArray();

        // Randomly distribute subjects to students
        Student::all()->each(function (Student $student) use ($allSubjectIds) {
            $numSubjects = rand(3, 5); // Assign 3 to 5 subjects randomly
            $randomSubjectIds = collect($allSubjectIds)->random($numSubjects)->toArray();
            $student->subjects()->syncWithoutDetaching($randomSubjectIds);
        });

        $this->command->info('Seeded BSIT and BSCT subjects, and randomly assigned students and faculty to subjects.');

    }
}
