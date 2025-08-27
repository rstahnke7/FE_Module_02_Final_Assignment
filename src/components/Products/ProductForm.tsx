import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../lib/firestore';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || 'Great product for everyday use.',
    price: product?.price || 29.99,
    category: product?.category || 'electronics',
    image: product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    rating: {
      rate: product?.rating?.rate || 4.5,
      count: product?.rating?.count || 100,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('rating.')) {
      const ratingField = name.split('.')[1];
      setFormData({
        ...formData,
        rating: {
          ...formData.rating,
          [ratingField]: parseFloat(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'price' ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 Form submitted with data:', formData);
    setLoading(true);
    setError(null);

    try {
      if (product) {
        console.log('📝 Updating existing product...');
        await updateProduct(product.id, formData);
      } else {
        console.log('➕ Creating new product...');
        await createProduct(formData);
      }
      console.log('✅ Product operation successful');
      onSave();
    } catch (err: any) {
      console.error('❌ Product operation failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'electronics',
    'jewelery',
    'men\'s clothing',
    'women\'s clothing',
    'books',
    'home',
    'sports',
    'toys',
  ];

  return (
    <div className="product-form-container">
      <div className="product-form">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Wireless Headphones"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="Brief description of the product"
            />
          </div>
          
          <div className="form-note">
            <small>* Image and ratings will be set automatically with good defaults</small>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="save-button">
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;