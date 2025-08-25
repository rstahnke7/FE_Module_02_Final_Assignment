// src/App.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { addToCart } from "./features/cart/cartSlice";
import type { Product } from "./features/cart/cartSlice";
import ShoppingCart from "./components/ShoppingCart";

// Fetch all products or by category
const fetchProducts = async (category?: string): Promise<Product[]> => {
  const url = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : "https://fakestoreapi.com/products";
  console.log("Fetching products from:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

// Fetch categories
const fetchCategories = async (): Promise<string[]> => {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showCart, setShowCart] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculate total quantity of all items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fetch categories
  const { data: categories } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Products + Categories</h1>
        <button 
          onClick={() => setShowCart(!showCart)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Cart ({totalCartItems})
        </button>
      </div>

      <ShoppingCart visible={showCart} onClose={() => setShowCart(false)} />

      {/* Category Filter */}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="category">Filter by category: </label>
        <select
          id="category"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || undefined)}
        >
          <option value="">All</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      <h2 style={{ marginTop: "20px" }}>Products</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products?.map((product) => (
          <li
            key={product.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              width={80}
              height={80}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/80";
              }}
            />
            <div style={{ flex: 1 }}>
              <p>{product.title}</p>
              <p>💲{product.price}</p>
              <p>📦 {product.category}</p>
              <p>{product.description}</p>
              <p>⭐ {product.rating?.rate} ({product.rating?.count} reviews)</p>
              <button
                onClick={() => dispatch(addToCart(product))}
                style={{
                  marginTop: "10px",
                  padding: "5px 15px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;