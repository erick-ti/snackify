import { model, Schema } from 'mongoose';
import { OrderStatus } from '../constants/orderStatus.js';
import { FoodModel } from './food.model.js'; // schema to store food

// schema to store latlng coords
export const LatLngSchema = new Schema (
    {
        lat: { type: String, required: true },
        lng: { type: String, required: true },
    },
    {
        _id: false, // remove id since don't need seperate id for lat and lng
    }
);

// schema to store items
export const OrderItemSchema = new Schema(
    {
        food: { type: FoodModel.schema, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true},
    },
    {
        _id: false, // don't need id either, because it will be a part of order

    }
)

// calculates (price of item * quantity)
OrderItemSchema.pre('validate', function (next) {
    this.price = this.food.price * this.quantity;
    next();
})

// the main schema
const orderSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    paymentId: { type: String },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: OrderStatus.NEW },
    user: { type: Schema.Types.ObjectId, required: true },
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});

export const OrderModel = model('order', orderSchema);
