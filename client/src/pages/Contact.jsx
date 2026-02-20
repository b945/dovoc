import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            const formId = import.meta.env.VITE_FORMSPREE_ID;
            if (!formId) {
                alert("Form configuration missing. Please set VITE_FORMSPREE_ID in your .env file.");
                setLoading(false);
                return;
            }

            const response = await fetch(`https://formspree.io/f/${formId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Thank you! We have received your message and will get back to you shortly.");
                e.target.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-dovoc-dark mb-4 font-serif">Get in Touch</h1>
                    <p className="text-xl text-dovoc-brown max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our products,
                        want to partner with us, or just want to say hello.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-sm h-full"
                    >
                        <h2 className="text-2xl font-bold text-dovoc-dark mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="bg-dovoc-green/10 p-3 rounded-full mr-4">
                                    <Mail className="h-6 w-6 text-dovoc-green" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-dovoc-dark mb-1">Email Us</h3>
                                    <p className="text-gray-600 mb-1">Our friendly team is here to help.</p>
                                    <a href="mailto:dovochandcrafts@gmail.com" className="text-dovoc-green font-semibold hover:underline">
                                        dovochandcrafts@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-dovoc-green/10 p-3 rounded-full mr-4">
                                    <Phone className="h-6 w-6 text-dovoc-green" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-dovoc-dark mb-1">Call Us</h3>
                                    <p className="text-gray-600 mb-1">Mon-Fri from 9am to 6pm.</p>
                                    <a href="tel:+919072216033" className="text-dovoc-green font-semibold hover:underline">
                                        +91 90722 16033
                                    </a>
                                </div>
                            </div>


                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-dovoc-dark mb-6">Send us a Message</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input required name="firstName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dovoc-green/50 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input required name="lastName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dovoc-green/50 focus:border-transparent transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dovoc-green/50 focus:border-transparent transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea required name="message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dovoc-green/50 focus:border-transparent transition-all"></textarea>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-dovoc-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-dovoc-green transition-colors flex items-center justify-center disabled:opacity-50">
                                {loading ? 'Sending...' : <><Send className="h-5 w-5 mr-2" /> Send Message</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
