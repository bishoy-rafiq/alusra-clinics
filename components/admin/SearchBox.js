"use client";

import { Search } from "lucide-react";

export default function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-slate/60" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-line bg-white py-2.5 pe-4 ps-10 text-sm text-brand-ink shadow-sm outline-none transition placeholder:text-brand-slate/60 focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20"
      />
    </div>
  );
}
