import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID requis'],
        index: true
    },
    titre: {
        type: String,
        required: true,
        maxlength: 30
    },
    site: {
        type: String,
        required: true,
        maxlength: 255
    },
    // Le password est stocké chiffré avec AES-256-GCM
    encryptedPassword: {
        type: String,
        required: true
    },
    // IV unique pour ce password
    iv: {
        type: String,
        required: true
    },
    // Tag d'authentification GCM
    authTag: {
        type: String,
        required: true
    },
    email: {
        type: String,
        maxlength: 45
    },
    userName: {
        type: String,
        maxlength: 30
    },
    category: {
        type: String,
        enum: {
            values: ['social', 'banking', 'email', 'shopping', 'work', 'other'],
            message: 'Catégorie invalide'
        },
        default: 'other'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update le timestamp à chaque modification
passwordSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Password = mongoose.model('Password', passwordSchema);
export default Password;
