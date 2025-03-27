import React from 'react';
import './CSS/Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const server = "http://localhost:4000";

  const verifyOrder = async () => {
    try {
      const authToken = localStorage.getItem('auth-token'); // Assuming the token is stored in localStorage
      const response = await fetch(`${server}/verify-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({ orderId, success }),
      });

      const data = await response.json();

      if (data.success) {
        // console.log("Payment Successful");
        alert("Payment Successful");
        navigate("/userorders");
      } else {
        alert("Payment Failed");
        // console.log("Payment Failed");
        alert("Payment Failed. Please try again.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      alert("Something went wrong. Please try again.");
      navigate("/");
    }
  };

  React.useEffect(() => {
    verifyOrder();
  }, []);

  return (
    <div className='verify'>
      <div className="spinner">
      </div>
    </div>
  );
};

export default Verify;