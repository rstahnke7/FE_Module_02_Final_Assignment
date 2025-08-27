import React from 'react';
import type { Order } from '../../types';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'processing':
        return '#ffc107';
      case 'pending':
        return '#17a2b8';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="order-details-overlay">
      <div className="order-details-modal">
        <div className="order-details-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="order-details-content">
          <div className="order-meta">
            <div className="meta-group">
              <label>Order ID:</label>
              <span>#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            
            <div className="meta-group">
              <label>Order Date:</label>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            
            <div className="meta-group">
              <label>Status:</label>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="meta-group">
              <label>Total Amount:</label>
              <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="order-items-section">
            <h3>Items Ordered</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80';
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h4>{item.product.title}</h4>
                    <p className="item-category">{item.product.category}</p>
                    <p className="item-description">
                      {item.product.description.length > 100
                        ? `${item.product.description.substring(0, 100)}...`
                        : item.product.description
                      }
                    </p>
                  </div>
                  
                  <div className="item-quantity">
                    <span>Qty: {item.quantity}</span>
                  </div>
                  
                  <div className="item-price">
                    <div className="unit-price">${item.product.price.toFixed(2)} each</div>
                    <div className="total-price">${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="order-details-actions">
          <button onClick={onClose} className="close-details-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;