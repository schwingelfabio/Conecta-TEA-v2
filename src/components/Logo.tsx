import React from 'react';
import { Shield, Brain, Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: { shield: 32, brain: 18, heart: 10, text: 'text-xl', subtext: 'text-[9px]' },
    md: { shield: 48, brain: 28, heart: 14, text: 'text-2xl', subtext: 'text-xs' },
    lg: { shield: 80, brain: 46, heart: 24, text: 'text-4xl', subtext: 'text-sm' },
    xl: { shield: 130, brain: 76, heart: 32, text: 'text-4xl md:text-5xl', subtext: 'text-sm md:text-base' }
  };

  const d = dimensions[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo Mark - Escudo com Cérebro e Coração Layered */}
      <div className="relative flex items-center justify-center mb-1" style={{ width: d.shield, height: d.shield }}>
        <Shield 
          size={d.shield} 
          className="text-brand-primary absolute opacity-20" 
          strokeWidth={1.5} 
          fill="currentColor" 
        />
        <Shield 
          size={d.shield} 
          className="text-brand-primary absolute" 
          strokeWidth={2} 
        />
        <Brain 
          size={d.brain} 
          className="text-brand-dark absolute" 
          strokeWidth={1.5} 
        />
        <Heart 
          size={d.heart} 
          className="text-brand-secondary fill-brand-secondary absolute translate-y-[2px]" 
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="text-center mt-3 flex flex-col items-center">
          <span className={`font-black text-brand-dark tracking-tight leading-none ${d.text}`}>
            Conecta TEA
          </span>
          <span className={`font-medium text-brand-primary tracking-wide mt-1 ${d.subtext}`}>
            Triagem TEA IA
          </span>
        </div>
      )}
    </div>
  );
}
