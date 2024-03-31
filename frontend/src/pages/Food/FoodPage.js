import React, { useEffect, useState } from 'react'
import classes from './foodPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../services/foodServices';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import Price from '../../components/Price/Price';
import { useCart } from '../../hooks/useCart';
import NotFound from '../../components/NotFound/NotFound';

export default function FoodPage() {
    // food and setFood has default value of an empty object {}
    const [food, setFood] = useState({}); // make sure to enter in useState
    // for getting :id path from AppRoutes to get /food/:id path
    const { id } = useParams(); // make sure to enter in useParams
    const { addToCart } = useCart(); // make sure to enter in useCart
    // for navigating user to another route inside a function 
    const navigate = useNavigate(); // make sure to enter in useNavigate

    const handleAddToCart = () => {
        addToCart(food);
        navigate('/cart'); // takes user to cart page 
    }

    // load the food using the { id }
    useEffect(() => { // make sure to enter in useEffect
        // pass the food coming from getById in foodService.js, to the setFood function and update the food
        getById(id).then(setFood); // make sure to enter in getById
    }, [id]);
    
  return (
    <>
    {!food? ( // if food is not available, then display NotFound message and link
        <NotFound message="Food Not Found!" linkText="Back to Homepage" />
    ) : ( // otherwise, show food details
        <div className={classes.container}>
            <img 
                className={classes.image}
                src={`${food.imageUrl}`}
                alt={food.name}
            />

            <div className={classes.details}>
                <div className={classes.header} /* displays food name and if it's favorited */ >
                    <span className={classes.name}>{food.name}</span>
                    <span 
                        // if food is favorite add nothing, otherwise adds classes.not
                        className={`${classes.favorite} ${food.favorite ? '': classes.not}`}>
                        ❤
                    </span>
                </div>
                    <div className={classes.rating} /* displays star rating */>
                        <StarRating stars={food.stars} size={25} /* size 25 to make stars bigger *//>
                    </div>

                    <div className={classes.origins} /* displays food origin */>
                        {food.origins?.map(origin => (
                            <span key={origin}>{origin}</span>
                        ))}
                    </div>

                    <div className={classes.tags}>
                        {food.tags && ( // check if food.tags has a value, then -
                            <Tags // tags component's tag(s), an array of strings, which are converted to an object with corresponding name
                                tags={food.tags.map(tag => ({name: tag }))}
                                forFoodPage={true}
                            />
                        )}
                    </div>

                    <div className={classes.cook_time} /* displays cook time */>
                        <span>
                            Time to cook about <strong>{food.cookTime}</strong> minutes
                        </span>
                    </div>

                    <div className={classes.price} /* displays price */>
                        <Price price={food.price}/>
                    </div>

                    <button onClick={handleAddToCart}> Add to Cart </button>
                </div>
            </div>
        )}
    </>
    );
}

