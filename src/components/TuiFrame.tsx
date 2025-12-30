import React from 'react';

interface TuiFrameProps {
  children: React.ReactNode;
  title?: string;
  isActive?: boolean;
  className?: string;
  borderColor?: 'cyan' | 'magenta' | 'dim';
}

export const TuiFrame: React.FC<TuiFrameProps> = ({ 
  children, 
  title, 
  isActive = false, 
  className = '',
  borderColor = 'dim'
}) => {
  
  const getBorderColor = () => {
    // Active state gets a neon glow
    if (isActive) return 'border-[#00f0ff] shadow-[0_0_15px_-4px_rgba(0,240,255,0.3)]';
    // Inactive states get colored borders
    if (borderColor === 'magenta') return 'border-[#ff00ff]';
    if (borderColor === 'cyan') return 'border-[#00f0ff]';
    // Default dim state
    return 'border-zinc-800';
  };

  const getTitleColor = () => {
    if (isActive) return 'text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]';
    if (borderColor === 'magenta') return 'text-[#ff00ff]';
    if (borderColor === 'cyan') return 'text-[#00f0ff]';
    return 'text-zinc-600';
  };

  return (
    <fieldset className={`border ${getBorderColor()} flex flex-col ${className} transition-all duration-300 min-w-0 relative group`}>
      {title && (
        <legend className={`ml-4 px-2 select-none ${getTitleColor()} text-sm font-bold uppercase tracking-widest`}>
          {isActive ? `[ ${title} ]` : `${title}`}
        </legend>
      )}
      <div className="flex-1 overflow-hidden p-1 w-full h-full relative">
        {children}
      </div>
    </fieldset>
  );
};