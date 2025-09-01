import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../../lib/firestore';
import type { RootState } from '../../store';
import type { Product } from '../../types';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [user, fetchProducts]); // Re-run when user authentication changes

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = async () => {
    setShowForm(false);
    setEditingProduct(null);
    await fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  if (!user) {
    return (
      <div className="products-container">
        <div className="products-auth-message">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view and manage products.</p>
          <p>Click the "Login" button in the navigation to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        {user && (
          <button 
            onClick={() => setShowForm(true)} 
            className="add-product-button"
          >
            Add New Product
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="products-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={user ? () => handleEdit(product) : undefined}
            onDelete={user ? () => handleDelete(product.id) : undefined}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="no-products">
          {searchTerm || categoryFilter ? 'No products found matching your criteria.' : 'No products available.'}
        </div>
      )}
      
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default ProductList;