import React from 'react';
import classes from './tags.module.css';
import { Link } from 'react-router-dom';

// two inputs - tags, passed from HomePage.js
//            - forFoodPage, boolean type to use tags for Food Page
export default function Tags({ tags, forFoodPage }) {
  return (
    <div 
        className={classes.container}
        // double curly braces to indicate passing of object
        style={{
            // check if forFoodPage is not null or undefined then justifyContent should be 'start', otherwise 'center'
            // forFoodPage - 'start' so tags will be displayed on left side
            // HomePage - 'center' so tags display in center
            justifyContent: forFoodPage ? 'start' : 'center',
        }}
    >
        {tags.map(tag => ( // shows all the tags
        // if not on forFoodPage, then show tag count (don't want to show tag count on forFoodPage)
            // be sure to enter in <Link
            // be sure to use backtick '`'
            <Link key={tag.name} to={`/tag/${tag.name}`}>
                {tag.name}
                {!forFoodPage && `(${tag.count})`}
            </Link>
        ))}
    </div>
  );
}
