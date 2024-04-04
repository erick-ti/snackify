import { UNAUTHORIZED } from "../constants/httpStatus.js";
import authMid from "./auth.mid.js";

const adminMid = (req, res, next) => {
    if (!req.user.isAdmin) res.status(UNAUTHORIZED).send(); 

    return next();
};

// first authenticate user log in, then authenticate user admin status
export default [authMid, adminMid];