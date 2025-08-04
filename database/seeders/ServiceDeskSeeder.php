<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;

class ServiceDeskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create IT Manager
        $itManager = User::create([
            'name' => 'IT Manager',
            'email' => 'manager@servicedesk.com',
            'password' => Hash::make('password'),
            'role' => 'it_manager',
            'department' => 'IT',
            'email_verified_at' => now(),
        ]);

        // Create IT Staff
        $itStaff1 = User::create([
            'name' => 'John Smith',
            'email' => 'john@servicedesk.com',
            'password' => Hash::make('password'),
            'role' => 'it_staff',
            'department' => 'IT',
            'email_verified_at' => now(),
        ]);

        $itStaff2 = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@servicedesk.com',
            'password' => Hash::make('password'),
            'role' => 'it_staff',
            'department' => 'IT',
            'email_verified_at' => now(),
        ]);

        // Create test employee
        $employee = User::create([
            'name' => 'Test Employee',
            'email' => 'employee@servicedesk.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'department' => 'HR',
            'email_verified_at' => now(),
        ]);

        // Create additional employees
        $employees = User::factory()->employee()->count(15)->create();
        $allEmployees = $employees->push($employee);

        // Create additional IT staff
        $additionalItStaff = User::factory()->itStaff()->count(3)->create();
        $allItStaff = collect([$itStaff1, $itStaff2])->concat($additionalItStaff);

        // Create tickets
        $this->createTickets($allEmployees, $allItStaff);

        $this->command->info('Service Desk seeded successfully!');
        $this->command->info('Test accounts created:');
        $this->command->info('- IT Manager: manager@servicedesk.com / password');
        $this->command->info('- IT Staff: john@servicedesk.com / password');
        $this->command->info('- IT Staff: sarah@servicedesk.com / password');
        $this->command->info('- Employee: employee@servicedesk.com / password');
    }

    /**
     * Create tickets with realistic distribution.
     *
     * @param \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $employees
     * @param \Illuminate\Support\Collection<int, \App\Models\User> $itStaff
     * @return void
     */
    protected function createTickets($employees, $itStaff): void
    {
        // Create pending tickets (unassigned)
        Ticket::factory()->count(8)->create([
            'status' => 'pending',
            'assigned_to' => null,
            'created_by' => $employees->random()->id,
        ]);

        // Create in-progress tickets (assigned to IT staff)
        Ticket::factory()->count(12)->create([
            'status' => 'in_progress',
            'assigned_to' => $itStaff->random()->id,
            'created_by' => $employees->random()->id,
        ]);

        // Create finished tickets
        Ticket::factory()->count(20)->create([
            'status' => 'finished',
            'assigned_to' => $itStaff->random()->id,
            'created_by' => $employees->random()->id,
        ]);

        // Create some high priority tickets
        Ticket::factory()->highPriority()->count(5)->create([
            'status' => 'pending',
            'assigned_to' => null,
            'created_by' => $employees->random()->id,
        ]);

        // Create some tickets for specific test employee
        $testEmployee = User::where('email', 'employee@servicedesk.com')->first();
        
        Ticket::factory()->count(3)->create([
            'created_by' => $testEmployee->id,
            'status' => 'pending',
            'assigned_to' => null,
        ]);

        Ticket::factory()->count(2)->create([
            'created_by' => $testEmployee->id,
            'status' => 'in_progress',
            'assigned_to' => $itStaff->first()->id,
        ]);

        Ticket::factory()->count(4)->create([
            'created_by' => $testEmployee->id,
            'status' => 'finished',
            'assigned_to' => $itStaff->random()->id,
        ]);
    }
}