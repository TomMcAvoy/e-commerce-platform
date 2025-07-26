import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  header?: React.ReactNode;
}

export function Card({ children, className = '', title, header }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || header) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {header}
        </div>
      )}
      {children}
    </div>
  );
}
