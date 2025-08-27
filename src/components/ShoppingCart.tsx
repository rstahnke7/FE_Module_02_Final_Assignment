// src/components/ShoppingCart.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { removeFromCart, clearCart } from "../features/cart/cartSlice";
import { createOrder } from "../lib/firestore";
import { getProducts } from "../lib/firestore";

interface ShoppingCartProps {
  visible: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ visible, onClose }) => {
  console.log("ShoppingCart component rendering, visible:", visible);

  const items = useSelector((state: RootState) => state.cart.items);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;
    
    setCheckingOut(true);
    
    try {
      // Get full product details from Firestore for each cart item
      const allProducts = await getProducts();
      const orderItems = items.map(cartItem => {
        // Find matching product or create a basic product object
        const product = allProducts.find(p => p.id === cartItem.id.toString()) || {
          id: cartItem.id.toString(),
          title: cartItem.title,
          description: 'Product from cart',
          price: cartItem.price,
          category: 'unknown',
          image: cartItem.image,
          rating: { rate: 0, count: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          productId: product.id,
          product: product,
          quantity: cartItem.quantity,
        };
      });

      // Create order in Firestore
      await createOrder({
        userId: user.uid,
        items: orderItems,
        totalAmount: totalPrice,
        status: 'pending',
      });

      // Clear cart and show success
      dispatch(clearCart());
      setShowCheckoutSuccess(true);
      setTimeout(() => {
        setShowCheckoutSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  console.log("ShoppingCart items from Redux:", items);
  console.log("ShoppingCart dispatch:", dispatch);

  if (!visible) {
    console.log("ShoppingCart not visible, returning null");
    return null;
  }

  // Show checkout success message
  if (showCheckoutSuccess) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          zIndex: 1001,
          textAlign: "center",
          color: "#155724",
        }}
      >
        <h2>🎉 Checkout Successful!</h2>
        <p>Thank you for your purchase!</p>
        <p>Your cart has been cleared.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: "20px",
        width: "300px",
        maxHeight: "400px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        padding: "16px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>The cart is empty.</p>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "10px", 
            borderRadius: "5px", 
            marginBottom: "15px",
            border: "1px solid #dee2e6"
          }}>
            <div><strong>Total Items: {totalItems}</strong></div>
            <div><strong>Total Price: ${totalPrice.toFixed(2)}</strong></div>
          </div>
          <ul>
          {items.map((item) => {
            console.log("Rendering cart item:", item);
            return (
              <li key={item.id} style={{ marginBottom: "8px" }}>
                <img src={item.image} alt={item.title} width={50} height={50} />
                <span style={{ marginLeft: "8px" }}>
                  {item.title} x {item.quantity} 💲{item.price}
                </span>
                <button
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    console.log("Removing item from cart:", item.id);
                    dispatch(removeFromCart(item.id));
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })}
          </ul>
          {user ? (
            <button 
              onClick={handleCheckout}
              disabled={checkingOut}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: checkingOut ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: checkingOut ? "not-allowed" : "pointer",
                marginBottom: "10px"
              }}
            >
              {checkingOut ? "Processing..." : `Checkout ($${totalPrice.toFixed(2)})`}
            </button>
          ) : (
            <div style={{
              padding: "12px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "5px",
              textAlign: "center",
              marginBottom: "10px",
              color: "#6c757d"
            }}>
              Please log in to checkout
            </div>
          )}
        </div>
      )}
      <button onClick={() => {
        console.log("Closing ShoppingCart");
        onClose();
      }}>Close</button>
    </div>
  );
};

export default ShoppingCart;