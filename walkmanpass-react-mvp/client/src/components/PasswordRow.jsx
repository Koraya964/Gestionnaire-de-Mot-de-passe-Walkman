import React, { useState } from "react";
import { Eye, EyeOff, Trash2, Edit3, Copy, Check, Globe } from "lucide-react";

export const PasswordRow = ({ item, onDelete, onEdit, onView, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const getFavicon = (url) => {
    if (!url) return null;
    const domain = url
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0];
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
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
                onError={(e) => (e.target.src = "data:image/svg+xml,%3Csvg...")}
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
            onClick={() => {
              onCopy();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-2 text-slate-400 hover:text-indigo-600"
          >
            {copied ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <Copy size={18} />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-amber-500"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
