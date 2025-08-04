import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Service Desk - IT Support Made Easy">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                                🎫
                            </div>
                            <span className="text-xl font-bold">ServiceDesk</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <div className="w-full max-w-6xl">
                    <main className="text-center">
                        {/* Hero Section */}
                        <div className="mb-16">
                            <h1 className="mb-6 text-5xl font-bold leading-tight">
                                🎯 IT Support Made <span className="text-blue-600">Simple</span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                                Streamline your IT support process with our comprehensive service desk solution. 
                                Submit tickets, track progress, and get help when you need it most.
                            </p>
                            {!auth.user && (
                                <div className="flex items-center justify-center gap-4">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        Start Using ServiceDesk
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 text-4xl">📝</div>
                                <h3 className="mb-3 text-xl font-semibold">Easy Ticket Creation</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Submit support requests with detailed descriptions, priority levels, and file attachments.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 text-4xl">👥</div>
                                <h3 className="mb-3 text-xl font-semibold">Role-Based Access</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Different access levels for employees, IT staff, and managers with appropriate permissions.
                                </p>
                            </div>
                            
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 text-4xl">📊</div>
                                <h3 className="mb-3 text-xl font-semibold">Real-time Dashboard</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Monitor ticket statistics and track progress with comprehensive analytics.
                                </p>
                            </div>
                        </div>

                        {/* User Roles Section */}
                        <div className="mb-16">
                            <h2 className="mb-8 text-3xl font-bold">👤 Built for Every Role</h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                                    <h3 className="mb-3 text-lg font-semibold text-green-800 dark:text-green-300">🏢 Employees</h3>
                                    <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                                        <li>✓ Create support tickets</li>
                                        <li>✓ Upload attachments</li>
                                        <li>✓ Track ticket status</li>
                                        <li>✓ View ticket history</li>
                                    </ul>
                                </div>
                                
                                <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                                    <h3 className="mb-3 text-lg font-semibold text-blue-800 dark:text-blue-300">🔧 IT Staff</h3>
                                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                                        <li>✓ Manage assigned tickets</li>
                                        <li>✓ Update ticket status</li>
                                        <li>✓ View personal metrics</li>
                                        <li>✓ Access ticket details</li>
                                    </ul>
                                </div>
                                
                                <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
                                    <h3 className="mb-3 text-lg font-semibold text-purple-800 dark:text-purple-300">👑 IT Managers</h3>
                                    <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-400">
                                        <li>✓ View all tickets</li>
                                        <li>✓ Assign tickets to staff</li>
                                        <li>✓ Global analytics</li>
                                        <li>✓ Team management</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Priority Levels */}
                        <div className="mb-16 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                            <h2 className="mb-6 text-2xl font-bold">🚨 Priority Management</h2>
                            <div className="flex items-center justify-center gap-8">
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                                    <span className="font-medium">Rendah (Low)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                                    <span className="font-medium">Sedang (Medium)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                                    <span className="font-medium">Tinggi (High)</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth.user && (
                            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
                                <h2 className="mb-4 text-3xl font-bold">Ready to Get Started? 🚀</h2>
                                <p className="mb-8 text-xl opacity-90">
                                    Join thousands of organizations already using ServiceDesk to streamline their IT support.
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-lg font-medium text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30"
                                    >
                                        Create Account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-lg border-2 border-white px-8 py-3 text-lg font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2024 ServiceDesk. Built with ❤️ for better IT support.</p>
                </footer>
            </div>
        </>
    );
}