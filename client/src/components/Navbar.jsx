import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Leaf, LayoutDashboard } from 'lucide-react';

import { useCart } from '../context/CartContext';

import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setIsSearchOpen(false);
            setSearchTerm("");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        // Only show Shop if user is logged in, else show Login/Register hints via behavior or explicit links
        // But per request, strict restriction. We'll show Shop, but it redirects.
        { name: 'Shop', path: '/shop' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Leaf className="h-8 w-8 text-dovoc-green transform group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-2xl font-bold font-serif text-dovoc-dark tracking-wide">
                            Dovoc <span className="text-dovoc-green">Eco Life</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-lg font-medium transition-colors hover:text-dovoc-green ${isActive ? 'text-dovoc-green' : 'text-dovoc-brown'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-6 text-dovoc-brown relative">
                        {/* Search Desktop Only */}
                        <div className="hidden md:block relative">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearch} className="absolute right-full mr-2 flex items-center bg-white rounded-full border border-gray-300 px-3 py-1 shadow-sm">
                                    <input
                                        autoFocus
                                        type="text"
                                        className="outline-none text-sm w-32 md:w-48 bg-transparent"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onBlur={() => !searchTerm && setIsSearchOpen(false)}
                                    />
                                    <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-500 ml-1">
                                        <X className="h-3 w-3" />
                                    </button>
                                </form>
                            ) : null}
                        </div>

                        <button onClick={() => isSearchOpen ? handleSearch({ preventDefault: () => { } }) : setIsSearchOpen(true)} className="hidden md:block hover:text-dovoc-green transition-colors">
                            <Search className="h-6 w-6" />
                        </button>

                        <Link to="/cart" className="relative hover:text-dovoc-green transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-dovoc-green text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group/user">
                                <button className="flex items-center space-x-2 text-sm font-medium hover:text-dovoc-green">
                                    <User className="h-5 w-5" />
                                    <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200">
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 text-sm font-bold border border-dovoc-green text-dovoc-green px-3 py-1 rounded-full hover:bg-dovoc-green hover:text-white transition-colors">
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        )}


                        <Link to="/admin" className="hidden md:block hover:text-dovoc-green transition-colors" title="Admin Panel">
                            <LayoutDashboard className="h-5 w-5" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button onClick={toggleMenu} className="md:hidden text-dovoc-brown ml-2">
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-dovoc-beige border-t border-gray-200">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 text-lg font-medium text-dovoc-brown hover:text-dovoc-green hover:bg-gray-50 rounded-md"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col space-y-3 px-3">
                            {user ? (
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center text-red-600 font-medium">
                                    <LogOut className="h-5 w-5 mr-2" /> Logout ({user.name})
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center text-dovoc-green font-bold">
                                    <User className="h-5 w-5 mr-2" /> Login / Sign Up
                                </Link>
                            )}

                            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center text-dovoc-brown">
                                <LayoutDashboard className="h-5 w-5 mr-2" /> Admin
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
