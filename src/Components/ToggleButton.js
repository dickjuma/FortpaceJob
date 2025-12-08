import { Briefcase, Search } from 'lucide-react';

const ToggleButton = ({isHiring, setIsHiring}) => {
  

  return (
    <div className="flex bg-[var(--accent-pink)] rounded-full px-12 py-2">
      <button
        onClick={() => setIsHiring(true)}
        className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 ${
          isHiring 
            ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm' 
            : 'text-[var(--color-primary)]'
        }`}
      >
        <Briefcase size={16} />
        <span className="text-sm">For Hiring</span>
      </button>
      
      <button
        onClick={() => setIsHiring(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          !isHiring 
            ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm' 
            : 'text-[var(--color-primary)]'
        }`}
      >
        <Search size={16} />
        <span className="text-sm">For Finding work</span>
      </button>
    </div>
  );
};

export default ToggleButton