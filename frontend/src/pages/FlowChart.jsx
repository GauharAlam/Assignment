import React from 'react';
import { ArrowDown, LogIn, LayoutDashboard, Database, RefreshCw, BarChart } from 'lucide-react';

const FlowChart = () => {
    return (
        <div className="p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">Application Flow Chart</h1>
            
            <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
                {/* Step 1 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-blue-500 flex items-center gap-4 w-full">
                    <div className="bg-blue-100 p-3 rounded-full"><LogIn className="text-blue-600" /></div>
                    <div>
                        <h3 className="font-bold dark:text-white">Login Page</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">User authentication with email and masked password.</p>
                    </div>
                </div>

                <ArrowDown className="text-gray-400" />

                {/* Step 2 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-green-500 flex items-center gap-4 w-full">
                    <div className="bg-green-100 p-3 rounded-full"><LayoutDashboard className="text-green-600" /></div>
                    <div>
                        <h3 className="font-bold dark:text-white">Dashboard</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Central hub for navigation based on user role.</p>
                    </div>
                </div>

                <ArrowDown className="text-gray-400" />

                {/* Modules Wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-2 border-purple-500 text-center">
                        <Database className="mx-auto mb-2 text-purple-600" />
                        <h4 className="font-bold text-sm dark:text-white">Maintenance</h4>
                        <p className="text-xs text-gray-500">(Admin Only)</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-2 border-orange-500 text-center">
                        <RefreshCw className="mx-auto mb-2 text-orange-600" />
                        <h4 className="font-bold text-sm dark:text-white">Transactions</h4>
                        <p className="text-xs text-gray-500">(All Roles)</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-2 border-pink-500 text-center">
                        <BarChart className="mx-auto mb-2 text-pink-600" />
                        <h4 className="font-bold text-sm dark:text-white">Reports</h4>
                        <p className="text-xs text-gray-500">(All Roles)</p>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-400 italic text-center">
                    "Login → Dashboard → Modules (based on role)"
                </div>
            </div>
        </div>
    );
};

export default FlowChart;
