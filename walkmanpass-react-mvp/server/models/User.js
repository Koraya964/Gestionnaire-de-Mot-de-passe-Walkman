import mongoose from 'mongoose';
import argon2 from 'argon2';
import crypto from 'crypto';
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
    // Recovery system
    encryptedMasterKey: {
        type: String,
        default: null
    },
    recoveryKeySalt: {
        type: String,
        default: null
    },
    recoveryKeyIV: {
        type: String,
        default: null
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
userSchema.pre('save', async function (next) {
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
userSchema.methods.verifyPassword = async function (candidatePassword) {
    return await argon2.verify(this.password, candidatePassword);
};

// Méthode pour obtenir la clé de chiffrement
userSchema.methods.getEncryptionKey = function (password) {
    // Je dérive une clé depuis le password et le salt
    return CryptoService.deriveKey(password, this.encryptionSalt);
};

// Méthode pour setup la recovery key
userSchema.methods.setupRecovery = function (masterPassword) {

    // GénÃ¨re une recovery key aléatoire (32 bytes = 64 caractÃ¨res hex)
    const recoveryKey = crypto.randomBytes(32).toString('hex');

    // GénÃ¨re un salt et IV pour la recovery
    this.recoveryKeySalt = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(12);
    this.recoveryKeyIV = iv.toString('hex');

    // Dérive la clé principale depuis le master password
    const masterKey = crypto.pbkdf2Sync(
        masterPassword,
        this.encryptionSalt,
        100000,
        32,
        'sha256'
    );

    // Dérive une clé depuis la recovery key
    const recoveryDerivedKey = crypto.pbkdf2Sync(
        recoveryKey,
        this.recoveryKeySalt,
        100000,
        32,
        'sha256'
    );

    // Chiffre la clé principale avec la recovery key
    const cipher = crypto.createCipheriv('aes-256-gcm', recoveryDerivedKey, iv);
    let encrypted = cipher.update(masterKey.toString('hex'), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Stocke : encrypted:authTag
    this.encryptedMasterKey = encrypted + ':' + authTag.toString('hex');

    return recoveryKey; // Ã€ afficher UNE FOIS Ã  l'utilisateur
};

const User = mongoose.model('User', userSchema);
export default User;