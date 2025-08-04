<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceDeskTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the welcome page displays service desk information.
     */
    public function test_welcome_page_shows_service_desk_info(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
        );
    }

    /**
     * Test that employees can create tickets.
     */
    public function test_employee_can_create_ticket(): void
    {
        $employee = User::factory()->employee()->create();

        $this->actingAs($employee);

        $response = $this->post(route('tickets.store'), [
            'title' => 'Test Issue',
            'description' => 'This is a test problem description.',
            'priority' => 'Sedang',
            'department' => 'IT',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'title' => 'Test Issue',
            'created_by' => $employee->id,
            'status' => 'pending',
        ]);
    }

    /**
     * Test that IT staff can update tickets assigned to them.
     */
    public function test_it_staff_can_update_assigned_tickets(): void
    {
        $employee = User::factory()->employee()->create();
        $itStaff = User::factory()->itStaff()->create();

        $ticket = Ticket::factory()->create([
            'created_by' => $employee->id,
            'assigned_to' => $itStaff->id,
            'status' => 'pending',
        ]);

        $this->actingAs($itStaff);

        $response = $this->patch(route('tickets.update', $ticket), [
            'status' => 'in_progress',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'in_progress',
        ]);
    }

    /**
     * Test that IT managers can assign tickets.
     */
    public function test_it_manager_can_assign_tickets(): void
    {
        $employee = User::factory()->employee()->create();
        $itStaff = User::factory()->itStaff()->create();
        $itManager = User::factory()->itManager()->create();

        $ticket = Ticket::factory()->create([
            'created_by' => $employee->id,
            'assigned_to' => null,
            'status' => 'pending',
        ]);

        $this->actingAs($itManager);

        $response = $this->patch(route('tickets.update', $ticket), [
            'status' => 'in_progress',
            'assigned_to' => $itStaff->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'assigned_to' => $itStaff->id,
        ]);
    }

    /**
     * Test dashboard shows correct statistics for different roles.
     */
    public function test_dashboard_shows_role_based_statistics(): void
    {
        $employee = User::factory()->employee()->create();
        $itStaff = User::factory()->itStaff()->create();
        $itManager = User::factory()->itManager()->create();

        // Create tickets for the employee
        Ticket::factory()->count(3)->create(['created_by' => $employee->id]);

        // Test employee dashboard
        $this->actingAs($employee);
        $response = $this->get(route('dashboard'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('statistics')
                ->where('userRole', 'employee')
        );

        // Test IT manager dashboard
        $this->actingAs($itManager);
        $response = $this->get(route('dashboard'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('statistics')
                ->has('additionalStats')
                ->where('userRole', 'it_manager')
        );
    }

    /**
     * Test that employees can only see their own tickets.
     */
    public function test_employees_can_only_see_own_tickets(): void
    {
        $employee1 = User::factory()->employee()->create();
        $employee2 = User::factory()->employee()->create();

        $ticket1 = Ticket::factory()->create(['created_by' => $employee1->id]);
        $ticket2 = Ticket::factory()->create(['created_by' => $employee2->id]);

        $this->actingAs($employee1);

        $response = $this->get(route('tickets.index'));
        $response->assertStatus(200);
        
        // Should see own ticket
        $response->assertSee($ticket1->title);
        // Should not see other employee's ticket
        $response->assertDontSee($ticket2->title);
    }

    /**
     * Test that IT staff can only see assigned tickets.
     */
    public function test_it_staff_can_only_see_assigned_tickets(): void
    {
        $employee = User::factory()->employee()->create();
        $itStaff1 = User::factory()->itStaff()->create();
        $itStaff2 = User::factory()->itStaff()->create();

        $assignedTicket = Ticket::factory()->create([
            'title' => 'Assigned Ticket Title',
            'created_by' => $employee->id,
            'assigned_to' => $itStaff1->id,
        ]);

        $unassignedTicket = Ticket::factory()->create([
            'title' => 'Other Staff Ticket Title',
            'created_by' => $employee->id,
            'assigned_to' => $itStaff2->id,
        ]);

        $this->actingAs($itStaff1);

        $response = $this->get(route('tickets.index'));
        $response->assertStatus(200);
        
        $response->assertInertia(fn ($page) => 
            $page->has('tickets.data', 1)
                ->where('tickets.data.0.id', $assignedTicket->id)
                ->where('tickets.data.0.title', 'Assigned Ticket Title')
        );
    }

    /**
     * Test that IT managers can see all tickets.
     */
    public function test_it_managers_can_see_all_tickets(): void
    {
        $employee = User::factory()->employee()->create();
        $itStaff = User::factory()->itStaff()->create();
        $itManager = User::factory()->itManager()->create();

        $ticket1 = Ticket::factory()->create(['created_by' => $employee->id]);
        $ticket2 = Ticket::factory()->create([
            'created_by' => $employee->id,
            'assigned_to' => $itStaff->id,
        ]);

        $this->actingAs($itManager);

        $response = $this->get(route('tickets.index'));
        $response->assertStatus(200);
        
        // Should see all tickets
        $response->assertSee($ticket1->title);
        $response->assertSee($ticket2->title);
    }
}