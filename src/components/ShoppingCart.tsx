// src/components/ShoppingCart.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { removeFromCart, clearCart } from "../features/cart/cartSlice";

interface ShoppingCartProps {
  visible: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ visible, onClose }) => {
  console.log("ShoppingCart component rendering, visible:", visible);

  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      onClose();
    }, 2000);
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
          <button 
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            Checkout (${totalPrice.toFixed(2)})
          </button>
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