import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Gender, Category } from '../types';
import Logo from '../components/common/Logo';

const genders: Gender[] = ['Masculí', 'Femení'];
const categories: Category[] = ['Universitaris', 'Absoluta', 'Sub-18'];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bib: '',
        gender: 'Masculí' as Gender,
        category: 'Absoluta' as Category,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await register({
            email: formData.email,
            pass: formData.password,
            name: formData.name,
            bib: parseInt(formData.bib, 10),
            gender: formData.gender,
            category: formData.category,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Registration successful! Please check your email to verify your account.");
            setTimeout(() => navigate('/login'), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <div className="flex justify-center"><Logo /></div>
                    <h2 className="mt-6 text-3xl font-extrabold text-primary">
                        Create your account
                    </h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input name="name" type="text" required value={formData.name} onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-bg" placeholder="Full Name" />
                    <input name="email" type="email" required value={formData.email} onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-bg" placeholder="Email address" />
                    <input name="password" type="password" required value={formData.password} onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-bg" placeholder="Password (min. 6 characters)" />
                    <input name="bib" type="number" required value={formData.bib} onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-bg" placeholder="Bib Number" />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md bg-bg">
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md bg-bg">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-hover hover:bg-opacity-90 disabled:bg-gray-400">
                            {loading ? <Loader className="animate-spin" /> : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent-hover hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
