import React, { useState } from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
      
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='news-letter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <form onSubmit={handleSubscribe}>
        <div>
          <input 
            type="email" 
            placeholder='Your Email ID'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSubscribed}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading || isSubscribed}
          >
            {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>
      </form>
      {isSubscribed && (
        <p className="success-message">Thank you for subscribing! Check your email for confirmation.</p>
      )}
    </div>
  )
}

export default NewsLetter
