import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = ({ children }) => {
    const server = "http://localhost:4000";
    const [all_product, setAllProduct] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch products
        fetch(`${server}/allproducts`)
            .then((res) => res.json())
            .then((data) => setAllProduct(data))
            .catch((error) => console.error("Error fetching products:", error));

        // Fetch cart data if authenticated
        if (localStorage.getItem("auth-token")) {
            fetch(`${server}/getcartdata`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: "",
            }).then((res) => res.json())
            .then((data) => setCartItems(data)) 
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem("auth-token")) {
            fetch(`${server}/addtocart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({ itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log("Cart updated:", data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, prev[itemId] - 1) }));
        if (localStorage.getItem("auth-token")) {
            fetch(`${server}/removefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log("Cart updated:", data))
                .catch((error) => console.error("Error removing from cart:", error));
        }
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    total += cartItems[item] * itemInfo.new_price;
                }
            }
        }
        return total;
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
    };

    const clearCart = () => {
        const emptyCart = getDefaultCart();
        setCartItems(emptyCart);
        if (localStorage.getItem("auth-token")) {
            fetch(`${server}/clearcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: "",
            })
                .then((res) => res.json())
                .then((data) => console.log("Cart cleared:", data))
                .catch((error) => console.error("Error clearing cart:", error));
        }
    };

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
    };

    return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
