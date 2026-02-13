import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerTelephone, setRegisterTelephone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const hideMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    hideMessages();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Erreur de connexion");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userName",
        data.user.firstName + " " + data.user.lastName,
      );
      localStorage.setItem("userEmail", data.user.email);

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur:", error);
      showError("Erreur de connexion au serveur");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    hideMessages();

    if (registerPassword !== registerPasswordConfirm) {
      showError("Les mots de passe ne correspondent pas");
      return;
    }

    if (registerPassword.length < 8) {
      showError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: registerFirstName,
          lastName: registerLastName,
          email: registerEmail,
          telephone: registerTelephone || undefined,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Erreur lors de l'inscription");
        return;
      }

      setRecoveryKey(data.recoveryKey);
      setShowRecoveryModal(true);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userName",
        data.user.firstName + " " + data.user.lastName,
      );
      localStorage.setItem("userEmail", data.user.email);
    } catch (error) {
      console.error("Erreur:", error);
      showError("Erreur de connexion au serveur");
    }
  };

  const copyRecoveryKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    const btn = document.getElementById("copyRecoveryBtn");
    if (btn) {
      btn.textContent = "✓ Copié";
      setTimeout(() => {
        btn.textContent = "Copier la recovery key";
      }, 2000);
    }
  };

  const confirmRecovery = () => {
    setShowRecoveryModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="bg-gradient-to-br from-violet-600 via-blue-500 to-indigo-600 min-h-screen">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <svg
                  className="w-7 h-7 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-4xl font-black text-white">
                WalkmanPass
              </span>
            </div>
            <p className="text-white/90 font-medium">
              Gérez vos mots de passe en toute sécurité
            </p>
          </div>

          {/* Card */}
          <div
            className="glass rounded-3xl shadow-2xl p-8"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-2xl p-1.5">
              <button
                onClick={() => {
                  setActiveTab("login");
                  hideMessages();
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === "login" ? "bg-white text-violet-600 shadow-md" : "text-gray-600 hover:text-gray-900"}`}
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  hideMessages();
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === "register" ? "bg-white text-violet-600 shadow-md" : "text-gray-600 hover:text-gray-900"}`}
              >
                Inscription
              </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Se connecter
                </button>
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-violet-600 hover:text-violet-700 font-semibold"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={registerLastName}
                      onChange={(e) => setRegisterLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={registerTelephone}
                    onChange={(e) => setRegisterTelephone(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    Minimum 8 caractères. Zero-knowledge : impossible de le
                    récupérer si oublié.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirmer mot de passe
                  </label>
                  <input
                    type="password"
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Créer mon compte
                </button>
              </form>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-5 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-800 text-sm font-semibold">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mt-5 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-800 text-sm font-semibold">
                  {successMessage}
                </p>
              </div>
            )}
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-white hover:text-white/80 text-sm font-semibold inline-flex items-center space-x-2 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recovery Key Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Recovery Key générée
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sauvegardez précieusement cette clé ! Elle vous permettra de
              récupérer votre compte si vous oubliez votre master password.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 mb-4">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Votre recovery key :
              </p>
              <div className="bg-white p-3 rounded border border-gray-300 break-all font-mono text-xs">
                {recoveryKey}
              </div>
              <button
                id="copyRecoveryBtn"
                onClick={copyRecoveryKey}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Copier la recovery key
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-800 font-medium">
                <strong>IMPORTANT :</strong> Notez cette clé sur papier ou dans
                un endroit sûr. Vous ne pourrez plus la voir après avoir fermé
                cette fenêtre.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>Astuce :</strong> Conservez-la dans un coffre-fort
                physique ou un gestionnaire de mots de passe secondaire.
              </p>
            </div>

            <button
              onClick={confirmRecovery}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              J'ai sauvegardé ma recovery key
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
