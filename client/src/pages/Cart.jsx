import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-dovoc-dark mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any organic goodness yet.</p>
                <Link to="/shop" className="bg-dovoc-green text-white px-8 py-3 rounded-full font-bold hover:bg-dovoc-brown transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-dovoc-dark mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-6 border-b border-gray-100 last:border-0 flex items-center gap-6">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />

                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-dovoc-dark">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                                        <div className="text-dovoc-green font-bold">₹{item.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Link to="/shop" className="inline-flex items-center text-dovoc-brown hover:text-dovoc-green font-medium">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-dovoc-dark mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-dovoc-green font-medium">Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg text-dovoc-dark">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-dovoc-green text-white py-4 rounded-lg font-bold hover:bg-dovoc-brown transition-colors shadow-lg flex justify-center items-center"
                            >
                                <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure Checkout with QR Code Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
