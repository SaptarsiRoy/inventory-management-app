//this file is used to handle only single product related requests and CRUD operations


// http status codes
// 200 - OK
// 201 - Created
// 400 - Bad Request
// 405 - Method Not Allowed
// 500 - Internal Server Error

// import mongoose connection
import { connection, closeConnection } from "../../config/db.config";

// import product model
import Product from "../../models/product.model";

// handler function
export default async function handler(req, res) {
    console.log("connecting to database");
    // connect to database
    await connection();
    console.log("connected to database");

    // switch case to handle different request methods
    switch (req.method) {
        case "GET": {
            const { id } = req.query;
            // get product by id
            const product = await getProduct(id);

            if (product.error) {
                // send 500 status code if error occurs
                res.status(500).json({ message: product.error });
                break;
            }
            // send product as response
            res.status(200).json(product);
            break;
        }
        default:
            // send 405 status code if request method is not GET
            res.status(405).json({ message: "Method not allowed" });
            break;
    }
}

// function to get product by id
async function getProduct(id) {
    try {
        const product = await Product.findById(id);
        return {product, error: null};
    } catch (error) {
        return {error: error.message};
    }
}