import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import TabsContainer from './TabsContainer';
import CodeEditor from './CodeEditor';
import { EditorPanelNode, SplitOrientation, LayoutNode } from '@/types';
import './style.css'; // Ensure styles are imported

interface EditorPanelProps {
  panelNode: EditorPanelNode;
}

// Helper function to update a node in the layout tree
const updateNodeInLayout = (node: LayoutNode, updatedNode: LayoutNode): LayoutNode => {
  if (node.id === updatedNode.id) {
    return updatedNode;
  }
  if (node.type === 'splitter') {
    return {
      ...node,
      children: [
        updateNodeInLayout(node.children[0], updatedNode),
        updateNodeInLayout(node.children[1], updatedNode)
      ]
    };
  }
  return node;
};

const TAB_BAR_HEIGHT_ESTIMATE = 32; // Reduced estimate based on smaller tab height

const EditorPanel: React.FC<EditorPanelProps> = ({ panelNode }) => {
  const {
    getFileData,
    splitPanel,
    activePanelId,
    setActivePanelId,
    setEditorLayout, // Needed for direct manipulation in complex cases
    closeFileInPanel,
    openFileInPanel,
    updateFileContent // Get the update function from context
  } = useWorkspace();
  
  const [dropZone, setDropZone] = useState<'top' | 'bottom' | 'left' | 'right' | 'center' | null>(null);
  
  const activeFile = panelNode.activeFileId ? getFileData(panelNode.activeFileId) : null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!e.dataTransfer.types.includes('application/json+tab-split') && 
        !e.dataTransfer.types.includes('application/json')) {
      return; 
    }
    
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Define split zone thresholds (e.g., outer 25%)
    const splitThreshold = 0.25;

    // Check split zones first
    if (x > width * (1 - splitThreshold)) {
      setDropZone('right');
    } else if (y > height * (1 - splitThreshold)) {
      setDropZone('bottom');
    } 
    // Check if cursor is below the estimated tab bar height for center (move) zone
    else if (y > TAB_BAR_HEIGHT_ESTIMATE) {
      setDropZone('center');
    } 
    // Otherwise, no drop zone (likely hovering over tabs or top/left split areas which are disabled)
    else {
      setDropZone(null);
    }
  };
  
  const handleDragLeave = () => {
    setDropZone(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Try different data formats - at drop time, we CAN access the data
    let dragData;
    try {
      if (e.dataTransfer.types.includes('application/json+tab-split')) {
        dragData = e.dataTransfer.getData('application/json+tab-split');
      } else if (e.dataTransfer.types.includes('application/json')) {
        dragData = e.dataTransfer.getData('application/json');
      } else if (e.dataTransfer.types.includes('text/plain')) {
        // Fallback - try to parse text
        dragData = e.dataTransfer.getData('text/plain');
      }
    } catch (error) {
      console.error("Error accessing drag data:", error);
    }
    
    // Reset drop zone
    const currentDropZone = dropZone;
    setDropZone(null);
    
    if (!dragData || !currentDropZone) {
      console.log("No data or dropzone:", dragData, currentDropZone);
      return;
    }
    
    try {
      // Try to parse JSON or extract file ID directly
      let fileId: string;
      let sourcePanelId: string | null = null;
      
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(dragData);
        fileId = parsed.fileId;
        sourcePanelId = parsed.sourcePanelId;
        console.log("Parsed drop data:", parsed);
      } catch (parseError) {
        // If not JSON, assume it's a direct file ID
        fileId = dragData;
        console.log("Using raw drag data as fileId:", fileId);
      }
      
      if (!fileId) {
        console.error("No fileId found in drag data");
        return;
      }
      
      // Handle moving a file to this panel vs splitting the panel
      if (currentDropZone === 'center') {
        // If it's the same panel, do nothing
        if (sourcePanelId === panelNode.id) {
          return;
        }
        
        // Move file to this panel (just open it here and it will be closed from source panel if needed)
        openFileInPanel(fileId, panelNode.id);
        setActivePanelId(panelNode.id);
        return;
      }
      
      // For splitting (bottom/right dropzones)
      let orientation: SplitOrientation = 'vertical';
      let position: 'before' | 'after' = 'after';

      if (currentDropZone === 'bottom') {
        orientation = 'horizontal';
        position = 'after';
      } else if (currentDropZone === 'right') {
        orientation = 'vertical';
        position = 'after';
      } else {
        // Invalid dropzone - shouldn't happen but just in case
        console.log("Invalid dropzone:", currentDropZone);
        return;
      }
      
      console.log(`Splitting panel ${panelNode.id} with file ${fileId}, ${orientation}:${position}`);
      
      // Execute the split operation
      splitPanel(panelNode.id, fileId, orientation, position);
      
    } catch (error) {
      console.error("Failed to process dragged file data:", error, "Raw data:", dragData);
    }
  };

  const handlePanelClick = () => {
    if (panelNode.id !== activePanelId) {
      setActivePanelId(panelNode.id);
    }
  };
  
  // Handler for CodeEditor changes
  const handleEditorContentChange = (newContent: string | undefined) => {
    if (activeFile && newContent !== undefined) {
      updateFileContent(activeFile.id, newContent);
    }
  };

  return (
    <div 
      className={`flex flex-col h-full w-full bg-[hsl(var(--dark-9))] relative border 
                  ${activePanelId === panelNode.id ? 'border-[hsl(var(--primary))]/' : 'border-transparent'}`}
      onClick={handlePanelClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TabsContainer
        panelId={panelNode.id}
        openFiles={panelNode.openFileIds}
        activeFileId={panelNode.activeFileId}
        setActiveFileId={(fileId) => {
          setEditorLayout(layout => updateNodeInLayout(layout, { ...panelNode, activeFileId: fileId }));
          setActivePanelId(panelNode.id);
        }}
        getFileById={getFileData}
        onCloseTab={(fileId, panelId, e) => closeFileInPanel(fileId, panelId)}
      />
      
      {/* File Path Header (if used) */}
      {activeFile && (
         <div className="h-8 border-b border-gray-700/50 flex items-center px-3 bg-[hsl(var(--dark-9))] flex-shrink-0">
            <span className="text-white font-medium text-xs truncate">{activeFile.path || activeFile.name}</span>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden"> {/* Removed relative positioning here */}
        {activeFile ? (
          <CodeEditor
            key={activeFile.id} 
            fileId={activeFile.id}
            filename={activeFile.name}
            content={activeFile.content || ''} 
            onChange={handleEditorContentChange} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[hsl(var(--dark-3))]">
            No file selected in this panel
          </div>
        )}
      </div>

      {/* Drop Zone Indicators - Now positioned relative to the Panel Root */}
      {dropZone && (
        <div 
          className={`absolute inset-0 pointer-events-none z-20 
                      ${dropZone === 'center' 
                        ? 'bg-[hsl(var(--primary))] opacity-20' 
                        : 'border-2 border-dashed border-[hsl(var(--primary))] drop-zone-' + dropZone}`}
          // Position the center drop zone below the estimated tab bar height
          style={dropZone === 'center' ? { top: `${TAB_BAR_HEIGHT_ESTIMATE}px` } : {}}
        >
          {/* Inner div for split zone background */} 
          {dropZone !== 'center' && <div className="absolute inset-0 bg-[hsl(var(--primary))] opacity-10"></div>}
        </div>
      )}
    </div>
  );
};

export default EditorPanel; 