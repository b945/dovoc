import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                login(data);
                addNotification('Account created successfully!', 'success');
                navigate('/shop');
            } else {
                addNotification(data.message || 'Registration failed', 'error');
            }
        } catch (err) {
            console.error(err);
            addNotification('Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dovoc-beige flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <img src="/dovoc-logo-new.png" alt="Dovoc" className="h-16 mx-auto mb-4 object-contain" />
                    <h2 className="text-2xl font-bold text-dovoc-dark">Create Account</h2>
                    <p className="text-gray-500">Join our community of eco-conscious shoppers</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none pr-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-dovoc-green"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dovoc-dark text-white py-3 rounded-md font-bold hover:bg-dovoc-green transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-dovoc-green font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
