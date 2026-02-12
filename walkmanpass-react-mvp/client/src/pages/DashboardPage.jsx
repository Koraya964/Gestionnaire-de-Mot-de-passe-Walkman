import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  X,
  Lock,
  Globe,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const DashboardPage = () => {
  // --- ÉTATS ---
  const [passwords, setPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // États Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDecryptModal, setShowDecryptModal] = useState(false);

  // États Données Modales
  const [currentId, setCurrentId] = useState(null);
  const [decryptAction, setDecryptAction] = useState("view"); // 'view' ou 'copy'
  const [masterPassConfirm, setMasterPassConfirm] = useState("");
  const [passLength, setPassLength] = useState(16);

  // Formulaire (Commun Add/Edit)
  const [formData, setFormData] = useState({
    titre: "",
    site: "",
    userName: "",
    email: "",
    password: "",
    category: "other",
    masterPassword: "",
  });

  // --- LOGIQUE RÉCUPÉRATION ---
  const fetchPasswords = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/passwords`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok)
        setPasswords(Array.isArray(data) ? data : data.passwords || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  // --- LOGIQUE FORMULAIRES ---
  const resetForm = () => {
    setFormData({
      titre: "",
      site: "",
      userName: "",
      email: "",
      password: "",
      category: "other",
      masterPassword: "",
    });
    setCurrentId(null);
  };

  const generatePass = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let res = "";
    for (let i = 0; i < passLength; i++)
      res += charset.charAt(Math.floor(Math.random() * charset.length));
    setFormData({ ...formData, password: res });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/passwords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchPasswords();
      } else {
        const err = await response.json();
        alert(err.error || "Erreur");
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/passwords/${currentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowEditModal(false);
        resetForm();
        fetchPasswords();
      } else {
        const err = await response.json();
        alert(err.error || "Erreur");
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ?")) return;
    await fetch(`${API_URL}/passwords/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchPasswords();
  };

  // --- LOGIQUE DÉCHIFFREMENT ---
  const handleDecrypt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}/passwords/${currentId}/decrypt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ masterPassword: masterPassConfirm }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        if (decryptAction === "copy") {
          navigator.clipboard.writeText(data.password);
          alert("Copié !");
        } else {
          setPasswords(
            passwords.map((p) =>
              p._id === currentId ? { ...p, decrypted: data.password } : p,
            ),
          );
        }
        setShowDecryptModal(false);
        setMasterPassConfirm("");
      } else {
        alert("Master Password incorrect");
      }
    } catch (err) {
      alert("Erreur");
    }
  };

  const filteredPasswords = passwords.filter(
    (p) =>
      p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.site?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <svg
              className="w-6 h-6 text-white"
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
          <a
            href="/"
            className="text-xl font-bold tracking-tight hover:text-indigo-800"
          >
            Wakman
            <span className="text-indigo-600 hover:text-indigo-800">Pass</span>
          </a>
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
            className="hover:bg-cyan-600 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl"
          >
            <Plus size={20} /> Nouveau mot de passe
          </button>
        </div>

        {/* Search */}
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

        {/* Table */}
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
        </div>
      </main>

      {/* --- MODALE DÉCHIFFREMENT --- */}
      {showDecryptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl">
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
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"
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
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE AJOUT / MODIF --- */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
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
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
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
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
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
                    className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-indigo-600 outline-none"
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

// --- COMPOSANT LIGNE ---
const PasswordRow = ({ item, onDelete, onEdit, onView, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const getFavicon = (url) => {
    if (!url) return null;
    const domain = url
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0];
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  };

  const handleCopyLocal = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const catNames = {
    social: "Social",
    banking: "Banque",
    email: "Email",
    shopping: "Shopping",
    work: "Travail",
    other: "Général",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-all">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
            {item.site ? (
              <img
                src={getFavicon(item.site)}
                alt=""
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='2' y1='12' x2='22' y2='12'%3E%3C/line%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E";
                }}
              />
            ) : (
              <Globe className="text-slate-300" size={20} />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight">
              {item.titre}
            </div>
            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter mt-0.5">
              {catNames[item.category] || "Général"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-sm text-slate-600 font-medium">
        {item.userName || item.email || (
          <span className="text-slate-300">N/A</span>
        )}
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-300 tracking-widest">
            {item.decrypted ? item.decrypted : "••••••••"}
          </span>
          <button
            onClick={onView}
            className="text-slate-300 hover:text-indigo-600 transition-colors"
          >
            {item.decrypted ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopyLocal}
            title="Copier"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200"
          >
            {copied ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <Copy size={18} />
            )}
          </button>
          <button
            onClick={onEdit}
            title="Modifier"
            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-200"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            title="Supprimer"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DashboardPage;
