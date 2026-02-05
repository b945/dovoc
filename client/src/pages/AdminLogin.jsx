import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // In a real app, store token in localStorage/Context
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user)); // Store user info (role, name)
                navigate('/admin/dashboard');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Login failed. Check server.");
        }
    };

    return (
        <div className="bg-dovoc-beige min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <ShieldCheck className="h-12 w-12 text-dovoc-green mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-dovoc-dark">Admin Login</h1>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-dovoc-dark text-white py-3 rounded-md font-bold hover:bg-black transition-colors">
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
