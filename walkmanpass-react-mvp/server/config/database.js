import mongoose from 'mongoose';


// Connexion à la BDD (Mongo Atlas)
// const url = `mongodb://localhost:27017/password`
const url = process.env.MONGODB_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur MongoDB:', error.message);
        process.exit(1);
    }
};
