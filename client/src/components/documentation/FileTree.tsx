import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { File } from "@/types";
import { ChevronDown, ChevronRight, Folder, FileText, FilePlus, FolderPlus, Trash, Edit } from "lucide-react";

type FileTreeProps = {
  documents: File[];
};

const FileTree = ({ documents }: FileTreeProps) => {
  const { 
    activeDocumentId,
    setActiveDocumentId, 
    createDocument,
    setDocuments,
    deleteDocument
  } = useWorkspace();
  
  // Local state
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "project": true,
    "solar-system": true
  });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [renameItem, setRenameItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState<{id: string, x: number, y: number} | null>(null);
  
  // Refs
  const treeRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const lastCreatedRef = useRef<string | null>(null);
  
  // Focus rename input when it appears
  useEffect(() => {
    if (renameItem && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameItem]);
  
  // Handle clicks outside the tree
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(e.target as Node)) {
        setSelectedFolder(null);
        setContextMenu(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Watch for the appearance of newly created items
  useEffect(() => {
    if (lastCreatedRef.current) {
      const newItem = findFileById(documents, lastCreatedRef.current);
      if (newItem) {
        setRenameItem(lastCreatedRef.current);
        setRenameValue(newItem.name);
        lastCreatedRef.current = null;
      }
    }
  }, [documents]);
  
  // File tree interaction handlers
  const handleFileClick = (fileId: string) => {
    setActiveDocumentId(fileId);
    setSelectedFolder(null);
  };
  
  const handleFolderClick = (folderId: string, e: React.MouseEvent) => {
    // Toggle folder expansion when clicking on the folder
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
    
    setSelectedFolder(folderId);
    e.stopPropagation();
  };
  
  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
    setSelectedFolder(folderId);
  };
  
  const handleDoubleClick = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const file = findFileById(documents, fileId);
    if (file) {
      setRenameItem(fileId);
      setRenameValue(file.name);
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      id: fileId,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // File/folder operations
  const handleNewFile = (parentId?: string) => {
    const id = Date.now().toString();
    lastCreatedRef.current = id;
    createDocument(`New Document.md#${id}`, parentId || (selectedFolder || undefined));
    setContextMenu(null);
  };
  
  const handleNewFolder = (parentId?: string) => {
    const id = Date.now().toString();
    lastCreatedRef.current = id;
    createDocument(`New Folder#${id}`, parentId || (selectedFolder || undefined));
    setContextMenu(null);
  };
  
  const handleRename = (e: React.KeyboardEvent | React.FocusEvent) => {
    // Skip if not Enter key for keyboard events
    if ('key' in e && e.key !== 'Enter') {
      return;
    }
    
    if (renameItem && renameValue.trim()) {
      // Update the name in the document tree
      const updateFileName = (files: File[]): File[] => {
        return files.map(file => {
          if (file.id === renameItem) {
            return { ...file, name: renameValue };
          }
          if (file.children) {
            return { ...file, children: updateFileName(file.children) };
          }
          return file;
        });
      };
      
      setDocuments(updateFileName(documents));
      setRenameItem(null);
    } else {
      setRenameItem(null);
    }
  };
  
  const handleRenameCancel = () => {
    setRenameItem(null);
  };
  
  const handleDelete = (fileId: string) => {
    deleteDocument(fileId);
    setContextMenu(null);
  };
  
  // Helper functions
  const findFileById = (files: File[], id: string): File | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  // Extract ID from name with appended ID for new items
  const extractIdFromName = (name: string) => {
    const match = name.match(/#([^#]+)$/);
    return match ? match[1] : null;
  };
  
  // Cleans name by removing ID suffix used for new items
  const cleanName = (name: string) => {
    return name.replace(/#[^#]+$/, '');
  };
  
  // Render functions
  const renderFile = (file: File, depth: number = 0) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders[file.id];
    const isSelected = file.id === (isFolder ? selectedFolder : activeDocumentId);
    const isEditing = file.id === renameItem;
    const displayName = cleanName(file.name);
    
    return (
      <div key={file.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer
            ${isSelected && !isFolder ? 'bg-[hsl(var(--dark-7))]' : ''}
            ${isSelected && isFolder ? 'bg-gray-700' : ''}
            hover:bg-[hsl(var(--dark-7))]
          `}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={(e) => isFolder ? handleFolderClick(file.id, e) : handleFileClick(file.id)}
          onDoubleClick={(e) => handleDoubleClick(file.id, e)}
          onContextMenu={(e) => handleContextMenu(e, file.id)}
        >
          {isFolder ? (
            <>
              <span 
                className="p-1 cursor-pointer" 
                onClick={(e) => toggleExpand(file.id, e)}
              >
                {isExpanded ? (
                  <ChevronDown className="text-[hsl(var(--dark-2))]" size={16} />
                ) : (
                  <ChevronRight className="text-[hsl(var(--dark-2))]" size={16} />
                )}
              </span>
              <Folder className={`mr-2 ${isSelected ? 'text-white' : 'text-[hsl(var(--dark-2))]'}`} size={16} />
            </>
          ) : (
            <>
              <span className="w-[24px]"></span>
              <FileText className="text-[hsl(var(--dark-2))] mr-2" size={16} />
            </>
          )}
          
          {isEditing ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(e);
                if (e.key === 'Escape') handleRenameCancel();
              }}
              onBlur={handleRename}
              className="bg-[hsl(var(--dark-6))] text-white text-sm p-1 flex-1 outline-none border border-[hsl(var(--primary))] rounded"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`text-sm ${
              isSelected 
                ? isFolder 
                  ? 'text-white' 
                  : 'text-[hsl(var(--primary))]' 
                : 'text-[hsl(var(--dark-1))]'
            }`}>
              {displayName}
            </span>
          )}
        </div>
        
        {isFolder && isExpanded && file.children && file.children.length > 0 && (
          <div>
            {file.children.map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-64 bg-[hsl(var(--dark-8))] flex flex-col border-r border-gray-700/50" ref={treeRef}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <h2 className="font-semibold text-white">Documents</h2>
        <div className="ml-auto flex space-x-1">
          <button 
            className="text-[hsl(var(--dark-2))] hover:text-white p-1 rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleNewFolder()}
            title="New folder"
          >
            <FolderPlus size={16} />
          </button>
          <button 
            className="text-[hsl(var(--dark-2))] hover:text-white p-1 rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleNewFile()}
            title="New file"
          >
            <FilePlus size={16} />
          </button>
        </div>
      </div>
      
      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {documents.map(doc => renderFile(doc))}
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-[hsl(var(--dark-8))] border border-[hsl(var(--dark-6))] shadow-lg rounded z-50 py-1"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px`,
            minWidth: '160px'
          }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => {
              const file = findFileById(documents, contextMenu.id);
              if (file) {
                setRenameItem(contextMenu.id);
                setRenameValue(cleanName(file.name));
                setContextMenu(null);
              }
            }}
          >
            <Edit size={14} className="mr-2" /> Rename
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => handleDelete(contextMenu.id)}
          >
            <Trash size={14} className="mr-2" /> Delete
          </button>
          
          {findFileById(documents, contextMenu.id)?.type === 'folder' && (
            <>
              <div className="border-t border-[hsl(var(--dark-6))] my-1"></div>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleNewFile(contextMenu.id)}
              >
                <FilePlus size={14} className="mr-2" /> New File
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleNewFolder(contextMenu.id)}
              >
                <FolderPlus size={14} className="mr-2" /> New Folder
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTree;
