// Configuration
const API_URL = 'http://localhost:5000/api';

// Elements du DOM
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Gestion des tabs
loginTab.addEventListener('click', () => {
    loginTab.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
    loginTab.classList.remove('text-gray-600');
    registerTab.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
    registerTab.classList.add('text-gray-600');

    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    hideMessages();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
    registerTab.classList.remove('text-gray-600');
    loginTab.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
    loginTab.classList.add('text-gray-600');

    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    hideMessages();
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Erreur de connexion');
            return;
        }

        // Je stocke le token et les infos user
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.firstName + ' ' + data.user.lastName);
        localStorage.setItem('userEmail', data.user.email);

        // Redirection vers le dashboard
        window.location.href = '/dashboard';

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const telephone = document.getElementById('registerTelephone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    // Check si les passwords matchent
    if (password !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }

    // Check force du password
    if (password.length < 8) {
        showError('Le mot de passe doit contenir au moins 8 caractères');
        return;
    }

    // On try de push tout ça si la réponse est ok le register success
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                telephone: telephone || undefined,
                password
            })
        });

        const data = await response.json();
        // Cas échéant on remonte l'erreur 
        if (!response.ok) {
            showError(data.error || 'Erreur lors de l\'inscription');
            return;
        }

        // Je stocke le token et les infos user
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.firstName + ' ' + data.user.lastName);
        localStorage.setItem('userEmail', data.user.email);

        // Redirection vers le dashboard
        window.location.href = '/dashboard';

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
});

// Fonctions utilitaires
// Display des erreurs
function showError(message) {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
    successMessage.classList.add('hidden');
}
// Display des succes
function showSuccess(message) {
    successMessage.classList.remove('hidden');
    successMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('hidden');
}
// Hidding des messages
function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}
