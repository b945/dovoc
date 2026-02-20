import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Leaf, Lock, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addNotification } = useNotification();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-dovoc-beige flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
                    <p className="text-gray-600 mb-4">This password reset link is invalid or incomplete.</p>
                    <Link to="/login" className="text-dovoc-green hover:underline">Return to Login</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addNotification("Passwords don't match", 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, newPassword: password })
            });
            const data = await res.json();

            if (res.ok) {
                addNotification('Password updated successfully', 'success');
                navigate('/login');
            } else {
                addNotification(data.message || 'Failed to reset password', 'error');
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
                    <h2 className="text-2xl font-bold text-dovoc-dark">Set New Password</h2>
                    <p className="text-gray-500">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-dovoc-green focus:outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-dovoc-green"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dovoc-dark text-white py-3 rounded-md font-bold hover:bg-dovoc-green transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
