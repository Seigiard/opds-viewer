export enum FileType {
  FOLDER = 'DIR',
  FILE = 'FILE'
}

export interface FileMetadata {
  size: string;
  date: string;
  author?: string;
  pages?: number;
  tags?: string[];
  description?: string;
  coverUrl?: string;
}

export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  metadata: FileMetadata;
  children?: string[]; // IDs of children
}

export interface FileSystemState {
  nodes: Record<string, FileNode>;
  rootId: string;
}
