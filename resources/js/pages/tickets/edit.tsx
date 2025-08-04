import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ServiceDeskLayout } from '@/components/service-desk-layout';
import { Button } from '@/components/ui/button';
import { InputError } from '@/components/input-error';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
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
}

interface Props {
    ticket: Ticket;
    userRole: string;
    itStaff: User[];
    [key: string]: unknown;
}

interface EditTicketFormData {
    status: string;
    assigned_to: string;
    [key: string]: string;
}

export default function EditTicket({ ticket, userRole, itStaff }: Props) {
    const { data, setData, patch, processing, errors } = useForm<EditTicketFormData>({
        status: ticket.status,
        assigned_to: ticket.assignee?.id?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('tickets.update', ticket.id));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'border-orange-300 text-orange-800 bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:bg-orange-900/20';
            case 'in_progress':
                return 'border-blue-300 text-blue-800 bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:bg-blue-900/20';
            case 'finished':
                return 'border-green-300 text-green-800 bg-green-50 dark:border-green-600 dark:text-green-300 dark:bg-green-900/20';
            default:
                return 'border-gray-300 text-gray-800 bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-900/20';
        }
    };

    return (
        <ServiceDeskLayout title={`Edit Ticket #${ticket.id}`}>
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('tickets.show', ticket.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            ✏️ Edit Ticket #{ticket.id}
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Update ticket status and assignment
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {ticket.title}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Department: {ticket.department} • Priority: {ticket.priority}
                                </p>
                            </div>
                            
                            <div className="px-6 py-4">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Problem Description
                                </h3>
                                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Update Form */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Update Ticket
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {['pending', 'in_progress', 'finished'].map((status) => (
                                            <label
                                                key={status}
                                                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                                                    data.status === status
                                                        ? getStatusColor(status)
                                                        : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status}
                                                    checked={data.status === status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-1">
                                                    <div className="flex flex-col">
                                                        <span className="block text-sm font-medium">
                                                            {status === 'pending' && '⏳ Pending'}
                                                            {status === 'in_progress' && '🔄 In Progress'}
                                                            {status === 'finished' && '✅ Finished'}
                                                        </span>
                                                        <span className="mt-1 flex items-center text-xs">
                                                            {status === 'pending' && 'Waiting for assignment'}
                                                            {status === 'in_progress' && 'Being worked on'}
                                                            {status === 'finished' && 'Issue resolved'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {data.status === status && (
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                {/* Assignment - Only for IT Managers */}
                                {userRole === 'it_manager' && (
                                    <div>
                                        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Assign to IT Staff
                                        </label>
                                        <select
                                            id="assigned_to"
                                            value={data.assigned_to}
                                            onChange={(e) => setData('assigned_to', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        >
                                            <option value="">Unassigned</option>
                                            {itStaff.map((staff) => (
                                                <option key={staff.id} value={staff.id}>
                                                    {staff.name} ({staff.email})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.assigned_to} className="mt-2" />
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Leave unassigned if the ticket is pending review.
                                        </p>
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                                    <Link href={route('tickets.show', ticket.id)}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Ticket'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Assignment */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Current Assignment
                            </h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {ticket.creator.name}
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{ticket.creator.email}</div>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Assigned To</dt>
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
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Guidelines */}
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                                💡 Update Guidelines
                            </h3>
                            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                                <li>• Set to "In Progress" when actively working on the issue</li>
                                <li>• Mark as "Finished" only when the issue is fully resolved</li>
                                {userRole === 'it_manager' && (
                                    <li>• Assign tickets to appropriate IT staff members</li>
                                )}
                                <li>• Update status promptly to keep users informed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ServiceDeskLayout>
    );
}