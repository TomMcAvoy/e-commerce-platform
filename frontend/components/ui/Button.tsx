import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  asChild = false,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    outline: 'btn-outline',
    ghost: 'btn-ghost hover:bg-gray-100',
    default: 'btn-primary'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2', 
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2 w-10 h-10'
  };

  // Handle asChild prop for compatibility with external components
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim(),
      ...props
    });
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
