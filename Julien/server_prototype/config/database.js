import mongoose from 'mongoose';


// Connexion à la BDD (Mongo Atlas)

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur MongoDB:', error.message);
        process.exit(1);
    }
};
