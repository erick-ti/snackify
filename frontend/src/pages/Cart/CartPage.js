import React from 'react'
import classes from './cartPage.module.css'
import { useCart } from '../../hooks/useCart'
import Title from '../../components/Title/Title';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';

export default function CartPage() {
    const { cart, removeFromCart, changeQuantity } = useCart(); // be sure to enter in useCart
  return (
    <>
    <Title title = "Cart Page" margin="1.5rem 0 0 2.5rem" /* font size property undefined so it becomes default size of 18 pixels */ />

    {cart.items.length === 0? ( // if cart page has no items
        <NotFound message="Cart Page is Empty!"/> // show NotFound message
        ) : ( // otherwise cart has value and contains an item(s), so show content of cart page in <div>
        <div className={classes.container}>
            <ul className={classes.list}>
                {cart.items.map(item => ( // shows all the cart items
                    <li key={item.food.id}>
                        <div>
                            <img
                                src={`${item.food.imageUrl}`}
                                alt={item.food.name}
                            />
                        </div>
                        <div /* creates link to respective food page */ >
                            <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                        </div>

                        <div /* creates drop down selection box (1-10) */ >
                            <select value={item.quantity} 
                            // e - getting event number, but it is a string so it is converted to a number
                            onChange={e => changeQuantity(item, Number(e.target.value))}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                        </div>

                        <div /* shows item price */ >
                            <Price price={item.price} />
                        </div>

                        <div /* creates the remove buttom */ >
                            <button 
                                className={classes.remove_button} 
                                onClick={() => removeFromCart(item.food.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className={classes.checkout}>
                <div /* shows total item count and total price */ >
                    <div className={classes.foods_count}>{cart.totalCount}</div>
                    <div className={classes.total_price}>
                        <Price price={cart.totalPrice} />
                    </div>
                 </div>

                <Link to="/checkout"> Proceed To Checkout</Link>
            </div>
        </div>
    )}
    </>
  );
}
