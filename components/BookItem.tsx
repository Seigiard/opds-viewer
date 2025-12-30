import React from 'react';
import { FileNode } from '../types';
import { getFileIcon } from '../utils';
import { StandardListItemFrame } from './StandardListItemFrame';

interface BookItemProps {
  node: FileNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  domRef?: React.RefObject<HTMLDivElement | null>;
}

export const BookItem: React.FC<BookItemProps> = ({
  node,
  isSelected,
  onClick,
  onMouseEnter,
  domRef
}) => {
  const metaParts = [];
  if (node.metadata.size) metaParts.push(node.metadata.size);
  if (node.metadata.author) metaParts.push(node.metadata.author);

  return (
    <StandardListItemFrame isSelected={isSelected} onClick={onClick} onMouseEnter={onMouseEnter} domRef={domRef}>
      <div className={`w-6 text-center mr-2 text-lg shrink-0 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {getFileIcon(node)}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="truncate font-bold text-xs sm:text-sm leading-tight">{node.name}</div>
        {metaParts.length > 0 && (
          <div className={`text-[10px] truncate mt-0.5 font-mono ${isSelected ? 'text-black/60 font-medium' : 'text-zinc-600'}`}>
            {metaParts.join(' • ')}
          </div>
        )}
      </div>
    </StandardListItemFrame>
  );
};
