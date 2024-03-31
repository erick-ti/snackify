import pkg from "jsonwebtoken";
import { UNAUTHORIZED } from "../constants/httpStatus.js";

const { verify } = pkg;
// verify and decode token coming from user, if not valid, send unauthorized status to user
export default (req, res, next) => { // first 2 params are standard API params, 'next' will call next item in pipeline
    
    const token = req.headers.access_token;

    // if token is null (user is not logged in), send 401 status
    if (!token) return res.status(UNAUTHORIZED).send();

    // check if token is valid for the system or not
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded; // allow user into API
    } catch (error) {
        res.status(UNAUTHORIZED).send();
    }

    return next(); // move on in pipeline
}