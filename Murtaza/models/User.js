import mongoose from 'mongoose';
import argon2 from 'argon2';
import CryptoService from '../services/cryptoService.js';

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
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
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

    // Added for encryption system
    masterPasswordHash: {
        type: String,
        required: false
    },
    masterSalt: {
        type: String,
        required: false
    },

    avatar: String,

    role: {
        type: String,
        enum: ['admin', 'subscrib', 'standard'],
        default: 'standard'
    },

    address: {
        street: { type: String, max: 45 },
        city: { type: String, min: 5, max: 20 },
        postalcode: { type: Number, max: 5 },
        country: { type: String, min: 5, max: 20 }
    }
});

//Hash login password
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4
        });
    }

    //Hash master password if modified
    if (this.isModified('masterPasswordHash')) {
        this.masterSalt = CryptoService.generateSalt();
        this.masterPasswordHash = await argon2.hash(this.masterPasswordHash);
    }
});

//Method: verify master password
userSchema.methods.verifyMasterPassword = async function (masterPassword) {
    return argon2.verify(this.masterPasswordHash, masterPassword);
};

// Method: derive encryption key
userSchema.methods.getEncryptionKey = async function (masterPassword) {
    return CryptoService.deriveKey(masterPassword, this.masterSalt);
};

export default mongoose.model('User', userSchema);
