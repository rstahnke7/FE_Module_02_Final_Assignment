// src/components/ShoppingCart.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { removeFromCart } from "../features/cart/cartSlice";

interface ShoppingCartProps {
  visible: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ visible, onClose }) => {
  console.log("ShoppingCart component rendering, visible:", visible);

  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  console.log("ShoppingCart items from Redux:", items);
  console.log("ShoppingCart dispatch:", dispatch);

  if (!visible) {
    console.log("ShoppingCart not visible, returning null");
    return null;
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
      )}
      <button onClick={() => {
        console.log("Closing ShoppingCart");
        onClose();
      }}>Close</button>
    </div>
  );
};

export default ShoppingCart;