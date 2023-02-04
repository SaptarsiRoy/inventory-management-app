// this file contains the product schema and model
import {Schema, model, models } from 'mongoose';

// create product schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

// create product model
const Product = models.Product || model('Product', productSchema);

// export product model
export default Product;