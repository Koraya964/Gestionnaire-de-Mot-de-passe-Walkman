import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import session from 'express-session';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import passwordRoutes from './routes/passwords.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// Middlewares de sécurité (très gros pavé et embêtant en prod mais là ça a l'air bon )
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://cdn.tailwindcss.com",
                "https://cdnjs.cloudflare.com",
                "http://localhost:5000",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "http://localhost:5173",
                "http://localhost:3000",
                "https://*"
            ],
            scriptSrcAttr: ["'unsafe-inline'"],
            connectSrc: [
                "'self'",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5000"
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000 ', 'http://127.0.0.1:5500', 'http://127.0.0.1:5000'],
    credentials: true
}));

// Configuration des sessions (pour que le serveur se souvienne de l'utilisateur)
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre_cle_secrete_tres_longue',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true si https
        httpOnly: true, // Empêche le vol de cookie via JS
        maxAge: 3600000 // 1 heure
    }
}));

// Middleware pour ignorer les sourcemaps
app.use((req, res, next) => {
    if (req.url.endsWith('.map')) {
        return res.status(404).end();
    }
    next();
});


// Rate limiter pour éviter les attaques DDOS (15 minutes de timeout après 100 requete par la même ip adress)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);
app.use(express.json());

// --- ROUTES ---

// Routes publiques (Login, Register)
app.use('/api/auth', authRoutes);

// Routes protégées (Blocage ici)
// Toutes les routes dans passwordRoutes nécessiteront désormais une session valide
app.use('/api/passwords', passwordRoutes);

// les routes de navigation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'))
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'))
})

app.listen(PORT, () => {
    console.log(`[OK] Serveur démarré sur le port http://127.0.0.1:${PORT}`);
});