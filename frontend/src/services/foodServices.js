import axios from 'axios';

export const getAll = async () => {
    const { data } = await axios.get('/api/foods');
    return data;
};

/* Function called 'search' that gets the searchTerm 
as input and then tries to filter the sample_foods that come 
from "../data". For every item, it will check if the item.name
includes the searchTerm. Both item.name and searchTerm will be
set toLowerCase() to make all inputs case insensitive
(EX: Apple & apple will be same case). */

export const search = async searchTerm =>
{
    const { data } = await axios.get('/api/foods/search/' + searchTerm);
    return data;
}

// similar to getAll function, but for tags
export const getAllTags = async () => {
    const { data } = await axios.get('/api/foods/tags');
    return data;
}; 

/* async function that gets tag as input and checks if tag is equal to 'All' then
returns a getAll function (to get all the foods), otherwise return foods filtered by the tag. */
export const getAllByTag = async tag => {
    if (tag === 'All') return getAll();
    const { data } = await axios.get('/api/foods/tag/' + tag);
    return data;
}

/* async function that gets foodId as input and searches sample_foods and finds the food item
that matches item.id to foodId */
export const getById = async foodId => {
    const { data } = await axios.get('/api/foods/' + foodId);
    return data;
}
