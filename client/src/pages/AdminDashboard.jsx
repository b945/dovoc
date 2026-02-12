import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, LogOut, Plus, Edit, Trash2, Eye, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityLogsView from '../components/SecurityLogsView';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'reviews', 'users', 'categories'
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Modal States
    const [selectedOrder, setSelectedOrder] = useState(null); // For viewing customer details
    const [editingProduct, setEditingProduct] = useState(null); // For Add/Edit product
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]); // For handling multiple images

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userStr = localStorage.getItem('adminUser');

        if (!token || !userStr) {
            navigate('/admin');
            return;
        }

        setCurrentUser(JSON.parse(userStr));
        fetchData();
    }, [navigate]);

    const fetchData = () => {
        // Fetch orders
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error("Failed to fetch orders"));

        // Fetch products
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to fetch products"));

        // Fetch reviews
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/all`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error("Failed to fetch reviews"));

        // Fetch users (if super_admin) but we can just fetch and handle error or check role first
        // Simple check: if we are logged in, we try to fetch. The backend should ideally protect this.
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Failed to fetch users"));
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Failed to fetch users"));

        // Fetch categories
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error("Failed to fetch categories"));
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            }
        } catch (err) {
            console.error("Failed to update", err);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order permanently?")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setOrders(orders.filter(o => o.id !== id));
            } else {
                alert("Failed to delete order");
            }
        } catch (err) {
            console.error("Failed to delete order", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (res.ok) {
                alert("User added!");
                fetchData();
                e.target.reset();
            } else {
                const data = await res.json();
                alert(`Failed to add user: ${data.message || res.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users/${id}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
                // Optional: Show success notification
            } else {
                alert("Failed to delete product. It may have already been removed.");
                fetchData(); // Refresh list to sync with server
            }
        } catch (err) {
            console.error("Failed to delete", err);
            alert("An error occurred while deleting.");
        }
    };

    const handleToggleFeature = async (review) => {
        console.log("Toggling feature for review:", review.id, review); // DEBUG
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/${review.id}/feature`, {
                method: 'PATCH'
            });
            console.log("Toggle response status:", res.status); // DEBUG
            if (res.ok) {
                const updated = await res.json();
                console.log("Updated review:", updated); // DEBUG
                // Use loose equality (==) to handle string/number id differences
                setReviews(reviews.map(r => r.id == updated.id ? updated : r));
            } else {
                const text = await res.text();
                console.error("Failed to toggle feature:", text);
                alert("Failed to approve review: " + text);
            }
        } catch (err) {
            console.error("Failed to toggle feature", err);
            alert("Error approving review. Check console.");
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/${id}`, { method: 'DELETE' });
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        if (!name) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, id: Date.now() })
            });
            if (res.ok) {
                const newCat = await res.json();
                setCategories([...categories, newCat]);
                e.target.reset();
                alert("Category added!");
            }
        } catch (err) {
            console.error("Failed to add category", err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/categories/${id}`, { method: 'DELETE' });
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            console.error("Failed to delete category", err);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Show loading state could be better, but for now simple alert or just processing
        // We'll process sequentially
        const newImages = [];
        const btn = e.target;
        btn.disabled = true;

        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok) {
                    newImages.push(data.url);
                } else {
                    console.error("Upload failed for file:", file.name, data.message);
                }
            } catch (err) {
                console.error("Upload error for file:", file.name, err);
            }
        }

        setUploadedImages([...uploadedImages, ...newImages]);
        btn.disabled = false;
        e.target.value = ''; // Reset input
    };

    const handleRemoveImage = (indexToRemove) => {
        setUploadedImages(uploadedImages.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            rating: parseFloat(formData.get('rating')),
            image: formData.get('image'),
            images: uploadedImages, // Use state instead of form data for the array
            stock: parseInt(formData.get('stock')) || 0,
            discount: parseFloat(formData.get('discount')) || 0,
            organic: formData.get('organic') === 'on',
            handmade: formData.get('handmade') === 'on',
            isFeatured: formData.get('isFeatured') === 'on',
            isOutOfStock: formData.get('isOutOfStock') === 'on',
            description: formData.get('description'),
        };

        // sync main image: if we have uploaded images but no main image set (or default), use the first one
        if (productData.images.length > 0 && (!productData.image || productData.image === '/assets/')) {
            productData.image = productData.images[0];
        } else if (productData.image && productData.images.length === 0) {
            // if main image is set but images array is empty, ensure main image is in array
            productData.images = [productData.image];
        }

        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct
            ? `${import.meta.env.VITE_API_URL || ''}/api/products/${editingProduct.id}`
            : `${import.meta.env.VITE_API_URL || ''}/api/products`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                fetchData();
                setIsProductModalOpen(false);
                setEditingProduct(null);
            }
        } catch (err) {
            console.error("Failed to save", err);
        }
    };

    const openProductModal = (product = null) => {
        setEditingProduct(product);
        // Initialize uploaded images
        if (product) {
            setUploadedImages(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []));
        } else {
            setUploadedImages([]);
        }
        setIsProductModalOpen(true);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <nav className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'products' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Products
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'categories' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Categories
                            </button>
                            {currentUser?.role === 'super_admin' && (
                                <>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'users' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Users
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'security' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Security Logs
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'notifications' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('newsletter')}
                                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'newsletter' ? 'bg-dovoc-green text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Newsletter
                            </button>
                        </nav>
                    </div>
                    <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-medium">
                        <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Order Management</h2>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase">Total Revenue</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    ₹{orders.filter(o => o.status !== 'Rejected' && o.status !== 'Cancelled').reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase">Total Orders</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <h3 className="text-gray-500 text-xs font-bold uppercase">Pending Actions</h3>
                                <p className="text-2xl font-bold text-orange-600 mt-1">
                                    {orders.filter(o => o.status === 'Pending Approval').length}
                                </p>
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No orders found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                                    <button onClick={() => setSelectedOrder(order)} className="text-xs text-dovoc-green hover:underline flex items-center mt-1">
                                                        <Eye className="h-3 w-3 mr-1" /> View Details
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    ₹{order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {order.status === 'Pending Approval' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'Approved')}
                                                            className="text-green-600 hover:text-green-900 p-1" title="Approve"
                                                        >
                                                            <Check className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        className="text-red-600 hover:text-red-900 p-1" title="Delete"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Product Management</h2>
                            <button
                                onClick={() => openProductModal()}
                                className="bg-dovoc-dark text-white text-sm px-4 py-2 rounded-md flex items-center hover:bg-black transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Product
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock/Tags</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover bg-gray-100" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 space-x-1">
                                                {product.organic && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Organic</span>}
                                                {product.handmade && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Handmade</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => openProductModal(product)} className="text-blue-600 hover:text-blue-900"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Review Management</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reviews.map(review => {
                                        const product = products.find(p => p.id === review.productId);
                                        return (
                                            <tr key={review.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {review.type === 'site' ? (
                                                        <span className="text-dovoc-green font-bold">Site Review</span>
                                                    ) : (
                                                        product ? product.name : `ID: ${review.productId}`
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {review.customerName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 font-bold">
                                                    {review.rating} ★
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {review.comment}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <button
                                                        onClick={() => handleToggleFeature(review)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${review.isFeatured
                                                            ? 'bg-dovoc-green text-white hover:bg-dovoc-brown'
                                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                            }`}
                                                    >
                                                        {review.isFeatured ? 'Approved' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {
                    activeTab === 'users' && currentUser?.role === 'super_admin' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                            </div>

                            {/* Add User Form */}
                            <div className="p-6 bg-gray-50 border-b">
                                <h3 className="text-sm font-bold mb-4 uppercase text-gray-500">Add New User</h3>
                                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Username</label>
                                        <input required name="username" className="w-full border rounded px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Password</label>
                                        <input required name="password" type="password" className="w-full border rounded px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                                        <input required name="name" className="w-full border rounded px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                        <input required name="email" type="email" className="w-full border rounded px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                                        <select name="role" className="w-full border rounded px-3 py-2 text-sm">
                                            <option value="staff">Staff</option>
                                            <option value="manager">Manager</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="bg-dovoc-dark text-white py-2 px-4 rounded-md text-sm font-bold hover:bg-black transition-colors">
                                        Create User
                                    </button>
                                </form>
                            </div>

                            {/* Users List */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {user.username !== 'admin' && ( // Prevent deleting main admin visual safeguard
                                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'security' && currentUser?.role === 'super_admin' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Security Logs</h2>
                            </div>
                            <SecurityLogsView />
                        </div>
                    )
                }

                {
                    activeTab === 'notifications' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">System Notifications</h2>
                                <button className="text-sm text-dovoc-green hover:underline">Mark all as read</button>
                            </div>
                            <div className="p-6">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                    <p className="text-sm text-blue-700">
                                        <span className="font-bold">System:</span> Security logging active. All admin actions are being recorded.
                                    </p>
                                </div>
                                <p className="text-gray-500 text-sm text-center py-8">No new notifications.</p>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'newsletter' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Newsletter Broadcast</h2>
                                <p className="text-sm text-gray-500">Send updates or discount codes to all subscribers.</p>
                            </div>
                            <div className="p-6 max-w-2xl">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!window.confirm("Send this email to ALL subscribers?")) return;

                                    const formData = new FormData(e.target);
                                    const data = Object.fromEntries(formData.entries());
                                    const btn = e.target.querySelector('button');

                                    try {
                                        btn.disabled = true;
                                        btn.textContent = "Sending...";

                                        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/newsletter/broadcast`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(data)
                                        });

                                        const result = await res.json();
                                        if (res.ok) {
                                            alert(result.message);
                                            e.target.reset();
                                        } else {
                                            alert(result.message || "Failed to send");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error sending broadcast");
                                    } finally {
                                        btn.disabled = false;
                                        btn.textContent = "Send Broadcast";
                                    }
                                }} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                                        <input required name="subject" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-dovoc-green focus:border-dovoc-green" placeholder="e.g., Summer Sale Starts Now!" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                                        <textarea required name="message" rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-dovoc-green focus:border-dovoc-green" placeholder="Write your message here..."></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code (Optional)</label>
                                        <input name="discountCode" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-dovoc-green focus:border-dovoc-green font-mono uppercase" placeholder="SAVE20" />
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-dovoc-dark text-white font-bold py-3 px-6 rounded-md hover:bg-dovoc-green transition-colors flex items-center justify-center">
                                            <Send className="h-5 w-5 mr-2" /> Send Broadcast
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'categories' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Category Management</h2>
                            </div>
                            <div className="p-6 bg-gray-50 border-b">
                                <h3 className="text-sm font-bold mb-4 uppercase text-gray-500">Add New Category</h3>
                                <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Category Name</label>
                                        <input required name="name" className="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. Skin Care" />
                                    </div>
                                    <button type="submit" className="bg-dovoc-dark text-white py-2 px-4 rounded-md text-sm font-bold hover:bg-black transition-colors">
                                        Add Category
                                    </button>
                                </form>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map(cat => (
                                            <tr key={cat.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

            </main >

            {/* Order Details Modal */}
            < AnimatePresence >
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-900">Order Details #{selectedOrder.id}</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Customer Information</h4>
                                    <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                                        <p><span className="font-medium">Address:</span> {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.zip}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Items</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {selectedOrder.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-gray-400 text-xs ml-2">x{item.quantity}</span>
                                                </div>
                                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <div className="font-bold text-lg">
                                        Total: ₹{selectedOrder.total.toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => window.print()}
                                        className="text-dovoc-dark underline text-sm font-medium hover:text-black"
                                    >
                                        Print Invoice
                                    </button>
                                </div>

                                {/* Status Timeline */}
                                <div className="mt-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Order Status</h4>
                                    <div className="flex items-center justify-between relative">
                                        {['Pending Approval', 'Approved', 'Shipped', 'Delivered'].map((step, index, arr) => {
                                            const currentStatusIndex = arr.indexOf(selectedOrder.status);
                                            const stepIndex = arr.indexOf(step);
                                            const isCompleted = currentStatusIndex >= stepIndex;
                                            const isCurrent = currentStatusIndex === stepIndex;

                                            return (
                                                <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300
                                                            ${isCompleted ? 'bg-dovoc-green text-white' : 'bg-gray-200 text-gray-500'}
                                                            ${isCurrent ? 'ring-4 ring-green-100' : ''}
                                                        `}>
                                                        {index + 1}
                                                    </div>
                                                    <span className={`text-[10px] mt-2 font-medium ${isCompleted ? 'text-dovoc-green' : 'text-gray-400'}`}>
                                                        {step}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {/* Connecting Line */}
                                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0">
                                            <div
                                                className="h-full bg-dovoc-green transition-all duration-300"
                                                style={{ width: `${Math.max(0, (['Pending Approval', 'Approved', 'Shipped', 'Delivered'].indexOf(selectedOrder.status) / 3) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Actions inside Modal for easier management */}
                            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
                                {selectedOrder.status === 'Pending Approval' && (
                                    <>
                                        <button onClick={() => { updateStatus(selectedOrder.id, 'Approved'); setSelectedOrder({ ...selectedOrder, status: 'Approved' }); }} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Approve</button>
                                        <button onClick={() => { updateStatus(selectedOrder.id, 'Rejected'); setSelectedOrder(null); }} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
                                    </>
                                )}
                                {selectedOrder.status === 'Approved' && (
                                    <button onClick={() => { updateStatus(selectedOrder.id, 'Shipped'); setSelectedOrder({ ...selectedOrder, status: 'Shipped' }); }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Mark Shipped</button>
                                )}
                                {selectedOrder.status === 'Shipped' && (
                                    <button onClick={() => { updateStatus(selectedOrder.id, 'Delivered'); setSelectedOrder({ ...selectedOrder, status: 'Delivered' }); }} className="px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-800">Mark Delivered</button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Product Edit/Add Modal */}
            < AnimatePresence >
                {isProductModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsProductModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <form onSubmit={handleSaveProduct}>
                                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                                </div>
                                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                                            <input required name="name" defaultValue={editingProduct?.name} className="w-full border rounded px-3 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                            <select name="category" defaultValue={editingProduct?.category || (categories.length > 0 ? categories[0].name : "")} className="w-full border rounded px-3 py-2 text-sm">
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                                            <input required type="number" step="0.01" name="price" defaultValue={editingProduct?.price} className="w-full border rounded px-3 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Rating</label>
                                            <input type="number" step="0.1" max="5" name="rating" defaultValue={editingProduct?.rating || 5} className="w-full border rounded px-3 py-2 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                                            <input required type="number" name="stock" defaultValue={editingProduct?.stock || 0} className="w-full border rounded px-3 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Discount (%)</label>
                                            <input type="number" name="discount" defaultValue={editingProduct?.discount || 0} className="w-full border rounded px-3 py-2 text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Main Image</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    try {
                                                        // Show loading state if needed
                                                        e.target.disabled = true;
                                                        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        const data = await res.json();
                                                        if (res.ok) {
                                                            // Set the URL in the hidden input or state
                                                            const urlInput = document.getElementById('mainImageInput');
                                                            if (urlInput) {
                                                                urlInput.value = data.url;
                                                                // Trigger change event if needed for React state, 
                                                                // but this form uses native FormData on submit so value attribute is enough if we weren't controlled.
                                                                // Since we are controlled (defaultValue), we might need to rely on FormData picking it up or update state if we refactor.
                                                                // Actually, the form uses defaultValue for editing, but submits via FormData(e.target).
                                                                // So updating the input value is crucial.
                                                            }
                                                        } else {
                                                            alert('Upload failed');
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Upload error');
                                                    } finally {
                                                        e.target.disabled = false;
                                                    }
                                                }}
                                                className="w-full border rounded px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <input
                                            id="mainImageInput"
                                            required
                                            name="image"
                                            defaultValue={editingProduct?.image || '/assets/'}
                                            className="w-full border rounded px-3 py-2 text-sm mt-2 bg-gray-50 text-gray-600"
                                            placeholder="Image URL will appear here..."
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Additional Images</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                                <Plus className="h-4 w-4 mr-2" /> Upload Images
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>

                                        {uploadedImages.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mt-2">
                                                {uploadedImages.map((img, idx) => (
                                                    <div key={idx} className="relative group border rounded-md overflow-hidden h-20 w-20">
                                                        <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Hidden textarea for compatibility/visual debug if needed, or just removed. We removed it. */}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                        <textarea required name="description" rows="3" defaultValue={editingProduct?.description} className="w-full border rounded px-3 py-2 text-sm"></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex items-center space-x-2 text-sm">
                                                <input type="checkbox" name="organic" defaultChecked={editingProduct?.organic} className="rounded text-dovoc-green" />
                                                <span>Organic?</span>
                                            </label>
                                            <label className="flex items-center space-x-2 text-sm">
                                                <input type="checkbox" name="handmade" defaultChecked={editingProduct?.handmade} className="rounded text-dovoc-green" />
                                                <span>Handmade?</span>
                                            </label>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex items-center space-x-2 text-sm">
                                                <input type="checkbox" name="isFeatured" defaultChecked={editingProduct?.isFeatured} className="rounded text-dovoc-green" />
                                                <span>Featured?</span>
                                            </label>
                                            <label className="flex items-center space-x-2 text-sm">
                                                <input type="checkbox" name="isOutOfStock" defaultChecked={editingProduct?.isOutOfStock} className="rounded text-red-500" />
                                                <span className="text-red-600 font-bold">Out of Stock?</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-dovoc-dark text-white rounded-md text-sm font-medium hover:bg-black">Save Product</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default AdminDashboard;
