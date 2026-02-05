import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer = () => {
    const { notifications, markAsRead } = useNotification();

    // Only show unread or recent notifications as toasts
    // For simplicity, we just map recent ones. 
    // Ideally, we'd have a separate "toasts" state, but let's use notifications for now.
    // We filter to standard "toast" scenarios (recent < 5 seconds? or handled by auto-dismiss)

    // Better approach: The context should probably handle removal, but let's handle auto-dismiss visual here
    // or assume notifications are permanent in a drawer but temporary as toasts.
    // Let's just show the top 3 most recent notifications.

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
            <AnimatePresence>
                {notifications.slice(0, 3).map((notif) => (
                    <Toast key={notif.id} notif={notif} onClose={() => markAsRead(notif.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const Toast = ({ notif, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [notif.id, onClose]);

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <AlertCircle className="h-5 w-5 text-yellow-500" />
    };

    if (notif.read) return null; // Don't show if read/dismissed

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white border border-gray-100 shadow-lg rounded-lg p-4 flex items-start space-x-3 w-80 pointer-events-auto"
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[notif.type] || icons.info}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

export default ToastContainer;
