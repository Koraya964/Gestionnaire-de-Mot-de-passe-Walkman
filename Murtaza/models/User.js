import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        require: true,
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

const User = mongoose.model('User', userSchema);
export default User;