import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Search, RefreshCcw, XCircle } from 'lucide-react';

const Transactions = () => {
    // Add Membership state
    const [addForm, setAddForm] = useState({
        membershipNumber: '',
        memberId: '',
        eventId: '',
        duration: '6 months', // default
        startDate: new Date().toISOString().split('T')[0],
        receiveNotifications: false
    });

    // Update Membership state
    const [searchNumber, setSearchNumber] = useState('');
    const [updateData, setUpdateData] = useState(null);
    const [extendDuration, setExtendDuration] = useState('6 months');
    
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            const [membersRes, eventsRes] = await Promise.all([
                axios.get('http://localhost:5001/api/maintenance/members'),
                axios.get('http://localhost:5001/api/maintenance/events')
            ]);
            setMembers(membersRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            console.error('Error fetching master data', err);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        // Basic validation
        if (!addForm.membershipNumber || !addForm.memberId || !addForm.eventId) {
            setError('All fields are mandatory');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/transactions/add', {
                ...addForm,
                receiveNotifications: addForm.receiveNotifications ? 'Yes' : 'No'
            });
            setMessage('Membership added successfully');
            setAddForm({
                membershipNumber: '',
                memberId: '',
                eventId: '',
                duration: '6 months',
                startDate: new Date().toISOString().split('T')[0],
                receiveNotifications: false
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding membership');
        }
    };

    const handleSearch = async () => {
        setError('');
        setUpdateData(null);
        if (!searchNumber) {
            setError('Membership Number is mandatory for search');
            return;
        }
        try {
            const res = await axios.get(`http://localhost:5001/api/transactions/${searchNumber}`);
            setUpdateData(res.data);
        } catch (err) {
            setError('Membership not found');
        }
    };

    const handleUpdateAction = async (action) => {
        try {
            await axios.patch(`http://localhost:5001/api/transactions/update/${searchNumber}`, {
                action,
                duration: action === 'Extend' ? extendDuration : undefined
            });
            setMessage(`Membership ${action}ed successfully`);
            setUpdateData(null);
            setSearchNumber('');
        } catch (err) {
            setError(`Error performing ${action}`);
        }
    };

    return (
        <div className="p-8 space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions Module</h1>
            
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Add Membership Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Add Membership</h2>
                    <form onSubmit={handleAddSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 border-l-4 border-blue-500">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Membership Number *</label>
                            <input 
                                type="text" 
                                value={addForm.membershipNumber} 
                                onChange={(e) => setAddForm({...addForm, membershipNumber: e.target.value})} 
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Select Member *</label>
                            <select 
                                value={addForm.memberId} 
                                onChange={(e) => setAddForm({...addForm, memberId: e.target.value})} 
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">-- Choose Member --</option>
                                {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Select Event *</label>
                            <select 
                                value={addForm.eventId} 
                                onChange={(e) => setAddForm({...addForm, eventId: e.target.value})} 
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">-- Choose Event --</option>
                                {events.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300 mb-2">Duration *</label>
                            <div className="flex space-x-4">
                                {['6 months', '1 year', '2 years'].map(d => (
                                    <label key={d} className="flex items-center space-x-2 cursor-pointer dark:text-gray-300">
                                        <input 
                                            type="radio" 
                                            name="duration" 
                                            value={d} 
                                            checked={addForm.duration === d} 
                                            onChange={(e) => setAddForm({...addForm, duration: e.target.value})} 
                                            className="text-blue-600"
                                        />
                                        <span>{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium dark:text-gray-300">Start Date *</label>
                                <input 
                                    type="date" 
                                    value={addForm.startDate} 
                                    onChange={(e) => setAddForm({...addForm, startDate: e.target.value})} 
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex-1 pt-6">
                                <label className="flex items-center space-x-2 cursor-pointer dark:text-gray-300">
                                    <input 
                                        type="checkbox" 
                                        checked={addForm.receiveNotifications} 
                                        onChange={(e) => setAddForm({...addForm, receiveNotifications: e.target.checked})} 
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                    <span>Receive Notifications (Yes/No)</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
                            <Save size={18} /> Save Membership
                        </button>
                    </form>
                </section>

                {/* Update Membership Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Update Membership</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6 border-l-4 border-green-500">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium dark:text-gray-300">Membership Number *</label>
                                <input 
                                    type="text" 
                                    value={searchNumber} 
                                    onChange={(e) => setSearchNumber(e.target.value)} 
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter number to search"
                                />
                            </div>
                            <button onClick={handleSearch} className="mt-6 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 dark:text-white">
                                <Search size={18} /> Search
                            </button>
                        </div>

                        {updateData && (
                            <div className="space-y-4 border-t pt-4 dark:border-gray-700">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-semibold dark:text-gray-400">Member:</span> <span className="dark:text-white">{updateData.memberId?.name}</span></div>
                                    <div><span className="font-semibold dark:text-gray-400">Event:</span> <span className="dark:text-white">{updateData.eventId?.name}</span></div>
                                    <div><span className="font-semibold dark:text-gray-400">Current End:</span> <span className="dark:text-white">{new Date(updateData.endDate).toLocaleDateString()}</span></div>
                                    <div><span className="font-semibold dark:text-gray-400">Status:</span> <span className={`px-2 py-0.5 rounded text-xs ${updateData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{updateData.status}</span></div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Extend Membership For:</label>
                                        <div className="flex space-x-4 mb-4">
                                            {['6 months', '1 year', '2 years'].map(d => (
                                                <label key={d} className="flex items-center space-x-2 cursor-pointer dark:text-gray-300">
                                                    <input 
                                                        type="radio" 
                                                        name="extendDuration" 
                                                        value={d} 
                                                        checked={extendDuration === d} 
                                                        onChange={(e) => setExtendDuration(e.target.value)} 
                                                    />
                                                    <span>{d}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button onClick={() => handleUpdateAction('Extend')} className="w-full bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                                            <RefreshCcw size={18} /> Confirm Extension
                                        </button>
                                    </div>
                                    
                                    <button onClick={() => handleUpdateAction('Cancel')} className="w-full bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-200">
                                        <XCircle size={18} /> Cancel Membership
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Transactions;
