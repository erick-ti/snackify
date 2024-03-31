import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.mid.js';

const PASSWORD_HASH_SALT_ROUNDS = 10; // # of times bcryptjs will hash the data

const router = Router();

// using .post for sending data to server
router.post(
    '/login', 
    handler(async (req, res) => {
        // don't use req.params to get login info, because user info should NOT be in URL
        const { email, password } = req.body;
        // check each user's email to see if they match the target's email
        const user = await UserModel.findOne({ email }); // can't find password, because password is hashed

        // check if user exists and compare user input password to the hash password in database
        if (user && (await bcrypt.compare(password, user.password))) {
            // send generated token to the user
            res.send(generateTokenResponse(user));
            return; // return out of login api
        } // after this if statement means it didn't find user (bad request)

        res.status(BAD_REQUEST).send('Username or password is invalid!');
    })
);

router.post(
    '/register',
    handler(async (req, res) => {
        // gets the user inputs from register page
        const { name, email, password, address } = req.body;

        // check if input email is already in database, can't have 2 users with same email
        const user = await UserModel.findOne({ email });

        if (user) { // if user exists, then send error message
            res.status(BAD_REQUEST).send('User already exists, please login!');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            PASSWORD_HASH_SALT_ROUNDS
        );

        const newUser = { // create user object
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            address,
        };
    
        // create user using UserModel from MongoDB database
        const result = await UserModel.create(newUser); // result = the user saved in MongoDB
        res.send(generateTokenResponse(result)); // for logging in user

    })
);

router.put( // using put since this API updates stuff
    '/updateProfile', 
    auth, // this API is only available for authenticated users
    handler(async (req, res) => {
        const { name, address } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.user.id, // find the user info in database by user.id
            { name, address }, // update name and address
            { new: true } // gets updated user
        );
        // generate a new token and send updated user info
        res.send(generateTokenResponse(user));
    })
);

router.put( // using put since this API updates stuff
    '/changePassword',
    auth, // this API is only available for authenticated users
    handler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user.id); // get user from auth.mid
        
        if (!user) { // if user not valid, send error
            res.status(BAD_REQUEST).send('Change password failed!');
            return;
        }

        // cannot compare directly, need bcrypt.compare since user.password is hashed
        const equal = await bcrypt.compare(currentPassword, user.password); // compare current password with current user password

        if(!equal) { // if passwords are not equal, send error
            res.status(BAD_REQUEST).send('Current password is not correct!');
            return;
        }
        // passwords match so hash new password and set it inside user.password
        user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
        await user.save(); // save inside database after changing user

        res.send();
    })
);

const generateTokenResponse = user => {

    // token - user encrypted data, sign - creates the token
    const token = jwt.sign(
        // first parameter object - user data
        {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d', // options
        }
    );
    // return unencrypted data to be sent to the login function (frontend)
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token, 
    }
};

export default router;