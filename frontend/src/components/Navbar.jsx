import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Settings, Repeat, BarChart2, GitBranch } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex space-x-6 items-center">
                <span className="font-bold text-xl mr-4">EMS</span>
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-400">
                    <Home size={18} /> <span>Dashboard</span>
                </Link>
                {user.role === 'Admin' && (
                    <Link to="/maintenance" className="flex items-center space-x-1 hover:text-blue-400">
                        <Settings size={18} /> <span>Maintenance</span>
                    </Link>
                )}
                <Link to="/transactions" className="flex items-center space-x-1 hover:text-blue-400">
                    <Repeat size={18} /> <span>Transactions</span>
                </Link>
                <Link to="/reports" className="flex items-center space-x-1 hover:text-blue-400">
                    <BarChart2 size={18} /> <span>Reports</span>
                </Link>
                <Link to="/flow-chart" className="flex items-center space-x-1 hover:text-blue-400">
                    <GitBranch size={18} /> <span>Flow Chart</span>
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm bg-blue-600 px-2 py-1 rounded">{user.role}</span>
                <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-400">
                    <LogOut size={18} /> <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
