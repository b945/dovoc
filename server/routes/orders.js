const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../config/firebase');

// Helper to check DB connection
const checkDb = (res) => {
    if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return false;
    }
    return true;
};

// Email Service (EmailJS)
const sendOrderConfirmation = async (order) => {
    // Check if EmailJS keys are present
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_PRIVATE_KEY) {
        console.warn("[Email Service] Skipped: Missing EmailJS keys in .env");
        return;
    }

    try {
        console.log(`[Email Service] Sending confirmation via EmailJS for Order #${order.id}`);

        const itemsList = order.items.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');

        const templateParams = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                // Common params, ensure your EmailJS template uses these names (e.g. {{customer_name}})
                customer_name: order.customer.name,
                customer_email: order.customer.email,
                order_id: order.id,
                order_total: order.total.toFixed(2),
                order_items: itemsList,
                order_status: order.status,
                admin_email: 'dovochandcrafts@gmail.com'
            }
        };

        await axios.post('https://api.emailjs.com/api/v1.0/email/send', templateParams);
        console.log("Confirmation email sent successfully via EmailJS.");
    } catch (error) {
        console.error("[Email Service Error]", error.response?.data || error.message);
    }
};

// Get all orders
router.get('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get(); // Requires index or client sort if complex
        // Note: orderBy might fail if index missing. Safe to get all and sort in JS for small app.
        // Let's stick to get() & sort JS to avoid index requirement errors during first run.
        // const snapshot = await db.collection('orders').get();
        const orders = snapshot.docs.map(doc => doc.data());
        // Sort in memory
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(orders);
    } catch (err) {
        console.error(err);
        // Fallback if orderBy fails due to missing index: return unsorted or try-catch specifics
        res.status(500).json({ message: "Error reading orders" });
    }
});

// Create new order
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const newOrder = {
            id: Math.floor(100000 + Math.random() * 900000), // Custom ID
            ...req.body,
            status: 'Pending Approval',
            createdAt: new Date().toISOString()
        };

        await db.collection('orders').doc(String(newOrder.id)).set(newOrder);
        res.status(201).json({ message: "Order created successfully", orderId: newOrder.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating order" });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const { status } = req.body;

        const docRef = db.collection('orders').doc(String(id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = doc.data();
        const oldStatus = order.status;

        await docRef.update({ status });

        // Fetch updated
        const updatedOrder = { ...order, status };

        // Trigger Email if status changed to Approved
        if (status === 'Approved' && oldStatus !== 'Approved') {
            await sendOrderConfirmation(updatedOrder);
        }

        res.json({ message: "Order status updated", order: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating order" });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const docRef = db.collection('orders').doc(String(id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Order not found" });
        }

        await docRef.delete();
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting order" });
    }
});

module.exports = router;
