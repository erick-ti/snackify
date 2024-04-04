import { Router } from "express";
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import admin from "../middleware/admin.mid.js";

const router = Router();

// when root api of food.router is called, load in all the foods
router.get(
    '/', 
    handler(async (req, res) => {
        const foods = await FoodModel.find({}); // empty array so it returns ALL the foods
        res.send(foods);
    })
);

router.delete(
    '/:foodId', 
    admin, 
    handler(async (req, res) => {
        const { foodId } = req.params;
        await FoodModel.deleteOne({ _id: foodId });
        res.send();
    })
);

// gets all the tags
router.get(
    '/tags', 
    handler(async (req, res) => {
        // using aggregate function to run array of operators and functions in MongooseDB
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags', // creates a single row for every tag
            },
            {
                $group: { // groups all the tags
                    _id: '$tags', // name of tag
                    count: { $sum: 1 }, // for every tag, increase count by 1
                },
            },
            {
                $project: { // similar to SELECT in SQL
                    _id: 0, // '_' in '_id' means - don't want id to be returned
                    name: '$_id', // id is instead represented in name property as a field name (marked by the '$' sign)
                    count: '$count',
                },
            },
        ]).sort({ count: -1 }); // sort tags based on count, -1 for descending (1 for ascending)

        const all = { // creates the 'All' tag
            name: 'All',
            count: await FoodModel.countDocuments(),
        };

        tags.unshift(all); // adds item ('All' tag) to beginning of array

        res.send(tags)
    })
);

router.get(
    '/search/:searchTerm', 
    handler(async (req, res) => {
        const { searchTerm } = req.params;
        
        const searchRegex = new RegExp(searchTerm, 'i'); // 'i' means case insensitive

        const foods = await FoodModel.find({ name: { $regex: searchRegex } });
        res.send(foods);
    })
);

router.get(
    '/tag/:tag', 
    handler(async (req, res) => {
        const { tag } = req.params;
        // from the return of getAllByTag in foodServices.js
        const foods = await FoodModel.find({ tags: tag });
        res.send(foods);
    })
);

router.get(
    '/:foodId', 
    handler(async (req, res) => {
        const { foodId } = req.params;
        const food = await FoodModel.findById(foodId);
        res.send(food);
    })
);

export default router;