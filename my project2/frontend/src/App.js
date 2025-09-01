import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchFeaturedProducts } from './store/slices/productSlice';
import { getOrderStats } from './store/slices/orderSlice';
import toast from 'react-hot-toast';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { error: authError } = useSelector(state => state.auth);
  const { error: cartError } = useSelector(state => state.cart);
  const { error: productError } = useSelector(state => state.products);
  const { error: orderError } = useSelector(state => state.orders);

  useEffect(() => {
    // Show error toasts
    if (authError) {
      toast.error(authError.message || 'Authentication error');
    }
    if (cartError) {
      toast.error(cartError.message || 'Cart error');
    }
    if (productError) {
      toast.error(productError.message || 'Product error');
    }
    if (orderError) {
      toast.error(orderError.message || 'Order error');
    }
  }, [authError, cartError, productError, orderError]);

  useEffect(() => {
    if (isAuthenticated) {
      // Load user profile and cart
      dispatch(getProfile());
      dispatch(fetchCart());
      dispatch(getOrderStats());
    }
    
    // Load featured products for all users
    dispatch(fetchFeaturedProducts());
  }, [dispatch, isAuthenticated]);

  return (
    <div className="App">
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="/orders/:id" element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute requireAdmin>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/products" element={
            <PrivateRoute requireAdmin>
              <AdminProducts />
            </PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute requireAdmin>
              <AdminOrders />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute requireAdmin>
              <AdminUsers />
            </PrivateRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
