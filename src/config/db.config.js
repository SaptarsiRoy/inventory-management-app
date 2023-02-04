// setup mongoose connection

// import mongoose
import mongoose from 'mongoose';

// setup dotenv to read .env file
require('dotenv').config({ path: '.env.local' });

// create connection function
async function connection() {
    try {
        // setup mongoose connection
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error(error);
    }
}

// function to close mongoose connection
async function closeConnection() {
    await mongoose.connection.close();
}

// export mongoose connection
export {connection, closeConnection};
