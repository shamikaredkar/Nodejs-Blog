const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connection established: ${conn.connection.host}`);
    } catch(error) {
        console.log(`Database connection error: ${error}`);
    }
}

module.exports = connectDB;