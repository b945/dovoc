import React from 'react';

const ReturnsRefunds = () => {
    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <h1 className="text-3xl font-bold text-dovoc-dark mb-8">Returns & Refunds Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">1. Return Eligibility</h2>
                        <p className="mb-2">
                            We offer a 7-day return policy, which means customers must request a return within 7 days of receiving the product.
                        </p>
                        <p className="font-semibold mb-2">To be eligible for a return:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The product must be unused, unopened, and in the same condition as delivered</li>
                            <li>The product must be in its original packaging</li>
                            <li>Customers must provide clear photos and/or videos of the product as proof</li>
                            <li>The product should not be unsealed, tampered with, or used in any manner</li>
                        </ul>
                        <p className="mt-2 text-red-600 text-sm font-semibold">
                            Return requests that do not meet the above conditions will not be approved.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">2. Return Approval</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All return requests are subject to inspection and approval by our team.</li>
                            <li>Items sent back without prior approval will not be accepted.</li>
                            <li>Return eligibility will be clearly mentioned on the individual product page.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">3. Refunds</h2>
                        <p className="mb-2">
                            Once the return is received and inspected, customers will be notified of approval or rejection.
                        </p>
                        <p>
                            Approved refunds will be processed to the original payment method within 7–10 business days.
                        </p>
                    </section>

                    <section className="bg-dovoc-green/5 p-6 rounded-lg border border-dovoc-green/20">
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">Important Note</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Patch testing is strongly recommended;</strong> allergic reactions are not eligible for returns or refunds.
                            </li>
                            <li>
                                Minor variations in color, texture, or fragrance are natural in handmade products and do not qualify as defects.
                            </li>
                            <li className="font-bold">
                                The decision of The Dovoc Eco Life shall be final.
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnsRefunds;
