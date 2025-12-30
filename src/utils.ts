import { FileNode, FileType } from './types';

export const ICONS = {
  DIR: '📂',
  DIR_UP: '⤴',
  FILE: '📄',
  PDF: '📕',
  EPUB: '📗',
  TXT: '📝',
  UNK: '📃'
};

export const getFileIcon = (node: FileNode) => {
  if (node.name === '..') return ICONS.DIR_UP;
  if (node.type === FileType.FOLDER) return ICONS.DIR;
  if (node.name.endsWith('.pdf')) return ICONS.PDF;
  if (node.name.endsWith('.epub')) return ICONS.EPUB;
  if (node.name.endsWith('.txt')) return ICONS.TXT;
  return ICONS.FILE;
};
