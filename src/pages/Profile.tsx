import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Hash, Layers, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import AuthGuard from '../components/auth/AuthGuard';
import { useData } from '../hooks/useData';
import { Category } from '../types';

const ProfileInfo = () => {
  const { user, logout } = useAuth();
  const { updateProfile } = useData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center p-8">User not found.</div>;
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    updateProfile(user.profile.id, { category: newCategory });
  };

  const profileItems = [
    { icon: User, label: 'Name', value: user.profile.name },
    { icon: Mail, label: 'Email', value: user.supabaseUser.email },
    { icon: Hash, label: 'Bib Number', value: user.profile.bib },
    { icon: Layers, label: 'Category', value: user.profile.category },
    { icon: Shield, label: 'Role', value: user.profile.role },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-surface rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          {profileItems.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              <item.icon className="w-5 h-5 mr-4 text-accent-hover" />
              <div>
                <p className="text-sm text-secondary">{item.label}</p>
                <p className="font-semibold">{item.value || 'N/A'}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <hr className="my-6 border-border" />
        <div className="space-y-4">
            <h3 className="font-bold text-lg">Account Settings</h3>
            <div>
                <label className="block text-sm text-secondary mb-1">Change Category</label>
                <select
                    value={user.profile.category}
                    onChange={handleCategoryChange}
                    className="w-full p-2 rounded bg-bg border border-border"
                >
                    {(['Universitaris', 'Absoluta', 'Sub-18'] as Category[]).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
        </div>

        <hr className="my-6 border-border" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <p>Theme:</p>
                <ThemeToggle />
            </div>
            <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProfilePage = () => (
  <AuthGuard>
    <ProfileInfo />
  </AuthGuard>
);

export default ProfilePage;
