import { Briefcase, Search } from "lucide-react";

const ToggleButton = ({ isHiring, setIsHiring }) => {
  
  return (
    <div className="flex bg-[var(--accent-pink)] rounded-full px-3 sm:px-6 md:px-12 py-1.5 md:py-2">

      <button
        onClick={() => setIsHiring(true)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
          isHiring
            ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm"
            : "text-[var(--color-primary)]"
        }`}
      >
        <Briefcase size={14} className="sm:w-4" />
        <span className="text-xs sm:text-sm whitespace-nowrap">For Hiring</span>
      </button>

      <button
        onClick={() => setIsHiring(false)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
          !isHiring
            ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm"
            : "text-[var(--color-primary)]"
        }`}
      >
        <Search size={14} className="sm:w-4" />
        <span className="text-xs sm:text-sm whitespace-nowrap">
          For Finding Work
        </span>
      </button>
    </div>
  );
};

export default ToggleButton;
