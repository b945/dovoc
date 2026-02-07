import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Leaf } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/shop';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                login(data);
                addNotification(`Welcome back, ${data.name}!`, 'success');
                navigate(from, { replace: true });
            } else {
                addNotification(data.message || 'Login failed', 'error');
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
                    <Leaf className="h-10 w-10 text-dovoc-green mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-dovoc-dark">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to continue shopping</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-xs text-dovoc-green hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            required
                            type="password"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dovoc-dark text-white py-3 rounded-md font-bold hover:bg-dovoc-green transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-dovoc-green font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
