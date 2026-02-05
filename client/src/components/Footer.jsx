import { Facebook, Instagram, Twitter, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dovoc-green/5 text-dovoc-dark pt-12 pb-8 mt-16 border-t border-dovoc-green/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Leaf className="h-6 w-6 text-dovoc-green" />
                            <span className="text-xl font-bold">Dovoc Eco Life</span>
                        </div>
                        <p className="text-dovoc-brown text-sm">
                            Pure. Organic. Handcrafted with Love.
                            Sustainable products for a clearer conscience and a cleaner planet.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/dovoc_handcrafts?igsh=eXZwbzZ2eTByc2Zk" target="_blank" rel="noopener noreferrer" className="text-dovoc-green hover:text-dovoc-brown">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-dovoc-green hover:text-dovoc-brown">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-dovoc-green hover:text-dovoc-brown">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Shop</h4>
                        <ul className="space-y-2 text-dovoc-brown">
                            <li><a href="#" className="hover:text-dovoc-green">All Products</a></li>
                            <li><a href="#" className="hover:text-dovoc-green">Organic Food</a></li>
                            <li><a href="#" className="hover:text-dovoc-green">Handmade Decor</a></li>
                            <li><a href="#" className="hover:text-dovoc-green">Eco Essentials</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Support</h4>
                        <ul className="space-y-2 text-dovoc-brown">
                            <li><Link to="/contact" className="hover:text-dovoc-green">Contact Us</Link></li>
                            <li><Link to="/shipping-policy" className="hover:text-dovoc-green">Shipping Policy</Link></li>
                            <li><Link to="/returns-refunds" className="hover:text-dovoc-green">Returns & Refunds</Link></li>
                            <li><Link to="/faqs" className="hover:text-dovoc-green">FAQs</Link></li>
                        </ul>
                        <div className="mt-6 space-y-2 text-sm">
                            <p className="flex items-center text-dovoc-brown"><span className="font-semibold w-16">Email:</span> dovochandcrafts@gmail.com</p>
                            <p className="flex items-center text-dovoc-brown"><span className="font-semibold w-16">Phone:</span> +91 90722 16033</p>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Stay Connected</h4>
                        <p className="text-sm text-dovoc-brown mb-4">
                            Join our newsletter for eco-tips and exclusive offers.
                        </p>
                        <form className="flex flex-col space-y-2" onSubmit={async (e) => {
                            e.preventDefault();
                            const email = e.target.email.value;
                            try {
                                const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email })
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    alert('Successfully subscribed to newsletter!');
                                    e.target.reset();
                                } else {
                                    alert(data.message || 'Subscription failed');
                                }
                            } catch (err) {
                                alert('Failed to connect to server');
                            }
                        }}>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="Your email address"
                                className="px-4 py-2 border border-dovoc-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dovoc-green/50 bg-white"
                            />
                            <button type="submit" className="bg-dovoc-green text-white px-4 py-2 rounded-md hover:bg-dovoc-brown transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-dovoc-green/10 text-center text-sm text-dovoc-brown">
                    <p>&copy; {new Date().getFullYear()} Dovoc Eco Life. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
