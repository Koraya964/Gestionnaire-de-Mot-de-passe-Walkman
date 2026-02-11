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
    telephone: {
        type: String,
        minlength: 10,
        maxlength: 13,
        unique: true,
        sparse: true  // Permet les valeurs null/undefined
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 64
    },
    // Salt pour dériver la clé de chiffrement (ajouté pour le gestionnaire de mots de passe)
    encryptionSalt: {
        type: String,
        required: true
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
            type: String,
            maxlength: 5
        },
        country: {
            type: String,
            min: 5,
            max: 20
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash le password avant de sauvegarder
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        // Je hash le password avec Argon2id
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4
        });
        console.log('Password hashé pour:', this.firstName);
        next();
    } catch (error) {
        console.error('Erreur hash password:', error);
        next(error);
    }
});

// Méthode pour vérifier le password
userSchema.methods.verifyPassword = async function(candidatePassword) {
    return await argon2.verify(this.password, candidatePassword);
};

// Méthode pour obtenir la clé de chiffrement
userSchema.methods.getEncryptionKey = function(password) {
    // Je dérive une clé depuis le password et le salt
    return CryptoService.deriveKey(password, this.encryptionSalt);
};

const User = mongoose.model('User', userSchema);
export default User;
