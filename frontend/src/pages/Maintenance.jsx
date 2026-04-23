import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const Maintenance = () => {
    const [events, setEvents] = useState([]);
    const [members, setMembers] = useState([]);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [memberPhone, setMemberPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, membersRes] = await Promise.all([
                axios.get('http://127.0.0.1:5000/api/maintenance/events'),
                axios.get('http://127.0.0.1:5000/api/maintenance/members')
            ]);
            setEvents(eventsRes.data);
            setMembers(membersRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:5000/api/maintenance/events', {
                name: eventName,
                date: eventDate,
                location: eventLocation
            });
            setMessage('Event added successfully');
            setEventName('');
            setEventDate('');
            setEventLocation('');
            fetchData();
        } catch (err) {
            setMessage('Error adding event');
        }
        setLoading(false);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:5000/api/maintenance/members', {
                name: memberName,
                email: memberEmail,
                phone: memberPhone
            });
            setMessage('Member added successfully');
            setMemberName('');
            setMemberEmail('');
            setMemberPhone('');
            fetchData();
        } catch (err) {
            setMessage('Error adding member');
        }
        setLoading(false);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`http://127.0.0.1:5000/api/maintenance/${type}/${id}`);
            fetchData();
        } catch (err) {
            console.error('Error deleting', err);
        }
    };

    return (
        <div className="p-8 space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Maintenance Module (Admin Only)</h1>
            {message && <div className="bg-blue-100 text-blue-700 p-3 rounded">{message}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Events Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Events Management</h2>
                    <form onSubmit={handleAddEvent} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name *</label>
                            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location *</label>
                            <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={18} /> Add Event
                        </button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                                    <th className="p-3 dark:text-gray-300">Name</th>
                                    <th className="p-3 dark:text-gray-300">Date</th>
                                    <th className="p-3 dark:text-gray-300">Location</th>
                                    <th className="p-3 dark:text-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id} className="border-t dark:border-gray-700">
                                        <td className="p-3 dark:text-white">{event.name}</td>
                                        <td className="p-3 dark:text-white">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="p-3 dark:text-white">{event.location}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete('events', event._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Members Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Members Management</h2>
                    <form onSubmit={handleAddMember} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Name *</label>
                            <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                            <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                            <input type="text" value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white" />
                        </div>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={18} /> Add Member
                        </button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                                    <th className="p-3 dark:text-gray-300">Name</th>
                                    <th className="p-3 dark:text-gray-300">Email</th>
                                    <th className="p-3 dark:text-gray-300">Phone</th>
                                    <th className="p-3 dark:text-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(member => (
                                    <tr key={member._id} className="border-t dark:border-gray-700">
                                        <td className="p-3 dark:text-white">{member.name}</td>
                                        <td className="p-3 dark:text-white">{member.email}</td>
                                        <td className="p-3 dark:text-white">{member.phone}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete('members', member._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Maintenance;
