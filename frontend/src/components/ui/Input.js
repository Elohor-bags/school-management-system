import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-academic-navy focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
