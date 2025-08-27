import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // Convert Firestore product to legacy format for cart compatibility
    dispatch(addToCart({
      id: parseInt(product.id) || Math.random(), // Use random number if id can't be parsed
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating,
    }));
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description
          }
        </p>
        
        <div className="product-rating">
          <span className="rating-stars">
            {'★'.repeat(Math.round(product.rating.rate))}
            {'☆'.repeat(5 - Math.round(product.rating.rate))}
          </span>
          <span className="rating-count">({product.rating.count})</span>
        </div>
        
        <div className="product-price">${product.price.toFixed(2)}</div>
        
        <div className="product-actions">
          <button 
            onClick={handleAddToCart} 
            className="add-to-cart-button"
          >
            Add to Cart
          </button>
          
          {onEdit && (
            <button onClick={onEdit} className="edit-button">
              Edit
            </button>
          )}
          
          {onDelete && (
            <button onClick={onDelete} className="delete-button">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;