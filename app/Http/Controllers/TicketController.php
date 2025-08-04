<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Build query based on user role
        $query = Ticket::with(['creator', 'assignee']);
        
        if ($user->isEmployee()) {
            // Employees can only see their own tickets
            $query->where('created_by', $user->id);
        } elseif ($user->isItStaff()) {
            // IT staff can only see tickets assigned to them
            $query->where('assigned_to', $user->id);
        }
        // IT managers can see all tickets (no additional filtering)
        
        $tickets = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        
        // Only employees can create tickets
        if (!$user->isEmployee()) {
            return redirect()->route('tickets.index')
                ->with('error', 'Only employees can create tickets.');
        }
        
        return Inertia::render('tickets/create', [
            'userDepartment' => $user->department,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $user = auth()->user();
        
        // Only employees can create tickets
        if (!$user->isEmployee()) {
            return redirect()->route('tickets.index')
                ->with('error', 'Only employees can create tickets.');
        }
        
        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'department' => $request->department,
            'created_by' => $user->id,
            'status' => 'pending',
        ]);
        
        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = $file->getClientOriginalName();
                $path = $file->store('ticket-attachments', 'public');
                
                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'filename' => $filename,
                    'filepath' => $path,
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }
        
        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $user = auth()->user();
        
        // Check permissions
        if ($user->isEmployee() && $ticket->created_by !== $user->id) {
            return redirect()->route('tickets.index')
                ->with('error', 'You can only view your own tickets.');
        }
        
        if ($user->isItStaff() && $ticket->assigned_to !== $user->id) {
            return redirect()->route('tickets.index')
                ->with('error', 'You can only view tickets assigned to you.');
        }
        
        $ticket->load(['creator', 'assignee', 'attachments']);
        
        // Get IT staff for assignment (only for IT managers)
        $itStaff = [];
        if ($user->isItManager()) {
            $itStaff = User::where('role', 'it_staff')->get(['id', 'name']);
        }
        
        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'userRole' => $user->role,
            'itStaff' => $itStaff,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        $user = auth()->user();
        
        // Only IT staff and managers can edit tickets
        if (!$user->canManageTickets()) {
            return redirect()->route('tickets.index')
                ->with('error', 'You cannot edit tickets.');
        }
        
        // IT staff can only edit their assigned tickets
        if ($user->isItStaff() && $ticket->assigned_to !== $user->id) {
            return redirect()->route('tickets.index')
                ->with('error', 'You can only edit tickets assigned to you.');
        }
        
        $ticket->load(['creator', 'assignee']);
        
        // Get IT staff for assignment (only for IT managers)
        $itStaff = [];
        if ($user->isItManager()) {
            $itStaff = User::where('role', 'it_staff')->get(['id', 'name']);
        }
        
        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'userRole' => $user->role,
            'itStaff' => $itStaff,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $user = auth()->user();
        
        // IT staff can only edit their assigned tickets
        if ($user->isItStaff() && $ticket->assigned_to !== $user->id) {
            return redirect()->route('tickets.index')
                ->with('error', 'You can only edit tickets assigned to you.');
        }
        
        $updateData = ['status' => $request->status];
        
        // Only IT managers can assign tickets
        if ($user->isItManager() && $request->has('assigned_to')) {
            $updateData['assigned_to'] = $request->assigned_to;
        }
        
        $ticket->update($updateData);
        
        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $user = auth()->user();
        
        // Only IT managers can delete tickets
        if (!$user->isItManager()) {
            return redirect()->route('tickets.index')
                ->with('error', 'Only IT managers can delete tickets.');
        }
        
        // Delete attachments from storage
        foreach ($ticket->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->filepath);
        }
        
        $ticket->delete();
        
        return redirect()->route('tickets.index')
            ->with('success', 'Ticket deleted successfully.');
    }
}