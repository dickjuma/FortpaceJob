import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function PopoverConfirm({ 
  children, 
  title = "Are you sure?", 
  description,
  onConfirm, 
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "No",
  variant = "danger" // danger, warning, info
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleConfirm = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onConfirm) onConfirm();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  const colors = {
    danger: "text-red-500 bg-red-50 dark:bg-red-900/20",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    info: "text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20"
  };

  const btnColors = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-500/20",
    warning: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
    info: "bg-[#4C1D95] hover:bg-[#22C55E] shadow-#4C1D95]/20"
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
        {children}
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-64 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 z-[150] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-3 mb-4">
            <div className={cn("p-2 rounded-lg shrink-0", colors[variant])}>
              {variant === 'info' ? <HelpCircle size={16} /> : <AlertCircle size={16} />}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">{title}</h4>
              {description && <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">{description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCancel}
              className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {cancelLabel}
            </button>
            <button 
              onClick={handleConfirm}
              className={cn(
                "flex-1 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg transition-all active:scale-95",
                btnColors[variant]
              )}
            >
              {confirmLabel}
            </button>
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full right-4 -mt-1 w-3 h-3 bg-white dark:bg-surface-dark border-r border-b border-zinc-200 dark:border-zinc-800 rotate-45" />
        </div>
      )}
    </div>
  );
}


