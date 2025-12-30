import { FileType, FileSystemState } from './types';

const currentYear = new Date().getFullYear();

// Helper to generate covers
const getCover = (id: number) => `https://picsum.photos/300/400?random=${id}`;

export const initialFileSystem: FileSystemState = {
  rootId: 'root',
  nodes: {
    'root': {
      id: 'root',
      parentId: null,
      name: '/',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-01-01' },
      children: ['lib', 'docs', 'sys', 'trash']
    },
    'lib': {
      id: 'lib',
      parentId: 'root',
      name: 'library',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-02-14' },
      children: ['scifi', 'fantasy', 'tech', 'history']
    },
    'docs': {
      id: 'docs',
      parentId: 'root',
      name: 'documents',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-03-01' },
      children: ['resume', 'notes']
    },
    'sys': {
      id: 'sys',
      parentId: 'root',
      name: 'system',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '1999-12-31' },
      children: ['config', 'logs']
    },
    'trash': {
      id: 'trash',
      parentId: 'root',
      name: 'trash_bin',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-10-10' },
      children: []
    },
    // Library Categories
    'scifi': {
      id: 'scifi',
      parentId: 'lib',
      name: 'sci_fi',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-01-15' },
      children: ['neuromancer', 'dune', 'foundation', 'snowcrash']
    },
    'fantasy': {
      id: 'fantasy',
      parentId: 'lib',
      name: 'fantasy',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-01-20' },
      children: ['lotr', 'hobbit']
    },
    'tech': {
      id: 'tech',
      parentId: 'lib',
      name: 'technology',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-02-01' },
      children: ['clean_code', 'rust_book']
    },
    'history': {
      id: 'history',
      parentId: 'lib',
      name: 'history',
      type: FileType.FOLDER,
      metadata: { size: '-', date: '2024-02-10' },
      children: []
    },
    // Books - SciFi
    'neuromancer': {
      id: 'neuromancer',
      parentId: 'scifi',
      name: 'neuromancer.epub',
      type: FileType.FILE,
      metadata: { 
        size: '1.2MB', 
        date: '1984-07-01', 
        author: 'William Gibson', 
        pages: 271, 
        tags: ['cyberpunk', 'ai', 'matrix'],
        description: 'The sky above the port was the color of television, tuned to a dead channel.',
        coverUrl: getCover(1)
      }
    },
    'dune': {
      id: 'dune',
      parentId: 'scifi',
      name: 'dune.pdf',
      type: FileType.FILE,
      metadata: { 
        size: '4.5MB', 
        date: '1965-08-01', 
        author: 'Frank Herbert', 
        pages: 412,
        tags: ['space-opera', 'politics', 'ecology'],
        description: 'A beginning is the time for taking the most delicate care that the balances are correct.',
        coverUrl: getCover(2)
      }
    },
    'foundation': {
      id: 'foundation',
      parentId: 'scifi',
      name: 'foundation.epub',
      type: FileType.FILE,
      metadata: { 
        size: '2.1MB', 
        date: '1951-05-01', 
        author: 'Isaac Asimov', 
        pages: 255,
        tags: ['empire', 'psychohistory'],
        description: 'The Galaxy consists of a quadrillion people, but only one man matters.',
        coverUrl: getCover(3)
      }
    },
    'snowcrash': {
      id: 'snowcrash',
      parentId: 'scifi',
      name: 'snow_crash.pdf',
      type: FileType.FILE,
      metadata: { 
        size: '3.8MB', 
        date: '1992-06-01', 
        author: 'Neal Stephenson', 
        pages: 480,
        tags: ['metaverse', 'cyberpunk', 'sumer'],
        description: 'The Deliverator belongs to an elite order, a hallowed subcategory.',
        coverUrl: getCover(4)
      }
    },
    // Books - Tech
    'clean_code': {
      id: 'clean_code',
      parentId: 'tech',
      name: 'clean_code.pdf',
      type: FileType.FILE,
      metadata: { 
        size: '5.2MB', 
        date: '2008-08-01', 
        author: 'Robert C. Martin', 
        pages: 464,
        tags: ['programming', 'best-practices'],
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        coverUrl: getCover(5)
      }
    },
    'rust_book': {
      id: 'rust_book',
      parentId: 'tech',
      name: 'the_rust_lang.epub',
      type: FileType.FILE,
      metadata: { 
        size: '8.9MB', 
        date: '2021-01-01', 
        author: 'Steve Klabnik', 
        pages: 550,
        tags: ['rust', 'systems', 'memory-safety'],
        description: 'Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.',
        coverUrl: getCover(6)
      }
    },
    // Books - Fantasy
    'lotr': {
      id: 'lotr',
      parentId: 'fantasy',
      name: 'fellowship.epub',
      type: FileType.FILE,
      metadata: { 
        size: '3.1MB', 
        date: '1954-07-29', 
        author: 'J.R.R. Tolkien', 
        pages: 423,
        tags: ['fantasy', 'adventure'],
        description: 'One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.',
        coverUrl: getCover(7)
      }
    },
    'hobbit': {
      id: 'hobbit',
      parentId: 'fantasy',
      name: 'the_hobbit.pdf',
      type: FileType.FILE,
      metadata: { 
        size: '2.5MB', 
        date: '1937-09-21', 
        author: 'J.R.R. Tolkien', 
        pages: 310,
        tags: ['fantasy', 'dragons'],
        description: 'In a hole in the ground there lived a hobbit.',
        coverUrl: getCover(8)
      }
    },
    // Other Docs
    'resume': {
      id: 'resume',
      parentId: 'docs',
      name: 'cv_v4_final.pdf',
      type: FileType.FILE,
      metadata: { size: '128KB', date: `2024-10-01` }
    },
    'notes': {
      id: 'notes',
      parentId: 'docs',
      name: 'project_ideas.txt',
      type: FileType.FILE,
      metadata: { size: '12KB', date: `2024-10-05` }
    },
    'config': {
      id: 'config',
      parentId: 'sys',
      name: 'sys_config.yaml',
      type: FileType.FILE,
      metadata: { size: '4KB', date: '2023-11-11' }
    },
    'logs': {
      id: 'logs',
      parentId: 'sys',
      name: 'error.log',
      type: FileType.FILE,
      metadata: { size: '45MB', date: '2024-12-01' }
    }
  }
};
