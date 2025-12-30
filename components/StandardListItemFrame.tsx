import React from 'react';

interface StandardListItemFrameProps {
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  domRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export const StandardListItemFrame: React.FC<StandardListItemFrameProps> = ({
  isSelected,
  onClick,
  onMouseEnter,
  domRef,
  children
}) => (
  <div 
    ref={domRef}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`
      group flex items-center px-2 py-2 cursor-pointer select-none transition-all border-b border-transparent
      ${isSelected 
        ? 'bg-[#00f0ff] text-black border-b-black/10' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-b-zinc-900/50'}
    `}
  >
    {children}
  </div>
);
