import { useRef, useState, useEffect, createRef } from "react";
import CodeTree from "./CodeTree";
import CodeEditor from "./CodeEditor";
import EditorTabs from "./EditorTabs";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { TreeNode, EditorPane } from "@/types";
import { FileCode, GitBranch, Settings, Search, Maximize2, X, Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CodeModule = () => {
  const { 
    codeFiles, 
    activeCodeFileId,
    editorLayout,
    openFileInEditor,
    closeEditorTab,
    setActiveEditorTab,
    splitEditorPane,
    closeEditorPane,
    resizeEditorPanes,
    moveTabToPane
  } = useWorkspace();
  
  // For the Command+P file picker modal
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [filePickerQuery, setFilePickerQuery] = useState("");
  const filePickerRef = useRef<HTMLDivElement>(null);
  const filePickerInputRef = useRef<HTMLInputElement>(null);
  
  // For drag and drop splitting
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [draggedPaneId, setDraggedPaneId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<"left" | "right" | "top" | "bottom" | null>(null);
  
  // Reference to resize handle elements
  const resizeHandleRefs = useRef<{[key: string]: React.RefObject<HTMLDivElement>}>({});
  
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+P for file picker
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowFilePicker(true);
        setTimeout(() => {
          filePickerInputRef.current?.focus();
        }, 50);
      }
      
      // Command+F for search within file
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        // Implement in-file search (will be added in CodeEditor)
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle click outside of file picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filePickerRef.current && !filePickerRef.current.contains(event.target as Node)) {
        setShowFilePicker(false);
      }
    };
    
    if (showFilePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilePicker]);
  
  // Function to find a file by ID in the file tree
  const findFileById = (nodes: TreeNode[], id: string | null): TreeNode | undefined => {
    if (!id) return undefined;
    
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    
    return undefined;
  };
  
  // Get all files in the flat structure for file picker
  const getAllFiles = (nodes: TreeNode[]): TreeNode[] => {
    let files: TreeNode[] = [];
    
    for (const node of nodes) {
      if (node.type === 'file') {
        files.push(node);
      }
      if (node.children) {
        files = [...files, ...getAllFiles(node.children)];
      }
    }
    
    return files;
  };
  
  // Filter files based on search query
  const filteredFiles = filePickerQuery 
    ? getAllFiles(codeFiles).filter(file => 
        file.name.toLowerCase().includes(filePickerQuery.toLowerCase()) ||
        file.path.toLowerCase().includes(filePickerQuery.toLowerCase())
      )
    : [];
  
  // Initialize resize handlers
  useEffect(() => {
    editorLayout.panes.forEach((_, index) => {
      if (index < editorLayout.panes.length - 1) {
        const key = `resize-${index}`;
        resizeHandleRefs.current[key] = resizeHandleRefs.current[key] || createRef();
      }
    });
  }, [editorLayout.panes.length]);
  
  // Set up resize handler function
  const startResizing = (index: number, initialEvent: React.MouseEvent) => {
    const isHorizontal = editorLayout.direction === 'horizontal';
    const startPosition = isHorizontal ? initialEvent.clientX : initialEvent.clientY;
    
    const pane1 = editorLayout.panes[index];
    const pane2 = editorLayout.panes[index + 1];
    
    const initialSize1 = pane1.size || 1;
    const initialSize2 = pane2.size || 1;
    const totalSize = initialSize1 + initialSize2;
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = isHorizontal ? e.clientX : e.clientY;
      const delta = currentPosition - startPosition;
      
      // Calculate how much to resize based on container size
      const container = document.querySelector('.code-editor-container');
      if (!container) return;
      
      const containerSize = isHorizontal ? container.clientWidth : container.clientHeight;
      const deltaRatio = delta / containerSize;
      
      // Calculate new sizes with constraints
      const newSize1 = Math.max(0.1, Math.min(initialSize1 + deltaRatio * totalSize, totalSize - 0.1));
      const newSize2 = totalSize - newSize1;
      
      // Update the pane sizes
      const newSizes = [...editorLayout.panes.map(p => p.size || 1)];
      newSizes[index] = newSize1;
      newSizes[index + 1] = newSize2;
      
      resizeEditorPanes(newSizes);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle tab drag to create new panes
  const handleTabDragStart = (tabId: string, paneId: string) => {
    setDraggedTabId(tabId);
    setDraggedPaneId(paneId);
  };
  
  const handleTabDragEnd = () => {
    setDraggedTabId(null);
    setDraggedPaneId(null);
    setDropTarget(null);
  };
  
  const handlePaneDragOver = (e: React.DragEvent, paneId: string) => {
    e.preventDefault();
    
    if (!draggedTabId || paneId === draggedPaneId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Determine which edge the dragged tab is closest to
    const leftDist = x;
    const rightDist = rect.width - x;
    const topDist = y;
    const bottomDist = rect.height - y;
    
    const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
    
    let newDropTarget: "left" | "right" | "top" | "bottom" | null = null;
    
    if (minDist === leftDist && leftDist < rect.width * 0.2) newDropTarget = "left";
    else if (minDist === rightDist && rightDist < rect.width * 0.2) newDropTarget = "right";
    else if (minDist === topDist && topDist < rect.height * 0.2) newDropTarget = "top";
    else if (minDist === bottomDist && bottomDist < rect.height * 0.2) newDropTarget = "bottom";
    
    setDropTarget(newDropTarget);
  };
  
  const handlePaneDrop = (e: React.DragEvent, targetPaneId: string) => {
    e.preventDefault();
    
    if (!draggedTabId || !draggedPaneId) return;
    
    if (draggedPaneId === targetPaneId) {
      // Same pane, don't do anything
      setDropTarget(null);
      return;
    }
    
    if (dropTarget === "left" || dropTarget === "right" || dropTarget === "top" || dropTarget === "bottom") {
      // Create a new pane
      const direction = dropTarget === "left" || dropTarget === "right" ? "horizontal" : "vertical";
      splitEditorPane(direction, draggedTabId);
    } else {
      // Move tab to existing pane
      moveTabToPane(draggedTabId, draggedPaneId, targetPaneId);
    }
    
    setDropTarget(null);
  };
  
  // Render the editor panes
  const renderEditorPanes = () => {
    return (
      <div 
        className={`flex-1 flex ${editorLayout.direction === 'horizontal' ? 'flex-row' : 'flex-col'} code-editor-container`}
      >
        {editorLayout.panes.map((pane, index) => {
          const activeTab = pane.tabs.find(tab => tab.id === pane.activeTabId);
          const activeFile = activeTab ? findFileById(codeFiles, activeTab.fileId) : undefined;
          
          return (
            <div 
              key={pane.id} 
              className="relative flex flex-col"
              style={{ 
                flex: pane.size || 1,
                minWidth: editorLayout.direction === 'horizontal' ? '200px' : '100%',
                minHeight: editorLayout.direction === 'vertical' ? '200px' : '100%'
              }}
              onDragOver={(e) => handlePaneDragOver(e, pane.id)}
              onDrop={(e) => handlePaneDrop(e, pane.id)}
              onDragLeave={() => setDropTarget(null)}
            >
              {/* Tabs bar */}
              <EditorTabs 
                pane={pane}
                onTabClose={(tabId: string) => closeEditorTab(tabId, pane.id)}
                onTabClick={(tabId: string) => setActiveEditorTab(tabId, pane.id)}
                onTabDragStart={(tabId: string) => handleTabDragStart(tabId, pane.id)}
                onTabDragEnd={handleTabDragEnd}
              />
              
              {/* Editor content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeFile ? (
                  <CodeEditor fileName={activeFile.name} />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <FileCode size={48} className="mx-auto mb-4 text-[hsl(var(--dark-4))]" />
                      <h2 className="text-sm font-semibold text-white mb-2">No file open in editor</h2>
                      <p className="text-xs text-[hsl(var(--dark-3))]">
                        Select a file from the sidebar or press Cmd+P to open a file
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Overlay for drag targets */}
              {dropTarget && draggedPaneId !== pane.id && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {dropTarget === "left" && (
                    <div className="absolute inset-y-0 left-0 w-1/5 bg-blue-500/30 border-r-2 border-blue-500"></div>
                  )}
                  {dropTarget === "right" && (
                    <div className="absolute inset-y-0 right-0 w-1/5 bg-blue-500/30 border-l-2 border-blue-500"></div>
                  )}
                  {dropTarget === "top" && (
                    <div className="absolute inset-x-0 top-0 h-1/5 bg-blue-500/30 border-b-2 border-blue-500"></div>
                  )}
                  {dropTarget === "bottom" && (
                    <div className="absolute inset-x-0 bottom-0 h-1/5 bg-blue-500/30 border-t-2 border-blue-500"></div>
                  )}
                </div>
              )}
              
              {/* Resize handle */}
              {index < editorLayout.panes.length - 1 && (
                <div
                  ref={resizeHandleRefs.current[`resize-${index}`]}
                  className={`
                    resize-handle 
                    ${editorLayout.direction === 'horizontal' ? 'w-1 right-0 cursor-col-resize' : 'h-1 bottom-0 cursor-row-resize'}
                    absolute z-10 bg-transparent hover:bg-blue-500/50
                  `}
                  style={
                    editorLayout.direction === 'horizontal' 
                      ? { top: 0, bottom: 0, width: '6px', right: '-3px' }
                      : { left: 0, right: 0, height: '6px', bottom: '-3px' }
                  }
                  onMouseDown={(e) => startResizing(index, e)}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* File Tree */}
      <CodeTree codeFiles={codeFiles} onFileClick={(file: TreeNode) => 
        openFileInEditor(file.id, file.name, file.path)
      } />
      
      {/* Code Editor Container */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--dark-9))]">
        {/* Code Header with Search */}
        <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
          <div className="flex items-center">
            <FileCode className="text-[hsl(var(--dark-2))] mr-2" size={18} />
            <h3 className="font-medium text-white">Solar System Simulator</h3>
          </div>
          
          <div className="ml-auto flex items-center space-x-3">
            <button 
              className="text-[hsl(var(--dark-2))] hover:text-white flex items-center text-xs"
              onClick={() => setShowFilePicker(true)}
            >
              <Search size={16} className="mr-1" />
              <span className="hidden sm:inline">Search</span>
              <span className="text-xs text-[hsl(var(--dark-3))] ml-1 hidden sm:inline">⌘P</span>
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <GitBranch size={18} />
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Editor Panes Container */}
        {renderEditorPanes()}
      </div>
      
      {/* File Picker Modal (Command+P) */}
      {showFilePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
          <div 
            ref={filePickerRef} 
            className="w-full max-w-2xl bg-[hsl(var(--dark-8))] rounded-md shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-gray-700/50">
              <Input
                ref={filePickerInputRef}
                value={filePickerQuery}
                onChange={(e) => setFilePickerQuery(e.target.value)}
                placeholder="Type to search for files (e.g. 'App.jsx')"
                className="bg-[hsl(var(--dark-9))] border-gray-700 text-white"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowFilePicker(false);
                  } else if (e.key === 'Enter' && filteredFiles.length > 0) {
                    const file = filteredFiles[0];
                    openFileInEditor(file.id, file.name, file.path);
                    setShowFilePicker(false);
                  }
                }}
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredFiles.length === 0 ? (
                <div className="p-4 text-center text-[hsl(var(--dark-3))]">
                  {filePickerQuery ? 'No matching files found' : 'Type to search for files'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="px-3 py-2 rounded hover:bg-[hsl(var(--dark-7))] cursor-pointer flex items-center"
                      onClick={() => {
                        openFileInEditor(file.id, file.name, file.path);
                        setShowFilePicker(false);
                      }}
                    >
                      <FileCode size={16} className="text-[hsl(var(--dark-2))] mr-2" />
                      <div className="overflow-hidden">
                        <div className="text-white font-medium text-sm truncate">
                          {file.name}
                        </div>
                        <div className="text-[hsl(var(--dark-3))] text-xs truncate">
                          {file.path}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeModule;
