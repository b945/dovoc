import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import qrCode from '../assets/qrcode.png';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async () => {
        setIsSubmitting(true);

        const orderData = {
            customer: formData,
            items: cartItems,
            total: cartTotal
            // status & custom ID handled by backend
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log("Order Submitted Successfully");
                clearCart();
                navigate('/order-success');
            } else {
                console.error("Failed to submit order");
                alert("Something went wrong. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Network error. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0 && !isSubmitting) {
        navigate('/shop');
        return null;
    }

    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">

                {/* Order Summary Side (Left on Desktop) */}
                <div className="bg-gray-50 p-8 md:w-1/3 border-r border-gray-100">
                    <h3 className="text-lg font-bold text-dovoc-dark mb-4">Order Summary</h3>
                    <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <div className="text-gray-400">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-dovoc-dark font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total To Pay</span>
                        <span className="text-dovoc-green">₹{cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Main Content Side */}
                <div className="p-8 md:w-2/3">
                    {step === 1 ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-dovoc-dark mb-6">Shipping Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input required name="zip" value={formData.zip} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-dovoc-dark text-white py-3 rounded-lg font-bold hover:bg-black transition-colors mt-4">
                                Continue to Payment
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <button onClick={() => setStep(1)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
                                Change Details
                            </button>
                            <h2 className="text-2xl font-bold text-dovoc-dark mb-2">Scan to Pay</h2>
                            <p className="text-gray-500 mb-8">Scan the QR code below using any UPI app.</p>

                            <div className="flex justify-center mb-8">
                                <div className="p-4 bg-white border-2 border-dovoc-green rounded-xl shadow-inner">
                                    <img src={qrCode} alt="Payment QR Code" className="w-64 h-64 object-contain" />
                                </div>
                            </div>

                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm mb-6">
                                <p className="font-bold">Note:</p>
                                <p>After scanning, please click the button below. Your order will be marked as "Pending Approval" until we verify the transaction.</p>
                            </div>

                            <button onClick={handlePaymentSubmit} className="w-full bg-dovoc-green text-white py-3 rounded-lg font-bold hover:bg-dovoc-brown transition-colors">
                                I Have Paid
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
