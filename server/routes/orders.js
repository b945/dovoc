const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../config/firebase');
const { sendEmail } = require('../utils/emailService');

// Helper to check DB connection
const checkDb = (res) => {
    if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return false;
    }
    return true;
};

const { getDovocEmailTemplate } = require('../utils/emailTemplates');

// Email Service (Nodemailer)
const sendOrderConfirmation = async (order) => {
    try {
        console.log(`[Email Service] Sending confirmation via SMTP for Order #${order.id}`);

        const subject = "Order Confirmed - DOVOC ECO LIFE";

        // Optional: Build items list if available
        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            itemsHtml = `
                <div style="margin: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 10px 0;">
                    <h3 style="color: #557C55; margin-bottom: 10px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${order.items.map(item => `
                            <tr>
                                <td style="padding: 5px 0; color: #555;">${item.name} x ${item.quantity}</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td style="padding-top: 10px; font-weight: bold; border-top: 1px dashed #ddd;">Total</td>
                            <td style="padding-top: 10px; text-align: right; font-weight: bold; border-top: 1px dashed #ddd; color: #557C55;">₹${order.total ? order.total.toFixed(2) : '0.00'}</td>
                        </tr>
                    </table>
                </div>
            `;
        }

        const bodyContent = `
            <h2 style="color: #557C55; margin-bottom: 20px;">Thank you for your order!</h2>
            <p>Dear ${order.customer.name},</p>
            <p>We are thrilled to confirm that we have received your order <strong>#${order.id}</strong>.</p>
            <p>It is now being prepared with care and sustainable love.</p>
            
            ${itemsHtml}

            <p>We expect to deliver your order within <strong>5-7 business days</strong>.</p>
            <p>Thank you for choosing DOVOC and supporting eco-friendly living.</p>
            
            <br/>
            <p>With gratitude,</p>
            <p><strong>The Dovoc Team</strong></p>
        `;

        const html = getDovocEmailTemplate(subject, bodyContent);

        await sendEmail(order.customer.email, subject, html);
        console.log("Confirmation email sent successfully via SMTP.");
    } catch (error) {
        console.error("[Email Service Error]", error.message);
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


// Send New Order Email to Admin
const sendNewOrderAdminNotification = async (order) => {
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_PRIVATE_KEY) return;

    try {
        console.log(`[Email Service] Sending New Order Notification to Admin for Order #${order.id}`);
        const itemsList = order.items.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');

        const templateParams = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: 'dovochandcrafts@gmail.com', // Admin Email
                subject: `New Order Received: #${order.id}`,
                message: `You have received a new order from ${order.customer.name}.\n\nOrder Details:\n${itemsList}\n\nTotal: ₹${order.total.toFixed(2)}\n\nCheck the Admin Panel to approve.`,
                customer_name: "Admin", // Greeting line in template "Hi Admin,"
                customer_email: order.customer.email,
                order_id: order.id,
                order_total: order.total.toFixed(2),
                order_items: itemsList,
                order_status: "Pending Approval",
                admin_email: 'dovochandcrafts@gmail.com'
            }
        };

        await axios.post('https://api.emailjs.com/api/v1.0/email/send', templateParams);
        console.log("Admin notification sent.");
    } catch (error) {
        console.error("[Email Service Error]", error.response?.data || error.message);
    }
};

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

        // Notify Admin
        await sendNewOrderAdminNotification(newOrder);

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
