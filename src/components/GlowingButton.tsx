
import React from 'react';
import { Button } from "@/components/ui/button";

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
}

const GlowingButton = ({ children, onClick, variant = "default", className = "", disabled, asChild }: GlowingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      asChild={asChild}
      className={`
        relative overflow-hidden transition-all duration-300 
        hover:shadow-lg hover:scale-105 
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-transparent before:via-white/20 before:to-transparent 
        before:translate-x-[-100%] hover:before:translate-x-[100%] 
        before:transition-transform before:duration-700
        ${className}
      `}
    >
      {children}
    </Button>
  );
};

export default GlowingButton;
