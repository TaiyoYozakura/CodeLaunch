import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} border-4 rounded-full animate-spin`} style={{ borderColor: 'var(--muted)', borderTopColor: 'var(--primary)' }}></div>
      {message && <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>{message}</p>}
    </div>
  );
};

export const LoadingOverlay = ({ isLoading, message = 'Processing...' }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};

export const ButtonLoading = ({ isLoading, children, ...props }) => {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary-foreground)', borderTopColor: 'transparent' }}></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
