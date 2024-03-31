import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users } from '../data.js'; // to be seeded into database
import { sample_foods } from '../data.js'; // to be seeded into database
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10; // # of times bcryptjs will hash the data

// this will make Mongoose use the schema of the models strictly, adds a layer of security
set('strictQuery', true);

export const dbconnect = async () => {
    try { 
        connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await seedUsers();
        await seedFoods();
        console.log('connect successfully---');
    } catch (error) {
        console.log(error);
    }
};

async function seedUsers() {
    const usersCount = await UserModel.countDocuments(); // documents similar to records in SQL databases
    // check if seed is already done or not
    if (usersCount > 0) {
        console.log('Users seed is already done!');
        return;
    }
    // otherwise loop through all sample_users
    for (let user of sample_users) {
        // hash password
        user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
        // create user using model
        await UserModel.create(user);
    }

    console.log('Users seed is done!');
}

async function seedFoods() {
    const foods = await FoodModel.countDocuments();
    if (foods > 0) {
        console.log('Foods seed is already done!');
        return;
    }

    for (const food of sample_foods) {
        food.imageUrl = `/foods/${food.imageUrl}`;
        await FoodModel.create(food);
    }

    console.log('Foods seed is done!');
}