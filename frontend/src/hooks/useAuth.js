import { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService'; // imports everything from userService
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // check local storage, if user exists - get object, otherwise get null
    const [user, setUser] = useState(userService.getUser());

    // login function
    const login = async (email, password) => {
        try {
            // uses login function from userService, if username and password correct - get user from server
            const user = await userService.login(email, password);
            setUser(user);
            toast.success('Login Successful!');
        } catch (err) { // login failed, could not get user
            toast.error(err.response.data);
        }
    };

    const register = async data => { // gets register data
        try {
            const user = await userService.register(data);
            setUser(user);
            toast.success('Register Successful!');
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    const logout = () => {
        // uses logout function from userService, which will remove user data from local storage
        userService.logout();
        setUser(null);
        toast.success('Logout Successful!');
    };

    const updateProfile = async user => {
        // gets user from components and passes it into updateProfile
        const updatedUser = await userService.updateProfile(user);
        toast.success('Profile update was successful!');
        // if updatedUser is not null, set user state to updatedUser
        if (updatedUser) setUser(updatedUser);
    };

    const changePassword = async passwords => {
        await userService.changePassword(passwords);
        logout(); // if no error exception, log out
        toast.success('Password changed successfully, please login again!');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

// alllows use of useAuth to give three values - user, login, logout
export const useAuth = () => useContext(AuthContext);