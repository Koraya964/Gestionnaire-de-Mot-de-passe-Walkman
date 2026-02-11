// spaghetty land je sais mais c'est un proto soyez sympa ! :)

// Configuration
const API_URL = 'http://localhost:5000/api';

// Variables globales
let passwords = [];
let currentPasswordId = null;

// Check connexion
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// DOM Elements
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const passwordsTableBody = document.getElementById('passwordsTableBody');
const emptyState = document.getElementById('emptyState');
const quickAddForm = document.getElementById('quickAddForm');
const quickGenerateBtn = document.getElementById('quickGenerateBtn');
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const viewPasswordModal = document.getElementById('viewPasswordModal');
const editPasswordModal = document.getElementById('editPasswordModal');
const masterPasswordModal = document.getElementById('masterPasswordModal');
const masterPasswordForm = document.getElementById('masterPasswordForm');
const editPasswordForm = document.getElementById('editPasswordForm');

// Init
document.addEventListener('DOMContentLoaded', () => {
    userEmail.textContent = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    loadPasswords();
    generateAndSetPassword();
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.replace('/login')
    window.location.href = '/';
});

// Toggle password visibility dans le générateur
document.getElementById('toggleQuickPassword').addEventListener('click', () => {
    const input = document.getElementById('quickPassword');
    const btn = document.getElementById('toggleQuickPassword');

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
        </svg>`;
    } else {
        input.type = 'password';
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>`;
    }
});

// Password length slider
passwordLength.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    generateAndSetPassword();
});

// Auto-generate when options change
document.querySelectorAll('#genMinuscules, #genMajuscules, #genChiffres, #genSymboles').forEach(checkbox => {
    checkbox.addEventListener('change', generateAndSetPassword);
});

// Generate button
quickGenerateBtn.addEventListener('click', generateAndSetPassword);

function generateAndSetPassword() {
    const password = generatePassword();
    document.getElementById('quickPassword').value = password;
    updateStrengthIndicator(password);
}

function generatePassword() {
    const length = parseInt(passwordLength.value);
    const useLower = document.getElementById('genMinuscules').checked;
    const useUpper = document.getElementById('genMajuscules').checked;
    const useNumbers = document.getElementById('genChiffres').checked;
    const useSymbols = document.getElementById('genSymboles').checked;

    let charset = '';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

function updateStrengthIndicator(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    strengthBar.style.width = strength + '%';

    if (strength < 40) {
        strengthBar.className = 'h-full bg-red-500 transition-all duration-300';
        strengthText.textContent = 'Faible';
        strengthText.className = 'text-xs font-semibold text-red-600';
    } else if (strength < 70) {
        strengthBar.className = 'h-full bg-orange-500 transition-all duration-300';
        strengthText.textContent = 'Moyen';
        strengthText.className = 'text-xs font-semibold text-orange-600';
    } else {
        strengthBar.className = 'h-full bg-green-500 transition-all duration-300';
        strengthText.textContent = 'Fort';
        strengthText.className = 'text-xs font-semibold text-green-600';
    }
}

// Quick add
quickAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const siteValue = document.getElementById('quickSite').value;
    let titre = siteValue;
    try {
        titre = new URL(siteValue).hostname;
    } catch {
        // Keep original if not valid URL
    }

    const data = {
        titre,
        site: siteValue,
        email: document.getElementById('quickEmail').value,
        userName: document.getElementById('quickUserName').value,
        category: document.getElementById('quickCategory').value,
        password: document.getElementById('quickPassword').value,
        masterPassword: document.getElementById('quickMasterPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/passwords`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        quickAddForm.reset();
        document.getElementById('quickCategory').value = 'other';
        generateAndSetPassword();
        loadPasswords();

    } catch (error) {
        alert(error.message || 'Erreur lors de l\'ajout');
    }
});

// Load passwords
async function loadPasswords() {
    try {
        const response = await fetch(`${API_URL}/passwords`, { headers });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        passwords = data.passwords;
        displayPasswords(passwords);

    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement');
    }
}

// Display passwords
function displayPasswords(passwordsToDisplay) {
    passwordsTableBody.innerHTML = '';

    if (passwordsToDisplay.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    passwordsToDisplay.forEach(pwd => {
        const row = createPasswordRow(pwd);
        passwordsTableBody.appendChild(row);
    });
}

// Create row
function createPasswordRow(pwd) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50/50 transition-colors';

    const website = pwd.site ? (() => { try { return new URL(pwd.site).hostname; } catch { return pwd.site; } })() : '';
    const favicon = pwd.site ? `https://www.google.com/s2/favicons?domain=${website}&sz=32` : '';

    const categoryInfo = {
        'social': { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Social' },
        'banking': { color: 'bg-green-50 text-green-700 border-green-200', label: 'Banque' },
        'email': { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Email' },
        'shopping': { color: 'bg-pink-50 text-pink-700 border-pink-200', label: 'Shopping' },
        'work': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Travail' },
        'other': { color: 'bg-gray-50 text-gray-700 border-gray-200', label: 'Autre' }
    };

    const categoryStyle = categoryInfo[pwd.category] || categoryInfo['other'];

    tr.innerHTML = `
        <td class="px-6 py-3.5">
            <div class="flex items-center gap-3">
                ${favicon ? `<img src="${favicon}" alt="" class="w-6 h-6 rounded" onerror="this.style.display='none'">` :
            `<div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>`}
                <div class="min-w-0">
                    <p class="font-medium text-sm text-gray-900 truncate">${escapeHtml(pwd.titre)}</p>
                    ${pwd.site ? `<p class="text-xs text-gray-500 truncate">${escapeHtml(website)}</p>` : ''}
                </div>
            </div>
        </td>
        <td class="px-6 py-3.5">
            <p class="text-sm text-gray-700 truncate">${escapeHtml(pwd.email || pwd.userName || '—')}</p>
        </td>
        <td class="px-6 py-3.5">
            <span class="font-mono text-sm text-gray-300">••••••••••••</span>
        </td>
        <td class="px-6 py-3.5">
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${categoryStyle.color}">${categoryStyle.label}</span>
        </td>
        <td class="px-6 py-3.5">
            <div class="flex items-center justify-end gap-1.5">
                <button onclick="viewPassword('${pwd._id}')" 
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-xs font-medium">
                    Afficher
                </button>
                <button onclick="copyPassword('${pwd._id}')" 
                    class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs font-medium">
                    Copier
                </button>
                <button onclick="deletePassword('${pwd._id}')" 
                    class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-medium">
                    Suppr
                </button>
            </div>
        </td>
    `;

    return tr;
}

// Search
searchInput.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = passwords.filter(pwd =>
        pwd.titre.toLowerCase().includes(search) ||
        (pwd.site && pwd.site.toLowerCase().includes(search)) ||
        (pwd.email && pwd.email.toLowerCase().includes(search)) ||
        (pwd.userName && pwd.userName.toLowerCase().includes(search))
    );
    displayPasswords(filtered);
});

// View password
function viewPassword(passwordId) {
    currentPasswordId = passwordId;
    masterPasswordModal.classList.remove('hidden');
    document.getElementById('masterPasswordPrompt').value = '';
    document.getElementById('masterPasswordError').classList.add('hidden');
}

// Copy password
async function copyPassword(passwordId) {
    const masterPassword = prompt('Entrez votre mot de passe :');
    if (!masterPassword) return;

    try {
        const response = await fetch(`${API_URL}/passwords/${passwordId}/decrypt`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ masterPassword })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        navigator.clipboard.writeText(result.password);
        alert('Copié !');

    } catch (error) {
        alert(error.message);
    }
}

// Delete password
async function deletePassword(passwordId) {
    if (!confirm('Supprimer ce mot de passe ?')) return;

    try {
        const response = await fetch(`${API_URL}/passwords/${passwordId}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        loadPasswords();

    } catch (error) {
        alert(error.message);
    }
}

// Master password form
masterPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const masterPassword = document.getElementById('masterPasswordPrompt').value;

    try {
        const response = await fetch(`${API_URL}/passwords/${currentPasswordId}/decrypt`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ masterPassword })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        masterPasswordModal.classList.add('hidden');
        showPasswordDetails(result.password);

    } catch (error) {
        const errorDiv = document.getElementById('masterPasswordError');
        errorDiv.classList.remove('hidden');
        errorDiv.querySelector('p').textContent = error.message;
    }
});

document.getElementById('cancelMasterPasswordBtn').addEventListener('click', () => {
    masterPasswordModal.classList.add('hidden');
});

// Show details
function showPasswordDetails(decryptedPassword) {
    const pwd = passwords.find(p => p._id === currentPasswordId);

    document.getElementById('viewTitle').textContent = pwd.titre;

    if (pwd.site) {
        document.getElementById('viewSiteContainer').classList.remove('hidden');
        document.getElementById('viewSite').href = pwd.site;
        document.getElementById('viewSite').textContent = pwd.site;
    } else {
        document.getElementById('viewSiteContainer').classList.add('hidden');
    }

    if (pwd.userName) {
        document.getElementById('viewUserNameContainer').classList.remove('hidden');
        document.getElementById('viewUserName').textContent = pwd.userName;
    } else {
        document.getElementById('viewUserNameContainer').classList.add('hidden');
    }

    if (pwd.email) {
        document.getElementById('viewEmailContainer').classList.remove('hidden');
        document.getElementById('viewEmail').textContent = pwd.email;
    } else {
        document.getElementById('viewEmailContainer').classList.add('hidden');
    }

    document.getElementById('viewPassword').value = decryptedPassword;
    document.getElementById('viewPassword').type = 'password';

    viewPasswordModal.classList.remove('hidden');
}

// Toggle password in modal
document.getElementById('togglePasswordBtn').addEventListener('click', () => {
    const input = document.getElementById('viewPassword');
    const btn = document.getElementById('togglePasswordBtn');

    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Masquer';
    } else {
        input.type = 'password';
        btn.textContent = 'Afficher';
    }
});

document.getElementById('closeViewBtn').addEventListener('click', () => {
    viewPasswordModal.classList.add('hidden');
});

// Edit button
document.getElementById('editPasswordBtn').addEventListener('click', () => {
    viewPasswordModal.classList.add('hidden');

    const pwd = passwords.find(p => p._id === currentPasswordId);

    document.getElementById('editTitre').value = pwd.titre;
    document.getElementById('editSite').value = pwd.site || '';
    document.getElementById('editUserName').value = pwd.userName || '';
    document.getElementById('editEmail').value = pwd.email || '';
    document.getElementById('editCategory').value = pwd.category || 'other';
    document.getElementById('editPassword').value = '';
    document.getElementById('editMasterPassword').value = '';

    editPasswordModal.classList.remove('hidden');
});

document.getElementById('cancelEditBtn').addEventListener('click', () => {
    editPasswordModal.classList.add('hidden');
});

// Submit edit
editPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        titre: document.getElementById('editTitre').value,
        site: document.getElementById('editSite').value,
        userName: document.getElementById('editUserName').value,
        email: document.getElementById('editEmail').value,
        category: document.getElementById('editCategory').value,
        masterPassword: document.getElementById('editMasterPassword').value
    };

    const newPassword = document.getElementById('editPassword').value;
    if (newPassword) {
        data.password = newPassword;
    }

    try {
        const response = await fetch(`${API_URL}/passwords/${currentPasswordId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        editPasswordModal.classList.add('hidden');
        loadPasswords();
        alert('Modifié !');

    } catch (error) {
        alert(error.message || 'Erreur');
    }
});

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}