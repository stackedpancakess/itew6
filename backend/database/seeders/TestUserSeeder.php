<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create admin account
        User::create([
            'name' => 'CCS Admin',
            'email' => 'ccsadmin@pnc.edu.ph',
            'password' => Hash::make('adminacc'),
            'role_id' => 1, // Admin role
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin account created: ccsadmin@pnc.edu.ph / adminacc');

        // Create faculty accounts from employees
        $faculty = Employee::first();
        if ($faculty) {
            $facultyEmail = strtolower($faculty->first_name) . '.faculty@pnc.edu.ph';
            User::create([
                'name' => $faculty->first_name . ' ' . $faculty->last_name,
                'email' => $facultyEmail,
                'password' => Hash::make('facultyacc'),
                'role_id' => 2, // Faculty role
                'email_verified_at' => now(),
            ]);

            $this->command->info("Faculty account created: $facultyEmail / facultyacc");
        }

        // Create student account from first student
        $student = Student::first();
        if ($student) {
            $studentEmail = $student->student_id . '@pnc.edu.ph';
            User::create([
                'name' => $student->first_name . ' ' . $student->last_name,
                'email' => $studentEmail,
                'password' => Hash::make('studentccs'),
                'role_id' => 3, // Student role
                'email_verified_at' => now(),
            ]);

            $this->command->info("Student account created: {$student->student_id} / studentccs");
        }
    }
}
