import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ServiceDeskLayout } from '@/components/service-desk-layout';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface TicketAttachment {
    id: number;
    filename: string;
    filepath: string;
    mime_type: string;
    file_size: number;
    created_at: string;
}

interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    department: string;
    created_at: string;
    updated_at: string;
    creator: User;
    assignee?: User;
    attachments: TicketAttachment[];
}

interface TicketSharedData {
    auth: {
        user: {
            id: number;
            [key: string]: unknown;
        };
    };
    [key: string]: unknown;
}

interface Props {
    ticket: Ticket;
    userRole: string;
    itStaff: User[];
    [key: string]: unknown;
}

export default function ShowTicket({ ticket, userRole }: Props) {
    const { auth } = usePage<TicketSharedData>().props;
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Tinggi':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
            case 'Sedang':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800';
            case 'Rendah':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
            case 'finished':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800';
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

    const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    const canEdit = () => {
        if (userRole === 'it_manager') return true;
        if (userRole === 'it_staff' && ticket.assignee?.id === auth.user.id) return true;
        return false;
    };

    const canDelete = () => {
        return userRole === 'it_manager';
    };

    return (
        <ServiceDeskLayout title={`Ticket #${ticket.id}`}>
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={route('tickets.index')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                🎫 Ticket #{ticket.id}
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Created {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {canEdit() && (
                            <Link href={route('tickets.edit', ticket.id)}>
                                <Button variant="outline">
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {canDelete() && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this ticket?')) {
                                        router.delete(route('tickets.destroy', ticket.id));
                                    }
                                }}
                                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {ticket.title}
                                </h2>
                                <div className="mt-2 flex items-center space-x-4">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority} Priority
                                    </span>
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                        {formatStatus(ticket.status)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Problem Description
                                </h3>
                                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            </div>

                            {/* Attachments */}
                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Attachments ({ticket.attachments.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {ticket.attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700">
                                                <div className="flex items-center">
                                                    <svg className="mr-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-gray-900 dark:text-white">{attachment.filename}</span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        ({formatFileSize(attachment.file_size)})
                                                    </span>
                                                </div>
                                                <a
                                                    href={`/storage/${attachment.filepath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Ticket Details */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Ticket Details
                            </h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ticket.department}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {ticket.creator.name}
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.creator.email}</div>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {ticket.assignee ? (
                                            <>
                                                {ticket.assignee.name}
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.assignee.email}</div>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(ticket.created_at).toLocaleTimeString()}
                                        </div>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(ticket.updated_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(ticket.updated_at).toLocaleTimeString()}
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Quick Actions */}
                        {canEdit() && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('tickets.edit', ticket.id)}
                                        className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Update Status
                                    </Link>
                                    {userRole === 'it_manager' && !ticket.assignee && (
                                        <Link
                                            href={route('tickets.edit', ticket.id)}
                                            className="block w-full rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-orange-700"
                                        >
                                            Assign to IT Staff
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ServiceDeskLayout>
    );
}