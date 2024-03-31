import { Router } from "express";
import handler from 'express-async-handler'; // for handling async functions inside express routers
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST, UNAUTHORIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js'; // to remove order status of 'new' for current user
import { UserModel } from "../models/user.model.js";

const router = Router();
router.use(auth);

router.post(
    '/create',
    handler(async (req, res) => {
        const order = req.body; // req.body has the order needed from client side

        // if order items length is smaller than 0, order is empty so send error msg
        if (order.items.length <= 0) res.status(BAD_REQUEST).send('Cart is Empty!');

        // deletes current user's order and status
        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW,
        });

        // creates a new order - from checkout page
        const newOrder = new OrderModel({ ...order, user: req.user.id });
        await newOrder.save();
        res.send(newOrder); // send order to client side
    })
);

router.put( // using put - updates existing item in database
    '/pay',
    handler(async (req, res) => {
        const { paymentId } = req.body;
        const order = await getNewOrderForCurrentUser(req);
        if(!order) { // if order is empty or null
            res.status(BAD_REQUEST).send('Order Not Found!');
            return;
        }

        order.paymentId = paymentId;
        order.status = OrderStatus.PAID;
        await order.save(); // saves order in database

        res.send(order._id); // send order id to user to redirect user to the track page
    })
);

router.get(
    '/track/:orderId',
    handler(async (req, res) => {
        const { orderId } = req.params;
        // get user from database based on user.id set in auth.mid.js
        const user = await UserModel.findById(req.user.id);

        // finds the order
        const filter = {
            _id: orderId,
        };

        // if the orderId does not belong to this user, it will not return anything from database
        if (!user.isAdmin) {
            filter.user = user._id;
        }

        const order = await OrderModel.findOne(filter);

        if(!order) return res.send(UNAUTHORIZED);

        // order is valid
        return res.send(order);
    })
); 

router.get(
    '/newOrderForCurrentUser',
    handler(async (req, res) => {
        const order = await getNewOrderForCurrentUser(req);
        if (order) res.send(order); // if order exist, send order to user
        else res.status(BAD_REQUEST).send(); // otherwise, send error
    })
);

router.get('/allstatus', (req, res) => {
    const allStatus = Object.values(OrderStatus); // gets all statuses
    res.send(allStatus); // send to client side
});

/* make sure to put this API at the bottom, otherwise it will accept anything 
as a path parameter for showing the orders and all API's below will be unreachable! */
router.get(
    '/:status?', // ? = optional, if no status or filter - shows all orders
    handler(async (req, res) => {
        const status = req.params.status; // get status
        const user = await UserModel.findById(req.user.id); // find currently logged in user
        const filter = {};

        // Non-Admin should not see other people's order statuses
        if(!user.isAdmin) filter.user = user._id; // orders will be filtered for current user (Non-Admin)
        // if any status coming from URL, then filter should have that status
        if (status) filter.status = status;

        // find orders based on filter created
        const orders = await OrderModel.find(filter).sort('-createdAt'); // the minus ('-') shows the last order FIRST
        res.send(orders);
    })
);

// function that gets new order for current user
const getNewOrderForCurrentUser = async req =>
    await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });


export default router; 