import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Star, Leaf, Heart, Sun, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
import soapImg from '../assets/product-soap.png';
import brushImg from '../assets/product-toothbrush.png';
import bagImg from '../assets/product-bag.png';

const Home = () => {
    const { user } = useAuth();
    const [featuredReviews, setFeaturedReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        customerName: user ? user.name : '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, customerName: user.name }));
        }
    }, [user]);

    useEffect(() => {
        // Fetch featured reviews
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews/featured`)
            .then(res => res.json())
            .then(data => setFeaturedReviews(data))
            .catch(err => console.error("Failed to fetch featured reviews"));
    }, []);
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`)
            .then(res => res.json())
            .then(data => {
                // Determine "featured" logic: e.g., top rated or just first 3
                const featured = data.sort((a, b) => b.rating - a.rating).slice(0, 3);
                setProducts(featured);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setLoading(false);
            });
    }, []);



    return (
        <div className="bg-dovoc-beige min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroBg}
                        alt="Organic Product Flatlay"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto md:text-left md:items-start md:flex md:flex-col md:justify-center h-full w-full">
                    <div className="md:w-1/2">
                        <span className="inline-block bg-dovoc-green px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 rounded-full">
                            New Collection
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight font-serif">
                            Pure. Organic. <br />
                            <span className="text-dovoc-light">Handcrafted.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 font-light text-gray-100 max-w-lg">
                            Embrace a sustainable lifestyle with our curated collection of nature-inspired essentials.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center bg-dovoc-green hover:bg-dovoc-brown text-white font-bold py-4 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-dovoc-brown">
                    <div className="p-6">
                        <Leaf className="h-12 w-12 text-dovoc-green mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">100% Organic</h3>
                        <p className="text-gray-600">Sourced directly from nature, free from harmful chemicals.</p>
                    </div>
                    <div className="p-6">
                        <Heart className="h-12 w-12 text-dovoc-green mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Handmade with Love</h3>
                        <p className="text-gray-600">Crafted by skilled artisans who pour their heart into every item.</p>
                    </div>
                    <div className="p-6">
                        <Sun className="h-12 w-12 text-dovoc-green mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Eco-Conscious</h3>
                        <p className="text-gray-600">Sustainable packaging and carbon-neutral shipping on all orders.</p>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-dovoc-dark mb-2">Our Favorites</h2>
                        <p className="text-dovoc-brown">Best-selling essentials for your daily routine.</p>
                    </div>
                    <Link to="/shop" className="text-dovoc-green font-bold hover:underline hidden md:block">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="text-center col-span-3 text-gray-500">Loading specific content...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center col-span-3 text-gray-500">No featured products available.</div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {(product.organic || product.handmade) && (
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-dovoc-brown text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {product.organic ? "Organic" : "Handmade"}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-bold text-dovoc-dark mb-2">{product.name}</h3>
                                    <div className="flex justify-center items-center mb-4 space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-bold text-dovoc-green">₹{product.price.toFixed(2)}</span>
                                        <button className="bg-dovoc-dark text-white p-2 rounded-full hover:bg-dovoc-green transition-colors">
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link to="/shop" className="text-dovoc-green font-bold hover:underline">
                        View All Products
                    </Link>
                </div>
            </section>

            {/* Testimonials */}
            {/* Testimonials */}
            <section className="bg-dovoc-green/10 py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-dovoc-dark mb-12 text-center">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {featuredReviews.length > 0 ? (
                            featuredReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
                                >
                                    <div className="flex text-yellow-500 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 italic">"{review.comment}"</p>
                                    <div className="flex items-center">
                                        <div className="bg-dovoc-green/10 h-10 w-10 rounded-full flex items-center justify-center text-dovoc-green font-bold mr-3">
                                            {review.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-dovoc-dark text-sm">{review.customerName}</h4>
                                            <p className="text-xs text-gray-400">Verified Buyer</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-500 italic">
                                Check back soon for our customer stories!
                            </div>
                        )}
                    </div>

                    {/* Write a Review Section */}
                    <div className="mt-16 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm md:p-10">
                        <h3 className="text-2xl font-bold text-dovoc-dark mb-2 text-center">Share Your Experience</h3>
                        <p className="text-gray-500 text-center mb-8">We'd love to hear what you think about Dovoc!</p>

                        {user ? (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...newReview, type: 'site' })
                                    });
                                    if (res.ok) {
                                        alert("Thank you! Your review has been submitted for approval.");
                                        setNewReview({ customerName: user.name, rating: 5, comment: '' });
                                    } else {
                                        alert("Failed to submit review.");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert("Error submitting review.");
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Your Name</label>
                                    <input
                                        required
                                        readOnly
                                        value={newReview.customerName}
                                        className="w-full border rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Rating</label>
                                    <div className="flex space-x-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className={`focus:outline-none transition-transform hover:scale-110 ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                <Star className="h-8 w-8 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Comment</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-dovoc-green outline-none"
                                        placeholder="Tell us about your shopping experience..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-dovoc-dark text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                                    Submit Review
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-4">Please log in to leave a review.</p>
                                <Link to="/login" className="inline-block bg-dovoc-green text-white px-6 py-2 rounded-lg font-bold hover:bg-dovoc-dark transition-colors">
                                    Login to Review
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sustainability Message */}
            <section className="py-20 px-4 text-center bg-dovoc-dark text-white">
                <div className="max-w-3xl mx-auto">
                    <Leaf className="h-16 w-16 text-dovoc-green mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Promise to the Planet</h2>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                        At Dovoc Eco Life, we believe in a future where commerce and conservation coexist.
                        For every order placed, we contribute to reforestation projects and ensure our packaging
                        leaves zero trace. Join us in making a difference, one handcrafted product at a time.
                    </p>
                    <Link to="/about" className="inline-block border-2 border-dovoc-green text-dovoc-green hover:bg-dovoc-green hover:text-white font-bold py-3 px-8 rounded-full transition-colors">
                        Learn More About Our Mission
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
