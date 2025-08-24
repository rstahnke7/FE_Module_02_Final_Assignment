// src/App.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

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
      <h1>Products + Categories</h1>

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
            <div>
              <p>{product.title}</p>
              <p>💲{product.price}</p>
              <p>📦 {product.category}</p>
              <p>{product.description}</p>
              <p>⭐ {product.rating?.rate} ({product.rating?.count} reviews)</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;