import React from 'react'
import classes from './notFound.module.css';
import { Link } from 'react-router-dom';

// message to show a button that goes to linkRoute with linkText
export default function NotFound({ message, linkRoute, linkText }) {
    // returns not found message and shows a link to linkRoute with linkText
    return (
        <div className={classes.container}>
            {message}
            <Link to={linkRoute}>{linkText}</Link>
        </div>
  );
}

// default values for parameters
NotFound.defaultProps = {
    message: "Nothing Found!",
    linkRoute: '/',
    linkText: 'Go to Home Page',
};
