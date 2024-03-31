import React, { useEffect, useReducer } from 'react'
import { getAll, getAllByTag, getAllTags, search } from '../../services/foodServices';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import NotFound from '../../components/NotFound/NotFound';

const initialState = { foods: [], tags: [] };// initialize food state and tags as empty array

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload }; // return previous state and override foods to new value set to payload of action
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state; // else return previous state
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);  // dispatching FOOD_LOADED action can change the state
  const { foods, tags } = state;
  // parameters from AppRoutes
  const { searchTerm , tag } = useParams(); // make sure to enter in useParams

  useEffect (() => {
    // make sure to enter in getAllTags
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    /* checks if searchTerm is available using searchTerm function from 
    foodServices.js otherwise it uses default getAll() function for getting
    all the foods */
    const loadFoods = tag
    // if tag is available, get all foods with tag
    ? getAllByTag(tag) // make sure to enter in getAllByTag
    : searchTerm 
    // if searchTerm is available, do the search
    ? search(searchTerm) // make sure to enter in search
    // otherwise, show all foods.
    : getAll();

    // loadFoods() is a promise
    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]); // dispatch a new type to be called in the reducer 

  // dont forget to enter these components in! (to ensure correct file pathing)
  return (
  <>
    <Search />
    <Tags tags={tags}/>
    {foods.length === 0 && <NotFound linkText="Reset Search"/>}
    <Thumbnails foods={foods}/>
  </>
  );
  
}
