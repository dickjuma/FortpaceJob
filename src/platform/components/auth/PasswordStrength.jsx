import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function PasswordStrength({ password }) {
  const reqs = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number or symbol', met: /[0-9!@#$%^&*]/.test(password) }
  ];

  const strength = reqs.filter(r => r.met).length;
  
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  if (strength === 3) { strengthLabel = 'Good'; strengthColor = 'bg-amber-500'; }
  if (strength === 4) { strengthLabel = 'Strong'; strengthColor = 'bg-success'; }
  if (password.length === 0) { strengthColor = 'bg-zinc-200'; strengthLabel = ''; }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((level) => (
            <div 
              key={level} 
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                password.length > 0 && level <= strength ? strengthColor : 'bg-zinc-200'
              }`} 
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-zinc-500 w-12 text-right">
          {strengthLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {reqs.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <X className="w-3.5 h-3.5 text-zinc-300" />
            )}
            <span className={req.met ? "text-zinc-700" : "text-zinc-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
