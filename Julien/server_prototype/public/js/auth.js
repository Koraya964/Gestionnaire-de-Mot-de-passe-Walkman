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
        window.location.href = 'dashboard.html';

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

        if (!response.ok) {
            showError(data.error || 'Erreur lors de l\'inscription');
            return;
        }

        // Afficher la recovery key dans un modal
        showRecoveryKeyModal(data.recoveryKey);

        // Je stocke le token et les infos user
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.firstName + ' ' + data.user.lastName);
        localStorage.setItem('userEmail', data.user.email);

    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
});

// Modal pour afficher la recovery key
function showRecoveryKeyModal(recoveryKey) {
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Recovery Key générée</h2>
            <p class="text-sm text-gray-600 mb-4">Sauvegardez précieusement cette clé ! Elle vous permettra de récupérer votre compte si vous oubliez votre master password.</p>
            
            <div class="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 mb-4">
                <p class="text-xs font-medium text-gray-600 mb-2">Votre recovery key :</p>
                <div class="bg-white p-3 rounded border border-gray-300 break-all font-mono text-xs" id="recoveryKeyDisplay">${recoveryKey}</div>
                <button id="copyRecoveryBtn" class="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors">
                    Copier la recovery key
                </button>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-red-800 font-medium">
                    <strong>IMPORTANT :</strong> Notez cette clé sur papier ou dans un endroit sûr. Vous ne pourrez plus la voir après avoir fermé cette fenêtre.
                </p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-blue-800">
                    <strong>Astuce :</strong> Conservez-la dans un coffre-fort physique ou un gestionnaire de mots de passe secondaire.
                </p>
            </div>

            <button id="confirmRecoveryBtn" class="w-full bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                J'ai sauvegardé ma recovery key
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Copier la recovery key
    document.getElementById('copyRecoveryBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(recoveryKey);
        document.getElementById('copyRecoveryBtn').textContent = '✓ Copié';
        setTimeout(() => {
            document.getElementById('copyRecoveryBtn').textContent = 'Copier la recovery key';
        }, 2000);
    });

    // Fermer et rediriger
    document.getElementById('confirmRecoveryBtn').addEventListener('click', () => {
        modal.remove();
        window.location.href = '/dashboard';
    });
}

// Fonctions utilitaires
function showError(message) {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.classList.remove('hidden');
    successMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('hidden');
}

function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}