import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = (message, type = 'info') => {
        const newNotif = {
            id: Date.now(),
            message,
            type, // 'info', 'success', 'warning', 'error'
            read: false,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Auto-dismiss toast logic could go here if we had a toast system
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Simulate real-time checks (e.g. strict polling)
    useEffect(() => {
        const interval = setInterval(() => {
            // In a real app, fetch /api/notifications here
            // For now, we simulate random order events
            if (Math.random() > 0.95) { // 5% chance every 10s
                // Simulation disabled to not annoy dev
                // addNotification("New Order Received! #Simulated", "success");
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
