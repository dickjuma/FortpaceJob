import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, Eye, Edit3, UserX, 
  ShieldCheck, Wallet, History, Ban 
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import useUserManagementStore from '../../../store/userManagementStore';

const ActionItem = ({ icon: Icon, label, onClick, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors text-left",
      variant === 'danger' 
        ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" 
        : "text-zinc-600 dark:text-zinc-400 hover:bg-surface dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
    )}
  >
    <Icon size={14} />
    {label}
  </button>
);

/**
 * Dropdown component for role-appropriate quick actions on a user.
 */
const UserQuickActions = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const openModal = useUserManagementStore(s => s.openModal);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (callback) => {
    setIsOpen(false);
    callback();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all",
          isOpen && "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
        )}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-100">
          <ActionItem 
            icon={Eye} 
            label="View Full Profile" 
            onClick={() => handleAction(() => navigate(`/admin/users/${user.id}`))} 
          />
          <ActionItem 
            icon={Edit3} 
            label="Edit Information" 
            onClick={() => handleAction(() => openModal('EDIT_USER', user))} 
          />
          
          <div className="my-1 border-t border-zinc-50 dark:border-zinc-800/50" />
          
          <ActionItem 
            icon={UserX} 
            label={user.status === 'suspended' ? 'Reactivate User' : 'Suspend User'} 
            onClick={() => handleAction(() => openModal('SUSPEND_USER', user))} 
          />
          
          <ActionItem 
            icon={ShieldCheck} 
            label="Adjust Ranking" 
            onClick={() => handleAction(() => openModal('ADJUST_RANKING', user))} 
          />
          
          <ActionItem 
            icon={Wallet} 
            label="Flag Account" 
            onClick={() => handleAction(() => openModal('FLAG_USER', user))} 
          />
          
          <ActionItem 
            icon={History} 
            label="Audit History" 
            onClick={() => handleAction(() => navigate(`/admin/users/${user.id}?tab=audit`))} 
          />
          
          <div className="my-1 border-t border-zinc-50 dark:border-zinc-800/50" />
          
          <ActionItem 
            icon={Ban} 
            label="Permanently Ban" 
            variant="danger"
            onClick={() => handleAction(() => openModal('FLAG_USER', user))} 
          />
        </div>
      )}
    </div>
  );
};

export default UserQuickActions;
