import React, { useEffect, useState } from 'react';
import './ListOrder.css';

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'}/allorders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="list-order-page">
        <h1>All Orders</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="list-order-page">
        <h1>All Orders</h1>
        <div className="no-orders">
          <p>No orders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-order-page">
      <h1>All Orders</h1>
      <div className="orders-list">
        {[...orders].reverse().map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-item-container">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <p>{item.name} x {item.quantity}</p>
                  <p>Price: ${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="order-item-info">
              <div className="order-item-address">
                <p>{order.address.first_name + " " + order.address.last_name}</p>
                <p>{order.address.street_address + ", " + order.address.city + ", " + order.address.state + ", " + order.address.zip_code + ", " + order.address.country}</p>
                <p>{order.address.phone}</p>
                <p>Total Price: ${order.amount}</p>
              </div>
              <div className='order-item-summary'>
              </div>
              <select
                className="order-status-select"
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Payment Received">Payment Received</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Delivering">Delivering</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOrder;
