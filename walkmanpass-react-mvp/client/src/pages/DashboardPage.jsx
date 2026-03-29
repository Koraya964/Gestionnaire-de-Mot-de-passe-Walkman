import React, { useEffect } from "react";
import {
  Plus,
  Search,
  LogOut,
  X,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
  Smile,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { PasswordRow } from "../components/PasswordRow";

const DashboardPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showDecryptModal,
    setShowDecryptModal,
    formData,
    setFormData,
    masterPassConfirm,
    setMasterPassConfirm,
    passLength,
    setPassLength,
    setDecryptAction,
    setCurrentId,
    fetchPasswords,
    resetForm,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    handleDecrypt,
    filteredPasswords,
  } = useDashboard();

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  // Petite fonction utilitaire restée ici pour la réactivité de l'input range
  const generatePass = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let res = "";
    for (let i = 0; i < passLength; i++)
      res += charset.charAt(Math.floor(Math.random() * charset.length));
    setFormData({ ...formData, password: res });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Wakman<span className="text-indigo-600">Pass</span>
          </span>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-slate-400 hover:text-red-500 flex items-center gap-2 font-medium transition-colors"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black">Coffre-fort</h2>
            <p className="text-slate-500 text-sm">
              Gestionnaire de mots de passe sécurisé
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="hover:bg-indigo-700 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl"
          >
            <Plus size={20} /> Ajouter un mot de passe
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tableau des mots de passe */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Service
                </th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Identifiants
                </th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sécurité
                </th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPasswords.map((item) => (
                <PasswordRow
                  key={item._id}
                  item={item}
                  onDelete={() => handleDelete(item._id)}
                  onEdit={() => {
                    setCurrentId(item._id);
                    setFormData({ ...item, password: "", masterPassword: "" });
                    setShowEditModal(true);
                  }}
                  onView={() => {
                    setCurrentId(item._id);
                    setDecryptAction("view");
                    setShowDecryptModal(true);
                  }}
                  onCopy={() => {
                    setCurrentId(item._id);
                    setDecryptAction("copy");
                    setShowDecryptModal(true);
                  }}
                />
              ))}
            </tbody>
          </table>
          {filteredPasswords.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              Aucun mot de passe trouvé.
            </div>
          )}
        </div>
      </main>

      {/* --- MODALE DÉCHIFFREMENT --- */}
      {showDecryptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-3 mb-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Lock className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Action sécurisée</h3>
              <p className="text-sm text-slate-500">
                Master Password requis pour déchiffrer.
              </p>
            </div>
            <form onSubmit={handleDecrypt} className="space-y-4">
              <input
                autoFocus
                required
                type="password"
                placeholder="Mot de passe maître"
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-indigo-500"
                value={masterPassConfirm}
                onChange={(e) => setMasterPassConfirm(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDecryptModal(false)}
                  className="flex-1 py-3 text-slate-400 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE AJOUT / MODIFICATION --- */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">
                {showAddModal ? "Ajouter un accès" : "Modifier l'accès"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Titre
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="GitHub, Gmail..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    value={formData.titre}
                    onChange={(e) =>
                      setFormData({ ...formData, titre: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Catégorie
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none appearance-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="social">Réseaux Sociaux</option>
                    <option value="banking">Banque / Finance</option>
                    <option value="email">Email</option>
                    <option value="shopping">Shopping</option>
                    <option value="work">Travail</option>
                    <option value="other">Autre / Général</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Site Web
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500"
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({ ...formData, site: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    required={showAddModal}
                    type="text"
                    placeholder={
                      showEditModal
                        ? "Nouveau MDP (laisser vide si inchangé)"
                        : "Mot de passe"
                    }
                    className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-indigo-600 outline-none focus:border-indigo-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={generatePass}
                    className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-4 px-1">
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={passLength}
                    onChange={(e) => setPassLength(e.target.value)}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="text-xs font-bold text-slate-400 w-8">
                    {passLength}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3 mt-4">
                <label className="text-xs font-bold text-amber-600 uppercase flex items-center gap-2">
                  <Lock size={14} /> Master Password Requis
                </label>
                <input
                  required
                  type="password"
                  placeholder="Mot de passe maître pour chiffrer"
                  className="w-full p-4 bg-white border border-amber-200 rounded-2xl outline-none focus:border-amber-500"
                  value={formData.masterPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, masterPassword: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 py-4 font-bold text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                  {showAddModal ? "Sauvegarder" : "Mettre à jour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
