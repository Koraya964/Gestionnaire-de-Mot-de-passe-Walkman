import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [newRecoveryKey, setNewRecoveryKey] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (recoveryKey.length !== 64) {
      setError("La recovery key doit faire 64 caractères");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password-recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          recoveryKey,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la réinitialisation");
        return;
      }

      setNewRecoveryKey(data.newRecoveryKey);
      setShowModal(true);
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  const copyRecoveryKey = () => {
    navigator.clipboard.writeText(newRecoveryKey);
    alert("Recovery key copiée !");
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              SecurePass
            </span>
          </div>
          <p className="text-sm text-gray-600">Récupération de compte</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 border border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Mot de passe oublié
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Utilisez votre recovery key pour réinitialiser votre master
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Recovery Key
              </label>
              <input
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                required
                placeholder="64 caractères hexadécimaux"
                maxLength={64}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                La clé que vous avez reçue lors de l'inscription
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Réinitialiser le mot de passe
            </button>
          </form>

          {/* Info box */}
          <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>ℹ Note :</strong> Tous vos mots de passe stockés seront
              automatiquement re-chiffrés avec votre nouveau master password.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>

      {/* Recovery Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Nouvelle Recovery Key
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Votre recovery key a été régénérée. Sauvegardez-la précieusement !
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 mb-4">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Votre nouvelle recovery key :
              </p>
              <div className="bg-white p-3 rounded border border-gray-300 break-all font-mono text-xs">
                {newRecoveryKey}
              </div>
              <button
                onClick={copyRecoveryKey}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Copier
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-800 font-medium">
                Notez cette clé maintenant ! Vous ne pourrez plus la voir après
                avoir fermé cette fenêtre.
              </p>
            </div>

            <button
              onClick={closeModal}
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

export default ForgotPasswordPage;
