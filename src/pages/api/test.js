// this file is to check if server is running or not
// import mongoose connection
import { connection, closeConnection } from "../../config/db.config";

// handler function
export default async function handler(req, res) {
    try {
        // connect to database
        await connection();
        // send response
        res.status(200).json({ message: "Server is running" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Server is not running", error: error.message });
        console.error(error);
    }
}
