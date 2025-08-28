import React, { useContext } from "react";
import "./PlaceOrder.css";
import { ShopContext } from '../../Context/ShopContext';
import {stripe} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const PlaceOrder = () => {
    const { getTotalCartAmount, cartItems, all_product } = useContext(ShopContext);

    const [data, setData] = React.useState({
        first_name: "",
        last_name: "",
        email: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value
        });
    };

    const makePayment = async (e) => {
        e.preventDefault();
        
        const stripe = await loadStripe("pk_test_51R55HDQo1beh1bTEzRjmG3Y5Ps7PQ02V7NsCMTyAoX4f1jkyMg1bT89cGUinWadCdPn5P7XVuV2LkORiQT2fEJ2p00II9Aifhk")
        
        let orderItems = all_product
        .filter((item) => cartItems[item.id] > 0) // Ensure only selected cart items are sent
        .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.new_price,
            quantity: cartItems[item.id],
        }));

        const body = {
            items: orderItems, // Use cartItems instead of cart
            amount: getTotalCartAmount(), // Adjust total with shipping (if applicable)
            address: data, // Send user inputted address details
        }

        const headers = {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token")
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL || "http://localhost:4000"}/place-order`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        const session = await response.json();
        const result = stripe.redirectToCheckout({
            sessionId: session.id
        })

        if (result.error) {
            console.error(result.error.message);
        }
    };
    

    return (
        <form onSubmit={makePayment} className="place-order-form">
            <div className="place-order-left">
                <p className="title">Billing Details</p>
                <div className="multi-field">
                    <input name="first_name" required onChange={onChangeHandler} value={data.first_name} type="text" placeholder="First Name" />
                    <input name="last_name" required onChange={onChangeHandler} value={data.last_name} type="text" placeholder="Last Name" />
                </div>
                <input name="email" required onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" />
                <input name="street_address" required onChange={onChangeHandler} value={data.street_address} type="text" placeholder="Street Address" />
                <div className="multi-field">
                    <input name="city" required onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
                    <input name="state" required onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
                </div>
                <div className="multi-field">
                    <input name="zip_code" required onChange={onChangeHandler} value={data.zip_code} type="text" placeholder="Zip Code" />
                    <input name="country" required onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
                </div>
                <input name="phone" required onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
            </div>
            <div className="place-order-right">
                <div className="cart-item-total">
                    <h1>CART TOTALS</h1>
                    <div>
                        <div className="cart-item-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-item-total-item">
                            <p>Shipping Free</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cart-item-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button type="submit">PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;