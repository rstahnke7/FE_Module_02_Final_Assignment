import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { getUserOrders } from '../../lib/firestore';
import type { Order } from '../../types';
import OrderDetails from './OrderDetails';

const OrderHistory: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setError(null);
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (!user) {
    return (
      <div className="orders-container">
        <div className="orders-message">
          Please log in to view your order history.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order History</h1>
        <p>View all your past orders and their details</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {orders.length === 0 ? (
        <div className="orders-empty">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="order-summary">
                <div className="order-items">
                  <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="item-preview">
                        {item.product.title}
                        {index < Math.min(2, order.items.length - 1) && ', '}
                      </span>
                    ))}
                    {order.items.length > 3 && <span className="more-items">+{order.items.length - 3} more</span>}
                  </div>
                </div>
                
                <div className="order-total">
                  <strong>${order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
              
              <div className="order-actions">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="view-details-button"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderHistory;