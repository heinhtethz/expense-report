import React from "react";

const Footer = ({ data, updateField }: any) => {
  return (
    <div className="space-y-4 pt-4 pb-20">
      <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
        Footer Customization
      </h2>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          Balance Label
        </label>
        <input
          type="text"
          value={data.balanceLabel}
          onChange={(e) =>
            updateField("balanceLabel", e.target.value.toUpperCase())
          }
          className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm p-3 border myanmar-font bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default Footer;
