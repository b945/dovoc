import React from 'react';

const ReturnsRefunds = () => {
    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <h1 className="text-3xl font-bold text-dovoc-dark mb-8">Returns & Refunds Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">1. Return Eligibility</h2>
                        <p>
                            We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
                            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">2. Non-returnable Items</h2>
                        <p>
                            Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">3. Easy Returns Process</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Contact us at <strong>support@dovoc.com</strong> to start a return.</li>
                            <li>If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package.</li>
                            <li>Items sent back to us without first requesting a return will not be accepted.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dovoc-green mb-3">4. Refunds</h2>
                        <p>
                            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not.
                            If approved, you’ll be automatically refunded on your original payment method within 10 business days.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnsRefunds;
