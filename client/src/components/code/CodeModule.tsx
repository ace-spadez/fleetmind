import React, { useState, useEffect, useRef, useCallback } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import CodeTree from "./CodeTree";
import CodeEditor from "./CodeEditor";
import TabsContainer from "./TabsContainer";
import { TreeNode } from "@/types";

const CodeModule = () => {
  const { 
    codeFiles, 
    activeCodeFileId, 
    setActiveCodeFileId,
    openCodeFiles,
    setOpenCodeFiles 
  } = useWorkspace();
  
  const [treeWidth, setTreeWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  
  // Find file by ID in the tree structure
  const findFileById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findFileById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Helper function to get a file by ID from the tree
  const getFileById = (id: string): TreeNode | null => {
    return findFileById(codeFiles, id);
  };

  // Find the active file
  const activeFile = activeCodeFileId ? getFileById(activeCodeFileId) : null;
  
  // Handle opening a file in the editor
  const handleFileOpen = (fileId: string) => {
    // Only add file to openCodeFiles if it's not already there
    if (!openCodeFiles.includes(fileId)) {
      setOpenCodeFiles(prev => [...prev, fileId]);
    }
    setActiveCodeFileId(fileId);
  };
  
  // Handle closing a tab
  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newOpenFiles = openCodeFiles.filter(id => id !== fileId);
    setOpenCodeFiles(newOpenFiles);
    
    // If we're closing the active file
    if (fileId === activeCodeFileId) {
      // Set the active file to the last one in the list or null if empty
      if (newOpenFiles.length > 0) {
        setActiveCodeFileId(newOpenFiles[newOpenFiles.length - 1]);
      } else {
        setActiveCodeFileId(null);
      }
    }
  };
  
  // Add active file to open files when it changes
  useEffect(() => {
    if (activeCodeFileId && !openCodeFiles.includes(activeCodeFileId)) {
      setOpenCodeFiles(prev => [...prev, activeCodeFileId]);
    }
  }, [activeCodeFileId, openCodeFiles]);
  
  // Build the actual file path by traversing the tree
  const buildFilePath = (fileId: string): string[] => {
    const result: string[] = [];
    
    // Recursive function to find path to the file
    const findPath = (nodes: TreeNode[], id: string, currentPath: string[] = []): boolean => {
      for (const node of nodes) {
        // Current path including this node
        const nodePath = [...currentPath, node.name];
        
        // If this is the node we're looking for, return the path
        if (node.id === id) {
          result.push(...nodePath);
          return true;
        }
        
        // If this is a folder, check its children
        if (node.type === 'folder' && node.children) {
          if (findPath(node.children, id, nodePath)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    findPath(codeFiles, fileId);
    
    // Remove the last item (filename) since we'll display it separately
    if (result.length > 0) {
      result.pop();
    }
    
    return result;
  };
  
  const renderBreadcrumbs = () => {
    if (!activeFile || !activeCodeFileId) return null;
    
    const pathParts = buildFilePath(activeCodeFileId);
    
    // If we have more than 3 folders in the path, use ellipsis
    let displayParts = pathParts;
    if (pathParts.length > 3) {
      displayParts = [
        pathParts[0],
        '...',
        ...pathParts.slice(-2)
      ];
    }
    
    return displayParts.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="text-[hsl(var(--dark-4))] mx-1">/</span>}
        <span className="text-[hsl(var(--dark-3))] hover:text-[hsl(var(--dark-1))] cursor-pointer text-sm">
          {part}
        </span>
      </React.Fragment>
    ));
  };
  
  // Handle mouse down on resize handle - memoized with useCallback
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);
  
  // Handle mouse move while resizing - memoized with useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Get container bounds
    const containerRect = resizeContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Calculate new width based on mouse position relative to container
    const containerLeft = containerRect.left;
    const newWidth = Math.max(150, Math.min(500, e.clientX - containerLeft));
    
    // Set new width
    setTreeWidth(newWidth);
  }, [isResizing]);
  
  // Handle mouse up to stop resizing - memoized with useCallback
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);
  
  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col h-full w-full">
      <div 
        ref={resizeContainerRef}
        className="flex h-full overflow-hidden relative"
      >
        {/* Code Tree with resizable width */}
        <div 
          className="border-r border-gray-700/50 overflow-auto h-full"
          style={{ 
            width: `${treeWidth}px`, 
            minWidth: "150px", 
            maxWidth: "500px",
            flexShrink: 0
          }}
        >
          <CodeTree codeFiles={codeFiles} onFileOpen={handleFileOpen} />
        </div>
        
        {/* Resize Handle */}
        <div
          className={`absolute top-0 bottom-0 z-10 cursor-col-resize select-none w-4 -ml-2 
                     ${isResizing ? 'bg-gray-700/10' : 'hover:bg-gray-700/5'}`}
          style={{ left: `${treeWidth}px` }}
          onMouseDown={handleMouseDown}
        >
          {/* Handle grip indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         h-12 w-1 flex flex-col justify-center items-center pointer-events-none">
            <div className="h-10 w-[3px] bg-gray-600/50 rounded-full"></div>
          </div>
        </div>
        
        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col h-full">
          {/* Tabs Row - Now with draggable tabs */}
          <TabsContainer 
            openFiles={openCodeFiles}
            setOpenFiles={setOpenCodeFiles}
            activeFileId={activeCodeFileId}
            setActiveFileId={setActiveCodeFileId}
            getFileById={getFileById}
            onCloseTab={handleCloseTab}
          />
          
          {/* File Path Header - Modern & Clean */}
          {activeFile && (
            <div className="h-10 border-b border-gray-700/50 flex items-center px-4 bg-[hsl(var(--dark-9))]">
              <div className="flex items-center">
                {activeFile.name && (
                  <>
                    {renderBreadcrumbs()}
                    {activeCodeFileId && buildFilePath(activeCodeFileId).length > 0 && (
                      <span className="text-[hsl(var(--dark-4))] mx-1">/</span>
                    )}
                    <span className="text-white font-medium text-sm">{activeFile.name}</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Editor Area */}
          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <CodeEditor 
                fileId={activeFile.id} 
                filename={activeFile.name} 
                content={activeFile.content || ''} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[hsl(var(--dark-11))]">
                No file selected
              </div>
            )}
          </div>
        </div>
        
        {/* Full screen overlay when resizing */}
        {isResizing && (
          <div className="fixed inset-0 z-50 cursor-col-resize" />
        )}
      </div>
    </div>
  );
};

export default CodeModule;
