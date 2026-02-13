import { useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api";

export const useDashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // États Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDecryptModal, setShowDecryptModal] = useState(false);

  // États Données
  const [currentId, setCurrentId] = useState(null);
  const [decryptAction, setDecryptAction] = useState("view");
  const [masterPassConfirm, setMasterPassConfirm] = useState("");
  const [passLength, setPassLength] = useState(16);

  const [formData, setFormData] = useState({
    titre: "",
    site: "",
    userName: "",
    email: "",
    password: "",
    category: "other",
    masterPassword: "",
  });

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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
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

  const handleDecrypt = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/passwords/${currentId}/decrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ masterPassword: masterPassConfirm }),
    });
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
  };

  const filteredPasswords = passwords.filter(
    (p) =>
      p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.site?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    passwords,
    setPasswords,
    searchTerm,
    setSearchTerm,
    loading,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showDecryptModal,
    setShowDecryptModal,
    formData,
    setFormData,
    currentId,
    setCurrentId,
    decryptAction,
    setDecryptAction,
    masterPassConfirm,
    setMasterPassConfirm,
    passLength,
    setPassLength,
    fetchPasswords,
    resetForm,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
    handleDecrypt,
    filteredPasswords,
  };
};
