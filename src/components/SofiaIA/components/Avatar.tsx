import React from 'react';
import { CallState } from '../screens/SofiaCallScreen';

interface AvatarProps {
  state: CallState;
}

export const Avatar = ({ state }: AvatarProps) => {
  const getAnimationClass = () => {
    switch (state) {
      case 'listening': return 'ring-sky-400 animate-pulse';
      case 'thinking': return 'ring-amber-400 animate-bounce';
      case 'speaking': return 'ring-sky-500 animate-pulse scale-105';
      case 'urgent': return 'ring-red-500 animate-pulse';
      default: return 'ring-slate-700';
    }
  };

  return (
    <div className={`w-64 h-64 rounded-full border-4 ring-4 transition-all duration-500 overflow-hidden ${getAnimationClass()}`}>
      <img
        src="https://picsum.photos/seed/sofia/500/500"
        alt="Sofia IA Avatar"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
