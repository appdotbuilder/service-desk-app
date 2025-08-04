<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Build statistics based on user role
        if ($user->isEmployee()) {
            // Employee statistics - only their tickets
            $totalTickets = $user->createdTickets()->count();
            $pendingTickets = $user->createdTickets()->where('status', 'pending')->count();
            $inProgressTickets = $user->createdTickets()->where('status', 'in_progress')->count();
            $finishedTickets = $user->createdTickets()->where('status', 'finished')->count();
            
            $recentTickets = $user->createdTickets()
                ->with(['assignee'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        } elseif ($user->isItStaff()) {
            // IT Staff statistics - only assigned tickets
            $totalTickets = $user->assignedTickets()->count();
            $pendingTickets = $user->assignedTickets()->where('status', 'pending')->count();
            $inProgressTickets = $user->assignedTickets()->where('status', 'in_progress')->count();
            $finishedTickets = $user->assignedTickets()->where('status', 'finished')->count();
            
            $recentTickets = $user->assignedTickets()
                ->with(['creator'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        } else {
            // IT Manager statistics - all tickets
            $totalTickets = Ticket::count();
            $pendingTickets = Ticket::pending()->count();
            $inProgressTickets = Ticket::inProgress()->count();
            $finishedTickets = Ticket::finished()->count();
            
            $recentTickets = Ticket::with(['creator', 'assignee'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        }
        
        // Additional statistics for IT managers
        $additionalStats = [];
        if ($user->isItManager()) {
            $additionalStats = [
                'unassignedTickets' => Ticket::whereNull('assigned_to')->count(),
                'totalEmployees' => User::where('role', 'employee')->count(),
                'totalItStaff' => User::where('role', 'it_staff')->count(),
                'ticketsByPriority' => [
                    'Rendah' => Ticket::where('priority', 'Rendah')->count(),
                    'Sedang' => Ticket::where('priority', 'Sedang')->count(),
                    'Tinggi' => Ticket::where('priority', 'Tinggi')->count(),
                ],
            ];
        }
        
        return Inertia::render('dashboard', [
            'statistics' => [
                'totalTickets' => $totalTickets,
                'pendingTickets' => $pendingTickets,
                'inProgressTickets' => $inProgressTickets,
                'finishedTickets' => $finishedTickets,
            ],
            'recentTickets' => $recentTickets,
            'userRole' => $user->role,
            'additionalStats' => $additionalStats,
        ]);
    }
}