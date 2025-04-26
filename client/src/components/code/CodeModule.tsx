import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import CodeTree from "./CodeTree";
import EditorLayout from "./EditorLayout";

const CodeModule = () => {
  const { 
    codeFiles, 
    editorLayout,
    openFileInPanel,
  } = useWorkspace();
  
  const [treeWidth, setTreeWidth] = useState(250);
  const [isResizingTree, setIsResizingTree] = useState(false);
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle opening a file from the tree (opens in active panel)
  const handleFileOpen = (fileId: string) => {
    openFileInPanel(fileId);
  };

  // --- Tree Resizing Logic --- 
  const handleTreeResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingTree(true);
  }, []);
  
  const handleTreeResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingTree) return;
    
    const containerRect = resizeContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerLeft = containerRect.left;
    const newWidth = Math.max(150, Math.min(800, e.clientX - containerLeft));
    
    setTreeWidth(newWidth);
  }, [isResizingTree]);
  
  const handleTreeResizeMouseUp = useCallback(() => {
    setIsResizingTree(false);
  }, []);
  
  useEffect(() => {
    if (isResizingTree) {
      document.addEventListener('mousemove', handleTreeResizeMouseMove);
      document.addEventListener('mouseup', handleTreeResizeMouseUp);
    } else {
      document.removeEventListener('mousemove', handleTreeResizeMouseMove);
      document.removeEventListener('mouseup', handleTreeResizeMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleTreeResizeMouseMove);
      document.removeEventListener('mouseup', handleTreeResizeMouseUp);
    };
  }, [isResizingTree, handleTreeResizeMouseMove, handleTreeResizeMouseUp]);
  // --- End Tree Resizing Logic --- 

  return (
    <div className="flex flex-col h-full w-full bg-[hsl(var(--dark-8))]">
      <div 
        ref={resizeContainerRef}
        className="flex h-full overflow-hidden relative"
      >
        {/* Code Tree (Resizable) */}
        <div 
          className="overflow-auto h-full flex-shrink-0"
          style={{ 
            width: `${treeWidth}px`, 
          }}
        >
          <CodeTree codeFiles={codeFiles} onFileOpen={handleFileOpen} />
        </div>
        
        {/* Tree Resize Handle - Styled like Splitter */}
        <div
          className={`splitter cursor-col-resize w-1 h-full select-none z-10 flex justify-center items-center 
                     bg-black`}
          style={{ 
            flexShrink: 0, 
          }}
          onMouseDown={handleTreeResizeMouseDown}
        >
          <div className="splitter-grip h-10 w-[3px] bg-gray-600/50 rounded-full pointer-events-none"></div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden"> {/* Removed ml-1 which might interfere */}
          <EditorLayout layoutNode={editorLayout} />
        </div>
        
        {/* Tree resizing overlay */}
        {isResizingTree && (
          <div className="fixed inset-0 z-50 cursor-col-resize" />
        )}
      </div>
    </div>
  );
};

export default CodeModule;
