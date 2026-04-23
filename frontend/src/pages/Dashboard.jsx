import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Welcome, {user.email}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">You are logged in as <span className="font-semibold text-blue-600">{user.role}</span>.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.role === 'Admin' && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                        <h2 className="text-xl font-bold mb-2 dark:text-white">Maintenance</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage master data like events and members.</p>
                        <Link to="/maintenance" className="text-blue-500 hover:underline font-medium">Go to Maintenance &rarr;</Link>
                    </div>
                )}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-2 dark:text-white">Transactions</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Perform operations like adding or updating memberships.</p>
                    <Link to="/transactions" className="text-green-500 hover:underline font-medium">Go to Transactions &rarr;</Link>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                    <h2 className="text-xl font-bold mb-2 dark:text-white">Reports</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">View lists of memberships, users, and other data.</p>
                    <Link to="/reports" className="text-purple-500 hover:underline font-medium">Go to Reports &rarr;</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
