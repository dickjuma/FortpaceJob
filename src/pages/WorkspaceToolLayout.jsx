import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const shell = {
  bg: "bg-[#F6F1EE]",
  card: "bg-white",
  border: "border-[#E7DDD8]",
  ink: "text-[#2B211F]",
  muted: "text-[#6F5B53]",
};

export default function WorkspaceToolLayout({ title, description, children }) {
  return (
    <div className={`min-h-screen ${shell.bg}`}>
      <header className={`${shell.card} border-b ${shell.border} px-4 py-4 md:px-6`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/my-profile/overview" className={shell.muted}>
              My Profile
            </Link>
            <ChevronRight size={14} className={shell.muted} />
            <span className={shell.ink}>{title}</span>
          </div>
          <h1 className={`mt-3 text-2xl font-semibold ${shell.ink}`}>{title}</h1>
          <p className={`mt-1 text-sm ${shell.muted}`}>{description}</p>
        </div>
      </header>

      <main className="px-4 py-6 md:px-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
