import axios from 'axios';

export const getUser = () => 
localStorage.getItem('user') // check for user in localStorage
? JSON.parse(localStorage.getItem('user')) // if available, parse data and get js object of user
: null; // otherwise, user is not logged in, so return null

export const login = async (email, password) => { // email and password as input
    // NEED to use post, because router defined on server with post method (method must match)
    const { data } = await axios.post('api/users/login', { email, password});
    // if user email and password was correct then store user data in localStorage as a string
    localStorage.setItem('user', JSON.stringify(data));
    return data;
};

export const register = async registerData => { 
    // gets registerData which has all the user input data from register page
    const { data } = await axios.post('api/users/register', registerData);
    localStorage.setItem('user', JSON.stringify(data)); // set data as 'user' and stringify into localStorage
    return data;
};

export const logout = () => {
    // remove user data from local storage
    localStorage.removeItem('user');
};

export const updateProfile = async user => {
    // gets user and sends it to the server API to get the user info data
    const { data } = await axios.put('/api/users/updateProfile', user);
    localStorage.setItem('user', JSON.stringify(data)); // set data as 'user' and stringify into localStorage
    return data;
};

export const changePassword = async passwords => {
    await axios.put('/api/users/changePassword', passwords);
}