import React, { useEffect, useState } from 'react';
import './CSS/UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'}/getorders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });

          const data = await response.json();
          setOrders(data.orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="user-orders-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
            <p><div className="status-dot"></div>{order.status}</p>
            <p><strong>Total Price:</strong> ${order.amount}.00</p>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <p>{item.name} x {item.quantity}</p>
                  <p>${item.price*item.quantity}.00</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
