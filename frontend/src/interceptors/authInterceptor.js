import axios from 'axios';

axios.interceptors.request.use(
    req => {
        // get user from local storage as a string
        const user = localStorage.getItem('user');
        // if user logged in, parse user to get token
        const token = user && JSON.parse(user).token;
        // if token is not null or undefined
        if (token) {
            // set access_token to the user's token
            req.headers['access_token'] = token;
        }
        return req;
    },
    error => {
        return Promise.reject(error);
    }
);