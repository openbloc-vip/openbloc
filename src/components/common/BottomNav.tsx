import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, User, PieChart, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Boulders', auth: false },
    { path: '/instructions', icon: Info, label: 'Instruccions', auth: false },
    { path: '/leaderboard', icon: Trophy, label: 'Classificació', auth: false },
    { path: '/stats', icon: PieChart, label: 'Estadístiques', auth: false },
    { path: '/profile', icon: User, label: 'Profile', auth: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
      <div className="flex justify-around h-16">
        {navItems.map((item) => {
          if (item.auth && !isAuthenticated) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full text-xs gap-1 transition-colors duration-200',
                  isActive
                    ? 'text-accent-hover'
                    : 'text-secondary hover:text-accent-hover'
                )
              }
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
