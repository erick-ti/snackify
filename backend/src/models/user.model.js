import { model, Schema } from 'mongoose';

// the structure of user in MongoDB
export const UserSchema = new Schema (
    // this data is exactly to that of data.js's sample_users (except for id, which is automatically generated inside the database)
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true}, // setting unique to true will not allow emails already in the database to be registered again
        password: { type: String, required: true },
        address: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    { 
        timestamps: true, // using timestamps adds 2 other fields to schema - createdApp, updatedApp
        // these 2 will be useful for getters and virtual methods for actual data inside the database
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// using mongoose, creates a model called 'user' with UserSchema
export const UserModel = model('user', UserSchema);