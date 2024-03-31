import { model, Schema } from 'mongoose';

export const FoodSchema = new Schema (
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String]}, // string array type
        favorite: { type: Boolean, default: 3 },
        stars: { type: Number, default: 3 },
        imageUrl: { type: String, required: true },
        origins: { type: [String], required: true }, // string array type
        cookTime: { type: String, required: true },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

export const FoodModel = model('food', FoodSchema);