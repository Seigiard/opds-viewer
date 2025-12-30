import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initialFileSystem } from './data';
import { FileNode, FileType } from './types';
import { TuiFrame } from './components/TuiFrame';
import { FolderCompactItem } from './components/FolderCompactItem';
import { FolderItem } from './components/FolderItem';
import { BookItem } from './components/BookItem';

const PARENT_DIR_ID = '..';

// --- PANE COMPONENTS ---

// 1. LEFT PANE: Parent Context
const ParentPane = ({ 
  currentFolderId, 
  nodes, 
  parentFolderId,
  onSiblingClick
}: { 
  currentFolderId: string; 
  nodes: Record<string, FileNode>; 
  parentFolderId: string | null; 
  onSiblingClick: (id: string) => void;
}) => {
  if (!parentFolderId) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
        // ROOT
      </div>
    );
  }

  const parentNode = nodes[parentFolderId];
  const siblings = parentNode.children?.map(id => nodes[id]) || [];

  return (
    <div className="flex flex-col h-full py-2">
      {siblings.map((node) => (
        <FolderCompactItem
          key={node.id}
          node={node}
          isCurrent={node.id === currentFolderId}
          onClick={() => onSiblingClick(node.id)}
        />
      ))}
    </div>
  );
};

// 2. CENTER PANE: Current Directory
const CurrentPane = ({ 
  items, 
  selectedId, 
  itemRef,
  onSelect,
  onNavigate
}: { 
  items: FileNode[]; 
  selectedId: string | null;
  itemRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string) => void;
  onNavigate: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col h-full py-1 overflow-y-auto custom-scrollbar relative">
      {items.length === 0 && (
         <div className="text-zinc-600 p-4 text-center italic text-sm">
           &lt; EMPTY_DIR &gt;
         </div>
      )}
      {items.map((node) => {
        const isSelected = node.id === selectedId;
        const ItemComponent = node.type === FileType.FOLDER ? FolderItem : BookItem;
        
        return (
          <ItemComponent
            key={node.id}
            node={node}
            isSelected={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              if (node.type === FileType.FOLDER) {
                onNavigate(node.id);
              }
            }}
            onMouseEnter={() => onSelect(node.id)}
            domRef={isSelected ? itemRef : null}
          />
        );
      })}
    </div>
  );
};

// 3. RIGHT PANE: Preview
const PreviewPane = ({ 
  selectedNode, 
  nodes,
  onNavigateFromPreview
}: { 
  selectedNode: FileNode | null;
  nodes: Record<string, FileNode>;
  onNavigateFromPreview: (childId: string) => void;
}) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-700">
        <div className="text-4xl opacity-20 mb-4 animate-pulse">⚛</div>
        <div className="tracking-widest text-xs">AWAITING_INPUT</div>
      </div>
    );
  }

  // --- FOLDER PREVIEW (INTERACTIVE LIST) ---
  if (selectedNode.type === FileType.FOLDER) {
    const childrenNodes = selectedNode.children?.map(id => nodes[id]) || [];

    return (
      <div className="h-full p-2 sm:p-4 flex flex-col text-zinc-400">
        <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950/30">
           <div className="flex-1 overflow-y-auto p-1 custom-scrollbar space-y-1">
             {childrenNodes.length === 0 ? (
                <div className="text-zinc-600 italic text-xs p-4 text-center border border-zinc-800 border-dashed m-2">
                  [ EMPTY DIRECTORY ]
                </div>
             ) : (
               childrenNodes.map(child => {
                  const ItemComponent = child.type === FileType.FOLDER ? FolderItem : BookItem;
                  return (
                    <ItemComponent
                      key={child.id}
                      node={child}
                      isSelected={false} // Preview list items are never "selected" in the primary navigation sense
                      onClick={() => onNavigateFromPreview(child.id)}
                    />
                  );
               })
             )}
           </div>
        </div>
      </div>
    );
  }

  // --- FILE PREVIEW (BOOK COVER & DATA) ---
  return (
    <div className="h-full flex flex-col overflow-y-auto p-2 sm:p-4 custom-scrollbar relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-9xl text-zinc-800 pointer-events-none select-none overflow-hidden z-0">
        {selectedNode.name.slice(0,1).toUpperCase()}
      </div>

      <div className="relative z-10">
        {/* Cover Image Area */}
        <div className="w-full max-w-[140px] sm:max-w-[240px] mx-auto aspect-[2/3] mb-4 sm:mb-6 bg-zinc-900 border-2 border-zinc-800 relative flex items-center justify-center overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] group">
           {selectedNode.metadata.coverUrl ? (
             <>
              <img 
                src={selectedNode.metadata.coverUrl} 
                alt="cover" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
             </>
           ) : (
             <div className="text-zinc-700 flex flex-col items-center">
               <span className="text-5xl mb-2">?</span>
               <span className="text-[10px] tracking-[0.2em]">NO_DATA</span>
             </div>
           )}
           
           {/* Decorative corner markers */}
           <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#ff00ff]/50"></div>
           <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#ff00ff]/50"></div>
        </div>

        {/* Info Block */}
        <div className="space-y-4">
          <div>
            <div className="flex gap-2 mb-1 flex-wrap">
               {selectedNode.metadata.tags?.map(tag => (
                 <span key={tag} className="text-[9px] text-[#00f0ff] border border-[#00f0ff]/30 px-1 py-px uppercase tracking-wider">
                   {tag}
                 </span>
               ))}
            </div>
            {/* Title moved to border legend */}
            {selectedNode.metadata.author && (
              <div className="text-[#ff00ff] text-xs sm:text-sm font-medium tracking-wide mt-1">
                 // {selectedNode.metadata.author}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
             <div className="bg-[#09090b] p-2">
                <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Size</div>
                <div className="text-zinc-300 font-mono text-xs">{selectedNode.metadata.size}</div>
             </div>
             <div className="bg-[#09090b] p-2">
                <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Pages</div>
                <div className="text-zinc-300 font-mono text-xs">{selectedNode.metadata.pages || 'N/A'}</div>
             </div>
             <div className="bg-[#09090b] p-2">
                <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Released</div>
                <div className="text-zinc-300 font-mono text-xs">{selectedNode.metadata.date}</div>
             </div>
             <div className="bg-[#09090b] p-2">
                <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Format</div>
                <div className="text-zinc-300 font-mono text-xs uppercase break-all">{selectedNode.name.split('.').pop()}</div>
             </div>
          </div>

          {selectedNode.metadata.description && (
            <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-700 pl-3 py-1">
              {selectedNode.metadata.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [fileSystem] = useState(initialFileSystem);
  const [path, setPath] = useState<string[]>(['root']);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const lastInteraction = useRef<'mouse' | 'keyboard'>('mouse');

  // Header Form State
  const [feedUrl, setFeedUrl] = useState('');
  const [feedAuth, setFeedAuth] = useState({ user: '', pass: '' });
  const [showAuth, setShowAuth] = useState(false);

  // Track mouse interaction to prevent hover fighting with keyboard nav
  useEffect(() => {
    const handleMouseMove = () => {
      lastInteraction.current = 'mouse';
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Derived State
  const currentFolderId = path[path.length - 1];
  const parentFolderId = path.length > 1 ? path[path.length - 2] : null;
  const currentFolder = fileSystem.nodes[currentFolderId];

  // Construct display items including virtual ".." node
  const displayItems = React.useMemo(() => {
    const rawItems = (currentFolder.children || []).map(id => fileSystem.nodes[id]);
    if (parentFolderId) {
      const parentNode = fileSystem.nodes[parentFolderId];
      const upNode: FileNode = {
        id: PARENT_DIR_ID,
        parentId: parentNode.parentId,
        name: '..',
        type: FileType.FOLDER,
        metadata: parentNode.metadata,
        children: parentNode.children // ".." previews siblings (parent's children)
      };
      return [upNode, ...rawItems];
    }
    return rawItems;
  }, [currentFolder, parentFolderId, fileSystem.nodes]);

  const displayChildrenIds = displayItems.map(n => n.id);

  // Initialize selection
  useEffect(() => {
    if (displayChildrenIds.length > 0 && !displayChildrenIds.includes(selectedId || '')) {
      setSelectedId(displayChildrenIds[0]);
    } else if (displayChildrenIds.length === 0) {
      setSelectedId(null);
    }
  }, [currentFolderId, displayChildrenIds, selectedId]);

  // Scroll logic
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedId]);


  // Actions
  const handleNavigateUp = useCallback(() => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      setPath(newPath);
      setSelectedId(currentFolderId); // Select the folder we just exited
    }
  }, [path, currentFolderId]);

  const handleNavigate = useCallback((id: string) => {
    if (id === PARENT_DIR_ID) {
      handleNavigateUp();
      return;
    }

    const node = fileSystem.nodes[id];
    if (node.type === FileType.FOLDER) {
       setPath(prev => [...prev, id]);
    }
  }, [fileSystem.nodes, handleNavigateUp]);


  // Navigate from Preview (Miller Column Style)
  const handleNavigateFromPreview = useCallback((childId: string) => {
    if (selectedId === PARENT_DIR_ID) {
      // If we are on "..", we are viewing the parent's children.
      // Clicking a folder here means we want to switch from current folder to its sibling.
      const childNode = fileSystem.nodes[childId];
      if (childNode?.type === FileType.FOLDER) {
        setPath(prev => {
          const newPath = [...prev];
          newPath.pop(); // Remove current
          newPath.push(childId); // Add sibling
          return newPath;
        });
        setSelectedId(null); // Let effect handle selection
      }
      return;
    }

    if (selectedId) {
      // Enter the currently selected folder
      setPath(prev => [...prev, selectedId]);
      // Select the child that was clicked
      setSelectedId(childId);
    }
  }, [selectedId, fileSystem.nodes]);

  // Keyboard Navigation
  const handleNavKey = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ENTER') => {
    lastInteraction.current = 'keyboard';
    const currentIndex = displayChildrenIds.indexOf(selectedId || '');
    
    switch (direction) {
      case 'UP':
        if (currentIndex > 0) setSelectedId(displayChildrenIds[currentIndex - 1]);
        break;
      case 'DOWN':
        if (currentIndex < displayChildrenIds.length - 1) setSelectedId(displayChildrenIds[currentIndex + 1]);
        break;
      case 'LEFT':
        // Left arrow goes up to parent
        handleNavigateUp();
        break;
      case 'RIGHT':
      case 'ENTER':
        if (selectedId) handleNavigate(selectedId);
        break;
    }
  }, [displayChildrenIds, selectedId, handleNavigate, handleNavigateUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key === 'k') handleNavKey('UP');
      if (e.key === 'ArrowDown' || e.key === 'j') handleNavKey('DOWN');
      if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'Backspace') handleNavKey('LEFT');
      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'Enter') handleNavKey('ENTER');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavKey]);


  // Node Data
  // Handle resolving selectedNode, accounting for the virtual ".." node
  const selectedNode = React.useMemo(() => {
    if (!selectedId) return null;
    if (selectedId === PARENT_DIR_ID) return null;
    return fileSystem.nodes[selectedId];
  }, [selectedId, fileSystem.nodes]);

  const pathString = path.map(id => fileSystem.nodes[id].name).join('/').replace('//', '/');

  // Preview Title Calculation
  const previewTitle = selectedNode 
    ? (selectedNode.type === FileType.FOLDER ? `${selectedNode.name}/` : selectedNode.name)
    : "PREVIEW";

  return (
    <div className="w-screen h-screen bg-[#09090b] text-[#e0e0e0] flex flex-col p-2 md:p-4 gap-2 md:gap-4 overflow-hidden relative selection:bg-[#ff00ff] selection:text-white">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#52525b] pb-2 shrink-0 z-20 gap-4 bg-[#09090b]">
         <div className="flex flex-col shrink-0">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#00f0ff] uppercase drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              NEO-LIB <span className="text-[#ff00ff]">v1.0</span>
            </h1>
            <div className="text-[10px] md:text-xs text-zinc-500 mt-1 font-bold">
               SYS.OPDF_VIEWER // CONNECTED
            </div>
         </div>
         
         <form 
            className="flex flex-col items-end w-full md:w-auto gap-2"
            onSubmit={(e) => { e.preventDefault(); console.log('Connecting to', feedUrl); }}
         >
            <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-80 group">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px] font-bold group-focus-within:text-[#00f0ff] pointer-events-none transition-colors">FEED://</span>
                    <input 
                        type="text" 
                        className="w-full bg-[#09090b] border border-zinc-600 text-zinc-300 text-xs font-mono py-1 pl-14 pr-2 focus:border-[#00f0ff] focus:outline-none focus:bg-zinc-900/50 transition-all placeholder:text-zinc-600"
                        placeholder="opds.example.com/catalog.xml"
                        value={feedUrl}
                        onChange={(e) => setFeedUrl(e.target.value)}
                    />
                </div>
                
                <button 
                    type="button"
                    onClick={() => setShowAuth(!showAuth)}
                    className={`px-2 py-1 text-xs font-mono border transition-all ${showAuth ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/5' : 'border-zinc-600 text-zinc-400 hover:text-zinc-300 hover:border-zinc-500'}`}
                    title="Toggle Authentication"
                >
                    {showAuth ? '[-]' : '[+]'}
                </button>
                
                <button 
                    type="submit"
                    className="px-3 py-1 text-xs font-bold font-mono bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/20 active:translate-y-px transition-all shadow-[0_0_10px_-5px_#00f0ff]"
                >
                    CONNECT
                </button>
            </div>

            {showAuth && (
                <div className="flex gap-2 w-full md:w-auto animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            className="w-full bg-[#09090b] border border-zinc-600 text-zinc-300 text-xs font-mono py-1 px-2 focus:border-[#ff00ff] focus:outline-none focus:bg-zinc-900/50 transition-colors placeholder:text-zinc-600"
                            placeholder="USERNAME"
                            value={feedAuth.user}
                            onChange={(e) => setFeedAuth(prev => ({ ...prev, user: e.target.value }))}
                        />
                    </div>
                    <div className="relative flex-1">
                        <input 
                            type="password" 
                            className="w-full bg-[#09090b] border border-zinc-600 text-zinc-300 text-xs font-mono py-1 px-2 focus:border-[#ff00ff] focus:outline-none focus:bg-zinc-900/50 transition-colors placeholder:text-zinc-600"
                            placeholder="PASSWORD"
                            value={feedAuth.pass}
                            onChange={(e) => setFeedAuth(prev => ({ ...prev, pass: e.target.value }))}
                        />
                    </div>
                </div>
            )}
         </form>
      </header>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_2fr_3fr] gap-2 md:gap-4 min-h-0 z-20">
         
         {/* 1. PARENT PANE */}
         {/* Hidden on very small screens, visible on small/tablet */}
         <TuiFrame 
            title="PARENT" 
            className="hidden sm:flex opacity-60 hover:opacity-100 transition-opacity h-full bg-zinc-950/50"
         >
            <ParentPane 
               nodes={fileSystem.nodes}
               currentFolderId={currentFolderId}
               parentFolderId={parentFolderId}
               onSiblingClick={(_id) => {
                 // Just selecting sibling not fully implemented in logic, defaults to simple nav
                 handleNavigateUp(); 
               }}
            />
         </TuiFrame>

         {/* 2. CENTER PANE */}
         {/* Resizes on mobile to allow preview pane to show */}
         <TuiFrame 
            title={pathString}
            isActive={true}
            className="shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 h-full bg-[#0a0a0a]"
         >
             {/* Back Button for Mobile */}
             {path.length > 1 && (
               <div 
                  onClick={handleNavigateUp}
                  className="sm:hidden flex items-center p-2 text-zinc-500 border-b border-zinc-800 hover:text-white cursor-pointer"
               >
                 <span className="mr-2">←</span>
               </div>
             )}
             <CurrentPane 
               items={displayItems}
               selectedId={selectedId}
               itemRef={selectedItemRef}
               onSelect={(id) => {
                 if (lastInteraction.current === 'mouse') {
                   setSelectedId(id);
                 }
               }}
               onNavigate={handleNavigate}
             />
         </TuiFrame>

         {/* 3. RIGHT PANE (PREVIEW) */}
         {/* Always visible, takes remaining space */}
         <TuiFrame
            title={previewTitle}
            className="border-[--color-secondary] min-w-0 h-full bg-zinc-950/80"
            titleClassName="text-[--color-secondary]"
         >
            <PreviewPane 
               selectedNode={selectedNode} 
               nodes={fileSystem.nodes} 
               onNavigateFromPreview={handleNavigateFromPreview}
            />
         </TuiFrame>

      </main>

      {/* FOOTER */}
      <footer className="shrink-0 text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between items-center z-20">
         <div className="flex gap-4">
            <span className="hidden md:inline"><span className="text-[#00f0ff] font-bold">↑↓</span> NAV</span>
            <span className="hidden md:inline"><span className="text-[#00f0ff] font-bold">↵</span> OPEN</span>
            <span className="md:hidden"><span className="text-[#00f0ff] font-bold">TAP</span> SELECT/OPEN</span>
         </div>
      </footer>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-[#09090b] to-[#09090b]"></div>
    </div>
  );
}