import React from 'react';

export default function AvatarInitials({ name = 'U', className = 'w-12 h-12', imageUrl }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={`${className} rounded-full object-cover`} />;
  }
  const letter = String(name).trim().charAt(0).toUpperCase() || 'U';
  return (
    <div
      className={`${className} rounded-full bg-[#2bb75c]/10 text-[#2bb75c] flex items-center justify-center font-black`}
      aria-hidden
    >
      {letter}
    </div>
  );
}

