import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <h1 className="text-3xl font-bold text-dovoc-dark mb-8">Shipping Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">1. Order Processing</h2>
                        <p>
                            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">2. Shipping Rates & Delivery Estimates</h2>
                        <p className="mb-2">
                            Shipping charges for your order will be calculated and displayed at checkout.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Standard Shipping:</strong> 5-7 business days - ₹50</li>
                            <li><strong>Express Shipping:</strong> 2-3 business days - ₹150</li>
                            <li><strong>Free Shipping:</strong> Available for orders over ₹1000</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">3. Shipment Confirmation & Order Tracking</h2>
                        <p>
                            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                            The tracking number will be active within 24 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">4. Customs, Duties and Taxes</h2>
                        <p>
                            Dovoc Eco Life is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
