import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    department?: string;
}

interface SharedData {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface Props {
    children: React.ReactNode;
    title?: string;
}

export function ServiceDeskLayout({ children, title }: Props) {
    const { auth, flash } = usePage<SharedData>().props;
    const user = auth.user;

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

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: '📊' },
        { name: 'Tickets', href: route('tickets.index'), icon: '🎫' },
    ];

    if (user.role === 'employee') {
        navigation.push({ name: 'Create Ticket', href: route('tickets.create'), icon: '➕' });
    }

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href={route('dashboard')} className="flex items-center space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                            🎫
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">ServiceDesk</span>
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                                                window.location.pathname.startsWith(new URL(item.href).pathname)
                                                    ? 'border-blue-500 text-gray-900 dark:text-white'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            <span className="mr-2">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                <div className="relative ml-3">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {getRoleLabel(user.role)} • {user.department}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.post(route('logout'))}
                                            className="text-sm"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 dark:bg-green-900/20 dark:border-green-600">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 dark:text-green-300">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-600">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300">{flash.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </>
    );
}