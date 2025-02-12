// components/BackgroundLayout.tsx
import React, { ReactNode } from 'react';

interface BackgroundLayoutProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden overflow-x-hidden">
      <div className="fixed inset-0 animate-gradient bg-gradient-to-tr from-black via-zinc-900 to-black z-[1]" />
      <div 
        className="fixed inset-0 opacity-20 z-[2]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
            linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)
          `,
          backgroundSize: '40px 40px, 100% 400%',
          backgroundBlendMode: 'overlay'
        }}
      />
      <div className="fixed inset-0 z-[3] opacity-30">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-float-delayed" />
      </div>
      <div className="relative z-[4]">
        {children}
      </div>
    </div>
  );
};

export default Background;