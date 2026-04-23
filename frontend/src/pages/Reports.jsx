import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
    const { user } = useAuth();
    const [memberships, setMemberships] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [memRes, userRes] = await Promise.all([
                axios.get('http://localhost:5001/api/reports/memberships'),
                user.role === 'Admin' ? axios.get('http://localhost:5001/api/reports/users') : Promise.resolve({ data: [] })
            ]);
            setMemberships(memRes.data);
            setUsers(userRes.data);
        } catch (err) {
            console.error('Error fetching reports', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading reports...</div>;

    return (
        <div className="p-8 space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports Module</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Membership Report</h2>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                                <th className="p-4 dark:text-gray-300">Membership #</th>
                                <th className="p-4 dark:text-gray-300">Member</th>
                                <th className="p-4 dark:text-gray-300">Event</th>
                                <th className="p-4 dark:text-gray-300">Duration</th>
                                <th className="p-4 dark:text-gray-300">End Date</th>
                                <th className="p-4 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberships.map(m => (
                                <tr key={m._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="p-4 dark:text-white font-medium">{m.membershipNumber}</td>
                                    <td className="p-4 dark:text-white">{m.memberId?.name}</td>
                                    <td className="p-4 dark:text-white">{m.eventId?.name}</td>
                                    <td className="p-4 dark:text-white">{m.duration}</td>
                                    <td className="p-4 dark:text-white">{new Date(m.endDate).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${m.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {user.role === 'Admin' && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">System Users</h2>
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                                    <th className="p-4 dark:text-gray-300">Email</th>
                                    <th className="p-4 dark:text-gray-300">Role</th>
                                    <th className="p-4 dark:text-gray-300">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="p-4 dark:text-white">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 dark:text-white">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Reports;
