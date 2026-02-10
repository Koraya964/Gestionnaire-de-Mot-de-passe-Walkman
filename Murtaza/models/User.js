import mongoose from 'mongoose';
import argon2 from 'argon2';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+.\S+$/, 'Email invalide']

    },
    telephon: {
        type: Number,
        min: 10,
        max: 13,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 64
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'subscrib', 'standard'],
        default: 'standard'
    },
    address: {
        street: {
            type: String,
            max: 45
        },
        city: {
            type: String,
            min: 5,
            max: 20,
        },
        postalcode: {
            type: Number,
            max: 5
        },
        country: {
            type: String,
            min: 5,
            max: 20
        }
    }


})

// ici je hash instantment le mdp
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    try{
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4
        });
        console.log('Password hashé pour:', this.firstName);
    }catch(error){
        console.error('Erreur hash password: ', error);
        throw error
    }
})

const User = mongoose.model('User', userSchema);
export default User;