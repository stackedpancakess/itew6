<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Current `employees` migration does NOT have `department_id`.
        // Seed only the columns that exist.
        $employees = [
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'maria.santos@university.edu',
                'phone' => '+63-917-123-4567',
                'position' => 'Senior Developer',
                'salary' => 95000.00,
                'hire_date' => '2022-01-15',
                'status' => 'active',
            ],
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@university.edu',
                'phone' => '+63-917-123-4568',
                'position' => 'Junior Developer',
                'salary' => 65000.00,
                'hire_date' => '2023-03-20',
                'status' => 'active',
            ],
            [
                'first_name' => 'Carmen',
                'last_name' => 'Reyes',
                'email' => 'carmen.reyes@university.edu',
                'phone' => '+63-917-123-4569',
                'position' => 'Dean',
                'salary' => 75000.00,
                'hire_date' => '2021-06-10',
                'status' => 'active',
            ],
            [
                'first_name' => 'Antonio',
                'last_name' => 'Garcia',
                'email' => 'antonio.garcia@university.edu',
                'phone' => '+63-917-123-4570',
                'position' => 'Dept Chair',
                'salary' => 55000.00,
                'hire_date' => '2023-02-01',
                'status' => 'active',
            ],
            [
                'first_name' => 'Elena',
                'last_name' => 'Mendoza',
                'email' => 'elena.mendoza@university.edu',
                'phone' => '+63-917-123-4571',
                'position' => 'Marketing Specialist',
                'salary' => 60000.00,
                'hire_date' => '2022-09-15',
                'status' => 'active',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
