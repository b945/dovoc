import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsRefunds from './pages/ReturnsRefunds';

import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';

import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/returns-refunds" element={<ReturnsRefunds />} />
        <Route path="/faqs" element={<FAQ />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <CartProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col scroll-smooth">
            <Navbar />
            <ToastContainer />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </CartProvider>
  );
}

export default App;
