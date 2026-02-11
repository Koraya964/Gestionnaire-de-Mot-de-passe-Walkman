import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();


const url = 'mongodb://localhost:27017/x-drive';
// const MONGODB_URI= process.env.MONGODB_URI;
async function connectionDB() {
    try{
        const con = await mongoose.connect(url);
        console.log("Database is connected successfully");
        return con.connection.db;
    }catch(error){
        console.log(error)
    }
    
}

connectionDB();

export default connectionDB;