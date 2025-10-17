import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Trophy, PieChart, User, LogOut, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const SideNav = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
      { path: '/', icon: Home, label: 'Boulders', auth: false },
      { path: '/instructions', icon: Info, label: 'Instruccions', auth: false },
      { path: '/leaderboard', icon: Trophy, label: 'Classificació', auth: false },
      { path: '/stats', icon: PieChart, label: 'Estadístiques', auth: false },
      { path: '/profile', icon: User, label: 'Profile', auth: true },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <div className="hidden md:block w-64 bg-surface border-r border-border">
            <nav className="flex flex-col h-full p-4">
                <div className="flex-grow">
                    {navItems.map((item) => {
                        if (item.auth && !isAuthenticated) return null;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-md font-medium transition-colors duration-200',
                                    isActive
                                    ? 'bg-accent text-white'
                                    : 'text-secondary hover:bg-bg'
                                )
                                }
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        )
                    })}
                </div>
                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-md font-medium text-secondary hover:bg-bg"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                )}
            </nav>
        </div>
    );
}

export default SideNav;
