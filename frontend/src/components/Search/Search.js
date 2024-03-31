import React, { useEffect, useState } from 'react'
import classes from './search.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function Search() {
    // for holding the search term, default value is an empty string
    const [term, setTerm] = useState(''); // make sure to enter in 'useState'
    // for changing route using reactor dom
    const navigate = useNavigate(); // be sure to enter in 'useNavigate'
    const { searchTerm } = useParams(); // be sure to enter in 'useParams'

    // handler to listen to searchTerm changes, if no searchTerm, set it to empty string
    useEffect(() => { // be sure to enter in useEffect
        setTerm(searchTerm ?? '');
    }, [searchTerm]);


    /* if search term is not null or undefined
    then change address to /search/'term', 
    otherwise show all items with '/'. */
    const search = async () => {
        term ? navigate('/search/' + term) : navigate('/');
    };

    // returns search box and search button
    return (
    <div className={classes.container}>
    <input
        type="text"
        placeholder="Search Snackify!"
        onChange={e => setTerm(e.target.value)} // setTerm will take the value of input
        onKeyUp={e => e.key === 'Enter' && search()} // when user hits 'Enter' key, call search
        value={term} // term is set by searchTerm
    />
    <button onClick={search}>Search</button>
    </div>
  )
}
