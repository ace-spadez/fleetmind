import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { TreeNode } from "@/types";
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FileCode, 
  FileJson, 
  File, 
  GitBranch, 
  FolderPlus, 
  FilePlus, 
  ChevronUp, 
  Trash2, 
  PencilLine 
} from "lucide-react";

type CodeTreeProps = {
  codeFiles: TreeNode[];
  onFileOpen?: (fileId: string) => void;
};

const CodeTree = ({ codeFiles, onFileOpen }: CodeTreeProps) => {
  const { activeCodeFileId, setActiveCodeFileId, setCodeFiles } = useWorkspace();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "components": true
  });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [renameItem, setRenameItem] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showContextMenu, setShowContextMenu] = useState<{id: string, x: number, y: number} | null>(null);
  
  const treeRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  // Handle click outside to deselect folder and hide context menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(e.target as Node)) {
        setSelectedFolder(null);
        setShowContextMenu(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Focus rename input when renaming
  useEffect(() => {
    if (renameItem && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameItem]);
  
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleFolderClick = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Select the folder when clicking on it
    setSelectedFolder(folderId);
    // Don't automatically toggle - leave that to the chevron
  };
  
  const collapseAll = () => {
    setExpandedFolders({});
  };
  
  const expandAll = () => {
    const allFolders: Record<string, boolean> = {};
    
    const traverseAndCollect = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === 'folder') {
          allFolders[node.id] = true;
          if (node.children) {
            traverseAndCollect(node.children);
          }
        }
      }
    };
    
    traverseAndCollect(codeFiles);
    setExpandedFolders(allFolders);
  };
  
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) {
      return <FileJson className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    } else if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <FileCode className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    } else {
      return <File className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    }
  };
  
  const handleCreateFile = (parentId: string | null = null) => {
    // If no parent ID provided but a folder is selected, use that as parent
    const effectiveParentId = parentId || selectedFolder;
    
    const newFile: TreeNode = {
      id: Date.now().toString(),
      name: "NewFile.js",
      type: "file",
      path: effectiveParentId ? `/${effectiveParentId}/NewFile.js` : "/NewFile.js"
    };
    
    setCodeFiles((prev: TreeNode[]) => {
      if (!effectiveParentId) {
        return [...prev, newFile];
      }
      
      const updatedFiles = [...prev];
      const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === effectiveParentId) {
            return {
              ...node,
              children: [...(node.children || []), newFile]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateChildren(node.children)
            };
          }
          return node;
        });
      };
      
      return updateChildren(updatedFiles);
    });
    
    // Ensure the parent folder is expanded
    if (effectiveParentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [effectiveParentId]: true
      }));
    }
    
    // Start rename immediately
    setTimeout(() => {
      setRenameItem(newFile.id);
      setRenameValue(newFile.name);
    }, 50);
  };
  
  const handleCreateFolder = (parentId: string | null = null) => {
    // If no parent ID provided but a folder is selected, use that as parent
    const effectiveParentId = parentId || selectedFolder;
    
    const newFolder: TreeNode = {
      id: Date.now().toString(),
      name: "NewFolder",
      type: "folder",
      path: effectiveParentId ? `/${effectiveParentId}/NewFolder` : "/NewFolder",
      children: []
    };
    
    setCodeFiles((prev: TreeNode[]) => {
      if (!effectiveParentId) {
        return [...prev, newFolder];
      }
      
      const updatedFiles = [...prev];
      const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === effectiveParentId) {
            return {
              ...node,
              children: [...(node.children || []), newFolder]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateChildren(node.children)
            };
          }
          return node;
        });
      };
      
      return updateChildren(updatedFiles);
    });
    
    // Expand the parent folder and the new folder
    if (effectiveParentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [effectiveParentId]: true
      }));
    }
    
    setTimeout(() => {
      setRenameItem(newFolder.id);
      setRenameValue(newFolder.name);
    }, 50);
  };
  
  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu({
      id: nodeId,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const startRename = (nodeId: string) => {
    const node = findNodeById(codeFiles, nodeId);
    if (node) {
      setRenameItem(nodeId);
      setRenameValue(node.name);
    }
    setShowContextMenu(null);
  };
  
  const handleRename = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    
    if (renameItem && renameValue.trim()) {
      setCodeFiles((prev: TreeNode[]) => {
        const updateNodeName = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map(node => {
            if (node.id === renameItem) {
              return { ...node, name: renameValue };
            }
            if (node.children) {
              return { ...node, children: updateNodeName(node.children) };
            }
            return node;
          });
        };
        
        return updateNodeName(prev);
      });
      
      setRenameItem(null);
    }
  };
  
  const handleDoubleClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    // For both files and folders, start rename on double-click
    startRename(node.id);
  };
  
  const handleDelete = (nodeId: string) => {
    // Clear active file selection if deleting the active file
    if (nodeId === activeCodeFileId) {
      setActiveCodeFileId(null);
    }
    
    // Clear selected folder if deleting the selected folder
    if (nodeId === selectedFolder) {
      setSelectedFolder(null);
    }
    
    setCodeFiles((prev: TreeNode[]) => {
      const deleteNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
          if (node.id === nodeId) {
            return false;
          }
          
          if (node.children) {
            node.children = deleteNode(node.children);
          }
          
          return true;
        });
      };
      
      return deleteNode(prev);
    });
    
    setShowContextMenu(null);
  };
  
  const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.id];
    const isActive = node.id === activeCodeFileId;
    const isFolderSelected = node.id === selectedFolder;
    const isRenaming = node.id === renameItem;
    
    return (
      <div key={node.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer
            ${isActive && !isFolder ? 'bg-[hsl(var(--dark-7))]' : ''}
            ${isFolderSelected && isFolder ? 'bg-[hsl(var(--dark-7))/40]' : ''}
            hover:bg-[hsl(var(--dark-7))]
          `}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={(e) => {
            if (isFolder) {
              handleFolderClick(node.id, e);
            } else {
              setActiveCodeFileId(node.id);
              if (onFileOpen) {
                onFileOpen(node.id);
              }
              setSelectedFolder(null);
            }
          }}
          onDoubleClick={(e) => handleDoubleClick(node, e)}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        >
          {isFolder ? (
            <>
              <span 
                className="mr-1 cursor-pointer" 
                onClick={(e) => toggleFolder(node.id, e)}
              >
                {isExpanded ? (
                  <ChevronDown className="text-[hsl(var(--dark-2))]" size={16} />
                ) : (
                  <ChevronRight className="text-[hsl(var(--dark-2))]" size={16} />
                )}
              </span>
              <Folder className={`mr-2 ${isFolderSelected ? 'text-white' : 'text-[hsl(var(--dark-2))]'}`} size={16} />
            </>
          ) : (
            <>
              <span className="w-[16px] mr-1"></span>
              {getFileIcon(node.name)}
            </>
          )}
          
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(e);
                if (e.key === 'Escape') setRenameItem(null);
              }}
              onBlur={handleRename}
              className="bg-[hsl(var(--dark-6))] text-white text-sm p-0.5 w-full outline-none border border-[hsl(var(--primary))] rounded"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`text-sm ${
              isActive && !isFolder ? 'text-[hsl(var(--primary))]' : 
              isFolderSelected && isFolder ? 'text-white' : 
              'text-[hsl(var(--dark-1))]'
            }`}>
              {node.name}
            </span>
          )}
        </div>
        
        {isFolder && isExpanded && node.children && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-[hsl(var(--dark-8))] flex flex-col border-r border-gray-700/50 h-full overflow-hidden" ref={treeRef}>
      {/* Repository Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0">
        <h2 className="font-semibold text-white truncate">solar-system-simulator</h2>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={collapseAll}
            title="Collapse all folders"
          >
            <ChevronUp size={14} />
          </button>
          <button 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={expandAll}
            title="Expand all folders"
          >
            <ChevronDown size={14} />
          </button>
          <button 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleCreateFolder()}
            title="New folder"
          >
            <FolderPlus size={14} />
          </button>
          <button 
            className="p-1 text-[hsl(var(--dark-2))] hover:text-white rounded hover:bg-[hsl(var(--dark-7))]"
            onClick={() => handleCreateFile()}
            title="New file"
          >
            <FilePlus size={14} />
          </button>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2 min-w-full">
        <div className="min-w-max">
          {codeFiles.map(file => renderNode(file))}
        </div>
      </div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed bg-[hsl(var(--dark-8))] border border-gray-700 shadow-lg rounded z-50 py-1"
          style={{ 
            left: `${showContextMenu.x}px`, 
            top: `${showContextMenu.y}px`,
            minWidth: '160px'
          }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => startRename(showContextMenu.id)}
          >
            <PencilLine size={14} className="mr-2" /> Rename
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
            onClick={() => handleDelete(showContextMenu.id)}
          >
            <Trash2 size={14} className="mr-2" /> Delete
          </button>
          
          {findNodeById(codeFiles, showContextMenu.id)?.type === 'folder' && (
            <>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleCreateFile(showContextMenu.id)}
              >
                <FilePlus size={14} className="mr-2" /> New File
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-[hsl(var(--dark-1))] hover:bg-[hsl(var(--dark-7))] flex items-center"
                onClick={() => handleCreateFolder(showContextMenu.id)}
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

export default CodeTree;
