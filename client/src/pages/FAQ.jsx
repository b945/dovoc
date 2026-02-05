import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
            >
                <span className={`font-bold text-lg ${isOpen ? 'text-dovoc-green' : 'text-dovoc-dark'}`}>
                    {question}
                </span>
                {isOpen ? <Minus className="h-5 w-5 text-dovoc-green" /> : <Plus className="h-5 w-5 text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-gray-600 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Are your products truly 100% organic?",
            answer: "Yes! We work directly with certified organic farmers and artisans. All our applicable products come with organic certification details on the packaging. We are transparent about every ingredient we use."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we ship within India. We are working on expanding our logistic partners to serve international customers soon."
        },
        {
            question: "How do I care for my bamboo products?",
            answer: "Bamboo is durable but natural. Avoid soaking it in water for long periods. Hand wash with mild soap and warm water, then towel dry immediately. Periodically applying a food-safe oil can extend its life."
        },
        {
            question: "Can I cancel my order?",
            answer: "You can request a cancellation within 2 hours of placing the order by contacting our support team. Once the order is processed, it cannot be cancelled but can be returned after delivery."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major Credit/Debit cards, UPI (GPay, PhonePe, Paytm), and Net Banking. We also offer Cash on Delivery (COD) for select pincodes."
        }
    ];

    return (
        <div className="bg-dovoc-beige min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-dovoc-dark mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-500">
                        Have a question? We're here to help.
                    </p>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
