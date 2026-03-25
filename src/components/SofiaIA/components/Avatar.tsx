import React from 'react';
import { motion } from 'motion/react';
import { CallState } from '../screens/SofiaCallScreen';

interface AvatarProps {
  state: CallState;
}

export const Avatar = ({ state }: AvatarProps) => {
  const variants = {
    idle: { scale: 1, opacity: 1 },
    listening: { scale: 1.05, opacity: 1 },
    speaking: { scale: 1.1, opacity: 1 },
    processing: { scale: 1, opacity: 0.8 },
    urgent: { scale: 1.1, opacity: 1 },
  };

  const glowVariants = {
    idle: { opacity: 0 },
    listening: { opacity: 0.5, scale: 1.2 },
    speaking: { opacity: 1, scale: 1.4 },
    processing: { opacity: 0.3, scale: 1.1 },
    urgent: { opacity: 1, scale: 1.5 },
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-sky-400 blur-3xl"
        variants={glowVariants}
        animate={state}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
        variants={variants}
        animate={state}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://picsum.photos/seed/sofia/500/500"
          alt="Sofia IA Avatar"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </div>
  );
};
