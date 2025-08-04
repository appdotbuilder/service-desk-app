import React from 'react';
import { Link } from '@inertiajs/react';
import { ServiceDeskLayout } from '@/components/service-desk-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Ticket {
    id: number;
    title: string;
    status: string;
    priority: string;
    created_at: string;
    creator?: User;
    assignee?: User;
}

interface Statistics {
    totalTickets: number;
    pendingTickets: number;
    inProgressTickets: number;
    finishedTickets: number;
}

interface AdditionalStats {
    unassignedTickets?: number;
    totalEmployees?: number;
    totalItStaff?: number;
    ticketsByPriority?: {
        Rendah: number;
        Sedang: number;
        Tinggi: number;
    };
}

interface Props {
    statistics: Statistics;
    recentTickets: Ticket[];
    userRole: string;
    additionalStats?: AdditionalStats;
    [key: string]: unknown;
}

export default function Dashboard({ statistics, recentTickets, userRole, additionalStats }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'finished':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Tinggi':
                return 'text-red-600';
            case 'Sedang':
                return 'text-yellow-600';
            case 'Rendah':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_progress':
                return 'In Progress';
            case 'finished':
                return 'Finished';
            default:
                return status;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'employee':
                return '👤 Employee';
            case 'it_staff':
                return '🔧 IT Staff';
            case 'it_manager':
                return '👑 IT Manager';
            default:
                return role;
        }
    };

    return (
        <ServiceDeskLayout title="Dashboard">
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📊 Service Desk Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Welcome back! Here's an overview of your tickets and activities. ({getRoleLabel(userRole)})
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                                        📋
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Tickets
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {statistics.totalTickets}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white">
                                        ⏳
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Pending
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {statistics.pendingTickets}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                                        🔄
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                                            In Progress
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {statistics.inProgressTickets}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                        ✅
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Finished
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                            {statistics.finishedTickets}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IT Manager Additional Stats */}
                {userRole === 'it_manager' && additionalStats && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">📊 Team Overview</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Employees</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {additionalStats.totalEmployees}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">IT Staff</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {additionalStats.totalItStaff}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Unassigned Tickets</span>
                                    <span className="text-sm font-medium text-red-600">
                                        {additionalStats.unassignedTickets}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">🚨 Priority Breakdown</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
                                        Tinggi (High)
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {additionalStats.ticketsByPriority?.Tinggi || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                                        Sedang (Medium)
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {additionalStats.ticketsByPriority?.Sedang || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                                        Rendah (Low)
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {additionalStats.ticketsByPriority?.Rendah || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">⚡ Quick Actions</h3>
                            <div className="mt-4 space-y-3">
                                <Link
                                    href={route('tickets.index')}
                                    className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    View All Tickets
                                </Link>
                                {(additionalStats.unassignedTickets || 0) > 0 && (
                                    <Link
                                        href={`${route('tickets.index')}?unassigned=1`}
                                        className="block w-full rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-orange-700"
                                    >
                                        Assign Tickets ({additionalStats.unassignedTickets || 0})
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Tickets */}
                <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                📝 Recent Tickets
                            </h3>
                            <Link
                                href={route('tickets.index')}
                                className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                View all
                            </Link>
                        </div>
                    </div>
                    
                    {recentTickets.length === 0 ? (
                        <div className="p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tickets yet</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {userRole === 'employee' ? 'Create your first support ticket to get started.' : 'No tickets have been assigned yet.'}
                            </p>
                            {userRole === 'employee' && (
                                <div className="mt-6">
                                    <Link
                                        href={route('tickets.create')}
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Ticket
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentTickets.map((ticket) => (
                                    <li key={ticket.id}>
                                        <Link
                                            href={route('tickets.show', ticket.id)}
                                            className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <div className="px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {ticket.title}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {userRole !== 'employee' && ticket.creator && `Created by ${ticket.creator.name} • `}
                                                                {userRole === 'employee' && ticket.assignee && `Assigned to ${ticket.assignee.name} • `}
                                                                {new Date(ticket.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(ticket.status)}`}>
                                                            {formatStatus(ticket.status)}
                                                        </span>
                                                        <span className={`text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                                            {ticket.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Quick Actions for Employees */}
                {userRole === 'employee' && (
                    <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Need IT Support?</h3>
                                <p className="mt-1 text-sm opacity-90">
                                    Create a support ticket and our IT team will help you resolve your issue quickly.
                                </p>
                            </div>
                            <Link
                                href={route('tickets.create')}
                                className="flex-shrink-0 rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                            >
                                Create Ticket
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </ServiceDeskLayout>
    );
}