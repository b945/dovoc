import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { addToCart } = useCart();
    const { addNotification } = useNotification();

    // Update searchTerm when URL changes
    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    useEffect(() => {
        fetch('${import.meta.env.VITE_API_URL}/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);
    const [priceRange, setPriceRange] = useState(5000);
    const [onlyOrganic, setOnlyOrganic] = useState(false);
    const [onlyHandmade, setOnlyHandmade] = useState(false);

    const categories = ["All", "Personal Care", "Bags", "Accessories"];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesPrice = product.price <= priceRange;
        const matchesOrganic = onlyOrganic ? product.organic : true;
        const matchesHandmade = onlyHandmade ? product.handmade : true;

        return matchesSearch && matchesCategory && matchesPrice && matchesOrganic && matchesHandmade;
    });

    const handleAddToCart = (product) => {
        addToCart(product);
        addNotification(`Added ${product.name} to cart!`, 'success');
    };

    return (
        <div className="bg-dovoc-beige min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                        <div className="flex items-center space-x-2 mb-6">
                            <Filter className="h-5 w-5 text-dovoc-green" />
                            <h2 className="text-xl font-bold text-dovoc-dark">Filters</h2>
                        </div>

                        {/* Search (Mobile/Tablet visible here too or move to main) */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-dovoc-green/50"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Category</h3>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`block w-full text-left px-2 py-1 rounded transition-colors ${selectedCategory === cat ? 'bg-dovoc-green text-white' : 'text-dovoc-brown hover:bg-gray-100'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Max Price: ₹{priceRange}</h3>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-dovoc-green h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={onlyOrganic}
                                    onChange={(e) => setOnlyOrganic(e.target.checked)}
                                    className="rounded text-dovoc-green focus:ring-dovoc-green"
                                />
                                <span>Organic Only</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={onlyHandmade}
                                    onChange={(e) => setOnlyHandmade(e.target.checked)}
                                    className="rounded text-dovoc-green focus:ring-dovoc-green"
                                />
                                <span>Handmade Only</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-dovoc-dark">Shop All</h1>
                        <span className="text-gray-500">{filteredProducts.length} results</span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">No products found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setPriceRange(100); setOnlyOrganic(false); }}
                                className="mt-4 text-dovoc-green underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredProducts.map((product, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={product.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.organic && (
                                            <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                                Organic
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-dovoc-dark line-clamp-1">{product.name}</h3>
                                            <span className="text-dovoc-green font-bold">₹{product.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-yellow-400 text-xs">
                                                <Star className="h-3 w-3 fill-current" />
                                                <span className="ml-1 text-gray-400">({product.rating})</span>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex items-center space-x-1 bg-dovoc-brown text-white text-xs px-3 py-2 rounded-full hover:bg-dovoc-green transition-colors"
                                            >
                                                <ShoppingCart className="h-3 w-3" />
                                                <span>Add</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
