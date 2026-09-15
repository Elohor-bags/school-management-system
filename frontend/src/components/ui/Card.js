import React from 'react';

const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          {title && <h3 className="text-lg font-bold text-academic-navy">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
