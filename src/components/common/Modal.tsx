// @ts-nocheck
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react'; // Make sure lucide-react is installed, if not we will use an SVG



export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: any) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-navy/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className={twMerge(
          clsx(
            'relative w-full bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh] animate-fade-in',
            sizes[size]
          )
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-navy">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-navy hover:bg-light-gray rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-red"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-light-gray/50 rounded-b-xl flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
