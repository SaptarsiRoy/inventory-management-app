// this file is used to handle all the product related requests and CRUD operations

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
            const { page } = req.query;
            // get all products
            const products = await getProducts(page);
            // send products as response
            res.status(200).json(products);
            break;
        }
        case "POST":
            const { body: product } = req;
            // check if request body is empty and values are empty or not
            if (checkBody(product)) {
                // check if product already exists
                const isDuplicate = await checkDuplicateProduct(product);
                if (!isDuplicate) {
                    // send 400 status code if product already exists
                    res
                        .status(400)
                        .json({ message: "Product already exists", isDuplicate });
                    break;
                }
                // create new product
                const created_product = await createProduct(product);
                // send product as response
                res.status(201).json(created_product);
            } else {
                // send 400 status code if request body is empty
                res
                    .status(400)
                    .json({ message: "Request paramenters are not present" });
            }
            break;
        case "PATCH": {
            const { body: product } = req;
            // check if request body is empty and values are empty or not
            if (checkBody(product)) {
                res
                    .status(400)
                    .json({ message: "Request paramenters are not present" });
            }
            // update product
            const { updated_product, updated, error } = await updateProduct(product);
            if (updated) {
                // send updated product as response
                res.status(201).json(updated_product);
            } else {
                // send 500 status code if product is not updated
                res.status(500).json({ message: "Product is not updated", error });
            }
            break;
        }
        case "DELETE": {
            const { body: product } = req;
            // check if request body is empty and values are empty or not
            if (checkBody(product)) {
                res
                    .status(400)
                    .json({ message: "Request paramenters are not present" });
            }
            // delete product
            const { deleted_product, deleted, error } = await deleteProduct(product);
            if (deleted) {
                // send deleted product as response
                res.status(201).json(deleted_product);
            } else {
                // send 500 status code if product is not deleted
                res.status(500).json({ message: "Product is not deleted", error });
            }
            break;
        }
        default:
            // send 405 status code if request method is not supported
            res.status(405).send("Method not allowed");
            break;
    }
}

// function to get all products from database
const getProducts = async (page) => {
    const views_per_page = 10;
    // get all products
    const products = await Product.find()
        .sort({
            name: "asc",
        })
        .limit(10)
        .skip(views_per_page * (page - 1));
    // return products
    return products;
};

// function to create a product
const createProduct = async (product) => {
    // create new product
    const newProduct = await Product.create(product);

    // return new product
    return newProduct;
};

const checkBody = (body) => {
    // check if request body is empty
    if (body) {
        // destructure request body
        const { name, price, stock } = body;
        if (name && price && stock && name !== "") {
            // return true if all values are present
            return true;
        }
    }
    // return false if request body is empty or values are empty
    return false;
};

// function to check for duplicate product
const checkDuplicateProduct = async (product) => {
    // check if product already exists
    const dup_product = await Product.findOne({ name: product.name, price: product.price, stock: product.stock });
    // return true if product does not exists
    return dup_product ? false : true;
};

// function to update a product
const updateProduct = async (product) => {
    try {
        // find product by id
        const old_product = await Product.findById(product._id);

        // update product
        const updated_product = await Product.updateOne(
            { _id: old_product._id },
            product
        );

        return { updated_product, updated: true };
    } catch (error) {
        return { error, updated: false };
    }
};

// function to delete a product
const deleteProduct = async (product) => {
    try {
        // delete product
        const deleted_product = await Product.deleteOne({ _id: product._id });
        return { deleted_product, deleted: true };
    } catch (error) {
        return { error, deleted: false };
    }
};
