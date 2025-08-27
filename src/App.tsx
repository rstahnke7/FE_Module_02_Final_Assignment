import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import ShoppingCart from "./components/ShoppingCart";
import ProductList from "./components/Products/ProductList";
import LoginForm from "./components/Auth/LoginForm";
import UserProfile from "./components/User/UserProfile";
import OrderHistory from "./components/Orders/OrderHistory";
import './components/Auth/auth.css';
import './components/User/user.css';
import './components/Products/products.css';
import './components/Orders/orders.css';

const App: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [currentView, setCurrentView] = useState<'products' | 'profile' | 'login' | 'orders'>('products');
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  // Calculate total quantity of all items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Auto-redirect to products when user logs in successfully
  useEffect(() => {
    if (user && currentView === 'login') {
      setCurrentView('products');
    }
  }, [user, currentView]);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Navigation Header */}
      <nav style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
        borderBottom: "1px solid #dee2e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ margin: 0, color: "#333" }}>E-Commerce Store</h1>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setCurrentView('products')}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: currentView === 'products' ? "#007bff" : "transparent",
              color: currentView === 'products' ? "white" : "#007bff",
              border: "1px solid #007bff",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Products
          </button>
          
          {user ? (
            <>
              <button
                onClick={() => setCurrentView('profile')}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: currentView === 'profile' ? "#28a745" : "transparent",
                  color: currentView === 'profile' ? "white" : "#28a745",
                  border: "1px solid #28a745",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Profile
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: currentView === 'orders' ? "#ffc107" : "transparent",
                  color: currentView === 'orders' ? "white" : "#ffc107",
                  border: "1px solid #ffc107",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Orders
              </button>
              <span style={{ color: "#666" }}>Welcome, {user.email}</span>
            </>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: currentView === 'login' ? "#17a2b8" : "transparent",
                color: currentView === 'login' ? "white" : "#17a2b8",
                border: "1px solid #17a2b8",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          )}
          
          <button 
            onClick={() => setShowCart(!showCart)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              position: "relative"
            }}
          >
            Cart ({totalCartItems})
          </button>
        </div>
      </nav>

      <ShoppingCart visible={showCart} onClose={() => setShowCart(false)} />

      {/* Main Content */}
      <main>
        {currentView === 'products' && <ProductList />}
        {currentView === 'profile' && user && <UserProfile />}
        {currentView === 'orders' && user && <OrderHistory />}
        {currentView === 'login' && !user && <LoginForm />}
        {(currentView === 'profile' || currentView === 'orders') && !user && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            Please log in to access this section.
          </div>
        )}
      </main>
    </div>
  );
};

export default App;