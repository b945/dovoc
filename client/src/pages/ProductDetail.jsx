import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ customerName: '', rating: 5, comment: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`);
                const data = await response.json();
                const found = data.find(p => p.id === parseInt(id));
                setProduct(found);

                // Fetch reviews
                const reviewsRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/product/${id}`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
            } catch (err) {
                console.error("Failed to fetch product or reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newReview, productId: id })
            });
            const data = await res.json();
            if (res.ok) {
                setReviews([...reviews, data]);
                setNewReview({ customerName: '', rating: 5, comment: '' });
                alert('Review submitted successfully!');
            }
        } catch (err) {
            console.error("Failed to submit review", err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    if (!product) {
        return <div className="p-10 text-center">Product not found</div>;
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        addNotification(`Added ${quantity} ${product.name}(s) to cart!`, 'success');
    };

    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <Link to="/shop" className="inline-flex items-center text-dovoc-brown hover:text-dovoc-green mb-6 font-medium">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
                </Link>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="bg-gray-50 p-6 md:p-8 flex items-center justify-center relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-500"
                        />
                        {product.organic && (
                            <span className="absolute top-6 left-6 bg-dovoc-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Organic
                            </span>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="p-6 md:p-12">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-dovoc-dark mb-2">{product.name}</h1>
                                <p className="text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center mb-6 space-x-4">
                            <span className="text-3xl font-bold text-dovoc-green">₹{product.price.toFixed(2)}</span>
                            <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm font-medium text-gray-600">4.9 (128 reviews)</span>
                            </div>
                        </div>

                        <div className="prose text-gray-600 mb-8">
                            <p>{product.description}</p>
                            <p>Handcrafted with care using only the finest organic ingredients.
                                Our {product.name.toLowerCase()} is designed to be gentle on you and the planet.</p>
                        </div>

                        <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                                <Leaf className="h-4 w-4 mr-3 text-dovoc-green" />
                                100% Organic & Natural Materials
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <ShieldCheck className="h-4 w-4 mr-3 text-dovoc-green" />
                                Quality Tested & Certified
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Truck className="h-4 w-4 mr-3 text-dovoc-green" />
                                Free Shipping on orders over ₹500
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 sm:w-32">
                                <button
                                    className="px-3 py-3 text-gray-500 hover:bg-gray-200 rounded-l-lg w-full"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >-</button>
                                <input
                                    type="number"
                                    className="w-full text-center bg-transparent focus:outline-none font-bold"
                                    value={quantity}
                                    readOnly
                                />
                                <button
                                    className="px-3 py-3 text-gray-500 hover:bg-gray-200 rounded-r-lg w-full"
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-dovoc-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-dovoc-green transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>
                    {/* Customer Reviews Section */}
                    <div className="col-span-1 md:col-span-2 p-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-dovoc-dark mb-6">Customer Reviews</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Review List */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map(review => (
                                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-dovoc-dark">{review.customerName}</h4>
                                                <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-500 text-sm mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Review Form */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-bold text-lg text-dovoc-dark mb-4">Write a Review</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Your Name</label>
                                        <input
                                            required
                                            value={newReview.customerName}
                                            onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Rating</label>
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                            className="w-full border rounded px-3 py-2 text-sm"
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Good</option>
                                            <option value="3">3 - Average</option>
                                            <option value="2">2 - Poor</option>
                                            <option value="1">1 - Terrible</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Comment</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            placeholder="Share your experience..."
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-dovoc-dark text-white py-2 rounded-lg font-bold hover:bg-black transition-colors">
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
