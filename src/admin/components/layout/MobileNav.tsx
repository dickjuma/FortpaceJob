// @ts-nocheck
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  DollarSign, 
  MessageSquare,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const MobileNav: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  const navItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Home', href: '/admin' },
    { id: 'users', icon: Users, label: 'Users', href: '/admin/users' },
    { id: 'finance', icon: DollarSign, label: 'Finance', href: '/admin/finance' },
    { id: 'support', icon: MessageSquare, label: 'Support', href: '/admin/support' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-surface-border dark:border-surface-dark-border px-4 flex items-center justify-around z-40 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive 
                ? "text-[#14a800] dark:text-[#14a800]" 
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
