
import React from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  duration?: string;
}

const FloatingElement = ({ children, className = "", duration = "3s" }: FloatingElementProps) => {
  return (
    <div 
      className={`animate-bounce ${className}`}
      style={{ 
        animation: `float ${duration} ease-in-out infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default FloatingElement;
