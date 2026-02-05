import React from 'react';
import { Leaf, Heart, Recycle, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="bg-dovoc-beige min-h-screen">
            {/* Hero Section */}
            <section className="bg-dovoc-green text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold font-serif mb-6"
                    >
                        Our Mission
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-light opacity-90 leading-relaxed"
                    >
                        To reconnect people with nature through handcrafted, organic essentials that nurture both the body and the earth.
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-dovoc-dark mb-6">The Dovoc Story</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Dovoc Eco Life began with a simple realization: the products we use daily shouldn't come at the cost of our planet's health. What started as a small kitchen experiment to create a truly natural soap has grown into a movement.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We believe in the power of "slow beauty"—taking the time to source ethical ingredients, crafting each batch by hand, and ensuring that nothing goes to waste. Our journey is one of constant learning and unlearning, always striving to leave a lighter footprint.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <h3 className="text-xl font-bold text-dovoc-green mb-4">Our Core Values</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Leaf className="h-6 w-6 text-dovoc-green mr-3 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-dovoc-dark">Radical Transparency</h4>
                                    <p className="text-sm text-gray-600">We want you to know exactly what's in your products and where it comes from.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Recycle className="h-6 w-6 text-dovoc-green mr-3 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-dovoc-dark">Zero Waste</h4>
                                    <p className="text-sm text-gray-600">From our ingredients to our packaging, we are committed to a circular economy.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Users className="h-6 w-6 text-dovoc-green mr-3 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-dovoc-dark">Community First</h4>
                                    <p className="text-sm text-gray-600">We support local artisans and fair trade practices in everything we do.</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Sustainability Commitment */}
                <div className="bg-dovoc-dark text-white rounded-3xl p-8 md:p-12 text-center">
                    <Heart className="h-12 w-12 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-6">Our Promise</h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        "We promise to never compromise on quality or ethics. Every Dovoc product is a testament to our belief that you don't have to choose between what works and what's good for the world."
                    </p>
                    <div className="flex justify-center space-x-8">
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-dovoc-green">100%</span>
                            <span className="text-xs uppercase tracking-wider">Plastic Free</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-dovoc-green">500+</span>
                            <span className="text-xs uppercase tracking-wider">Trees Planted</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-dovoc-green">0%</span>
                            <span className="text-xs uppercase tracking-wider">Toxins</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
