import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null) // be sure to enter in createContext
const CART_KEY = 'cart';
const EMPTY_CART = { 
    items: [],
    totalPrice: 0,
    totalCount: 0,
}

export default function CartProvider({children}) {
    const initCart = getCartFromLocalStorage();
    // creating three states - cartItems, totalPrice, totalCount
    const [cartItems, setCartItems] = useState(initCart.items); // be sure to enter in useState
    const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
    const [totalCount, setTotalCount] = useState(initCart.totalCount);
    
    // called whenever cartItems is changed
    useEffect(() => {
        const totalPrice = sum(cartItems.map(item => item.price));
        const totalCount = sum(cartItems.map(item => item.quantity));
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);

        localStorage.setItem(
            CART_KEY, 
            JSON.stringify({
                items: cartItems,
                totalPrice,
                totalCount,
            })
        );
    }, [cartItems]);

    function getCartFromLocalStorage(){
        // get JSON string from localStorage
        const storedCart = localStorage.getItem(CART_KEY);
        // check storedCart for value, if it detects items then parse it. Otherwise, return EMPTY_CART
        return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
    }

    /* gets items (NOT cartItems, they are list of prices/quantity ) as input and 
    returns sum of total items. This function can be used for anything that needs adding up (ex: price or item count) */
    const sum = items => {
        return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
    };


    // gets foodId as input and creates a new filtered version of CartItems without the foodId
    const removeFromCart = foodId => {
        const filteredCartItems = cartItems.filter(item => item.food.id !== foodId);  
        setCartItems(filteredCartItems); // sets the cart items
    }

    const changeQuantity = (cartItem, newQuantity) => {
        const { food } = cartItem;

        const changedCartItem = {
            ...cartItem, // previous values of cartItem
            quantity: newQuantity, // updates item quantity
            price: food.price * newQuantity, // updates total price of items
        };

        /* replaces previous cartItems by matching the food's id and calling changeCartItem
        if they match, otherwise keep previous item the same. */
        setCartItems(
            cartItems.map(item => (item.food.id === food.id ? changedCartItem : item))
        );
    }

    const addToCart = food => {
        // tries to find cartItem based on the input food's id
        const cartItem = cartItems.find(item => item.food.id === food.id);
        // if cartItem already in cart, change quantity instead of duplicating the cartItem in cart
        if (cartItem) { // if cartItem is not null/undefined
            changeQuantity(cartItem, cartItem.quantity + 1); // increase cartItem count by 1
        } else { // otherwise, item does not exist in cart
            // update cart items with array of previous cartItems, and the new input food w/ quantity of 1 and its food.price
            setCartItems([...cartItems, { food, quantity: 1, price: food.price }]);
        }
    }

    const clearCart = () => {
        localStorage.removedItem(CART_KEY);
        // get the values defined in EMPTY_CART
        const { items, totalPrice, totalCount } = EMPTY_CART;
        setCartItems(items); // []
        setTotalPrice(totalPrice); // 0
        setTotalCount(totalCount); // 0
    };
 
    return (
        // CartContext.Provider that provides the cart value for its children
        <CartContext.Provider 
            value={{ cart: {items: cartItems, totalPrice, totalCount },
            removeFromCart,
            changeQuantity,
            addToCart,
            clearCart,
         }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);