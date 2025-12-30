import React from 'react';
import { FileNode } from '../types';
import { getFileIcon } from '../utils';

interface FolderCompactItemProps {
  node: FileNode;
  isCurrent: boolean;
  onClick: () => void;
}

export const FolderCompactItem: React.FC<FolderCompactItemProps> = ({ 
  node, 
  isCurrent, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className={`
      px-2 py-1 text-xs sm:text-sm truncate cursor-pointer transition-colors select-none flex items-center
      ${isCurrent ? 'bg-zinc-800 text-[#00f0ff] font-bold' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}
    `}
  >
     <span className="mr-2 opacity-50 w-4 text-center shrink-0">{getFileIcon(node)}</span>
     <span className="truncate">{node.name}</span>
  </div>
);
