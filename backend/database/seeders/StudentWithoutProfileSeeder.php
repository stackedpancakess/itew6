<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentWithoutProfileSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->command->info('Generating students without profiles...');
        
        $programs = [
            'Computer Science',
            'Information Technology',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Engineering',
            'Business Administration',
            'Economics',
            'Psychology'
        ];

        $students = [];
        
        // Generate 100 students without profiles
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $this->generateFirstName();
            $lastName = $this->generateLastName();
            $studentId = 'NOPROF' . str_pad($i, 4, '0', STR_PAD_LEFT);
            
            $students[] = [
                'student_id' => $studentId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => strtolower($firstName . '.' . $lastName . '.noprofile' . $i . '@student.university.edu'),
                'phone' => $this->generatePhoneNumber(),
                'year_level' => rand(1, 4),
                'program' => $programs[array_rand($programs)],
                'status' => 'active',
                'date_enrolled' => $this->generateRandomDate('2020-01-01', '2024-01-01'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('students')->insert($students);
        $this->command->info('100 students without profiles created successfully!');
    }

    private function generateFirstName(): string
    {
        $firstNames = [
            'Andrei', 'Bianca', 'Carlo', 'Diana', 'Emmanuel', 'Francesca', 'Gabriel', 'Hannah',
            'Ian', 'Julia', 'Kenneth', 'Luna', 'Marco', 'Nicole', 'Oliver', 'Paola',
            'Rafael', 'Sophia', 'Tristan', 'Victoria', 'Xavier', 'Yasmine', 'Zandro', 'Alexa'
        ];
        return $firstNames[array_rand($firstNames)];
    }

    private function generateLastName(): string
    {
        $lastNames = [
            'Aquino', 'Bautista', 'Castro', 'Domingo', 'Estrada', 'Fernandez', 'Gonzaga', 'Hernandez',
            'Ignacio', 'Jimenez', 'Lazaro', 'Mercado', 'Navarro', 'Ocampo', 'Padilla', 'Quintana',
            'Rizal', 'Salazar', 'Tolentino', 'Valdez', 'Zamora', 'Alvarez', 'Bermudez', 'Cervantes'
        ];
        return $lastNames[array_rand($lastNames)];
    }

    private function generatePhoneNumber(): string
    {
        return '+1' . rand(200, 999) . '-' . rand(200, 999) . '-' . rand(1000, 9999);
    }

    private function generateRandomDate($startDate, $endDate): string
    {
        $startTimestamp = strtotime($startDate);
        $endTimestamp = strtotime($endDate);
        $randomTimestamp = mt_rand($startTimestamp, $endTimestamp);
        return date('Y-m-d', $randomTimestamp);
    }
}
