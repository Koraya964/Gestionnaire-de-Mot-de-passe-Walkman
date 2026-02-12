import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const url = `mongodb+srv://walkman_db_user:UVL47iq2pLFpW4sk@walkmanpass.sqjhq7k.mongodb.net/?appName=walkmanpass`
// Connexion à la BDD (Mongo Atlas)

export const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur MongoDB:', error.message);
        process.exit(1);
    }
};
