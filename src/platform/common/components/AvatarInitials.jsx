import React from 'react';

export default function AvatarInitials({ name = 'U', className = 'w-12 h-12', imageUrl }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={`${className} rounded-full object-cover`} />;
  }
  const letter = String(name).trim().charAt(0).toUpperCase() || 'U';
  return (
    <div
      className={`${className} rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-black`}
      aria-hidden
    >
      {letter}
    </div>
  );
}


