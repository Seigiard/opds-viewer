import React from 'react';
import { FileNode } from '../types';
import { getFileIcon } from '../utils';
import { StandardListItemFrame } from './StandardListItemFrame';

interface FolderItemProps {
  node: FileNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  domRef?: React.RefObject<HTMLDivElement | null>;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  node,
  isSelected,
  onClick,
  onMouseEnter,
  domRef
}) => (
  <StandardListItemFrame isSelected={isSelected} onClick={onClick} onMouseEnter={onMouseEnter} domRef={domRef}>
    <div className={`w-6 text-center mr-2 text-lg shrink-0 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
      {getFileIcon(node)}
    </div>
    <div className="flex-1 min-w-0 font-bold text-xs sm:text-sm leading-tight truncate">
      {node.name}
    </div>
  </StandardListItemFrame>
);
