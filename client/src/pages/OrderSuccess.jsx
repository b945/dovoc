import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-dovoc-beige text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-dovoc-green">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-dovoc-dark mb-4">Order Submitted!</h1>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 flex items-start text-left">
                    <Clock className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                        <strong>Order placed. Waiting for admin approval.</strong><br />
                        You will receive an email shortly about confirmation of order.
                    </p>
                </div>

                <p className="text-gray-600 mb-8">
                    Your Order ID: <span className="font-mono font-bold text-dovoc-dark">#{Math.floor(Math.random() * 100000)}</span>
                </p>

                <Link to="/" className="block w-full bg-dovoc-dark text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
