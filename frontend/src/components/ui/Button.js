import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-academic-navy text-white hover:bg-opacity-90 shadow-md",
    secondary: "bg-academic-gold text-academic-navy hover:bg-opacity-90 shadow-md",
    ghost: "bg-transparent text-academic-navy hover:bg-academic-slate border border-academic-navy/20",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
