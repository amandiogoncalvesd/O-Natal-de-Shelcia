import React, { useEffect, useState, useRef } from 'react';
import { ThemeMode } from '../types';

export const SnowEffect: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate static number of flakes to avoid re-renders
    const newFlakes = Array.from({ length: 50 }, (_, i) => i);
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {flakes.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const size = 3 + Math.random() * 4;
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size}px`,
              animation: `fall ${animationDuration}s linear ${delay}s infinite`,
              boxShadow: '0 0 5px rgba(255,255,255,0.8)'
            }}
          />
        );
      })}
    </div>
  );
};

interface BackgroundProps {
  theme: ThemeMode;
  children: React.ReactNode;
}

export const MagicalBackground: React.FC<BackgroundProps> = ({ theme, children }) => {
  const isNight = theme === ThemeMode.NIGHT;

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ease-in-out relative
        ${isNight 
          ? 'bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#2a2a4e] text-indigo-50' 
          : 'bg-gradient-to-br from-[#E0F7FA] via-[#F3E5F5] to-[#FFF3E0] text-slate-800'
        }`}
    >
      {/* Stars for night mode */}
      {isNight && (
        <div className="absolute inset-0 z-0 opacity-60">
           {Array.from({ length: 40 }).map((_, i) => (
             <div
               key={i}
               className="absolute bg-white rounded-full animate-twinkle"
               style={{
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 3}px`,
                 height: `${Math.random() * 3}px`,
                 animationDelay: `${Math.random() * 3}s`
               }}
             />
           ))}
        </div>
      )}
      
      {/* Auroras / Soft Gradients */}
      <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000 ${isNight ? 'opacity-30' : 'opacity-60'}`}>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-300 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s'}} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-200 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
