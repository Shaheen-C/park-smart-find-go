
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PulsingIconProps {
  Icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
}

const PulsingIcon = ({ Icon, className = "", size = 24, color }: PulsingIconProps) => {
  return (
    <div className={`relative ${className}`}>
      <Icon 
        size={size} 
        color={color}
        className="animate-pulse hover:animate-spin transition-all duration-300" 
      />
      <div className="absolute inset-0 animate-ping">
        <Icon size={size} color={color} className="opacity-30" />
      </div>
    </div>
  );
};

export default PulsingIcon;
