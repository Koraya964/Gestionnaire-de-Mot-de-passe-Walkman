import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/d-drive';

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