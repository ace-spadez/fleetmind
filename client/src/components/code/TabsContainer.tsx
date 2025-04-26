import React, { useState } from 'react';
import CodeTab from './CodeTab';
import { TreeNode, LayoutNode } from '@/types';
import { useWorkspace } from '@/context/WorkspaceProvider'; // Need workspace for setting editor layout
import './style.css';

interface TabsContainerProps {
  panelId: string;
  openFiles: string[];
  activeFileId: string | null;
  setActiveFileId: (id: string | null) => void;
  getFileById: (id: string) => TreeNode | null;
  onCloseTab: (fileId: string, panelId: string, e: React.MouseEvent) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  panelId,
  openFiles,
  activeFileId,
  setActiveFileId,
  getFileById,
  onCloseTab
}) => {
  const { setEditorLayout } = useWorkspace();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dragSourcePanelId, setDragSourcePanelId] = useState<string | null>(null);

  // Handle internal tab reordering (within the same panel)
  const handleDragStartInternal = (index: number, sourcePanelId: string) => {
    setDraggedIndex(index);
    setDragSourcePanelId(sourcePanelId);
  };

  const handleDragEnterInternal = (index: number) => {
    // Only process if this is the same panel as the source
    // and it's a different index than what was dragged
    if (dragSourcePanelId === panelId && 
        draggedIndex !== null && 
        draggedIndex !== index) {
      setDropIndex(index);
    }
  };

  const handleDragEndInternal = () => {
    // Only reorder if all conditions are met
    if (draggedIndex !== null && 
        dropIndex !== null && 
        draggedIndex !== dropIndex &&
        dragSourcePanelId === panelId) {
        
      // Update the layout in the context
      setEditorLayout(layout => {
        if (layout.type === 'panel' && layout.id === panelId) {
          const newOpenFiles = [...layout.openFileIds];
          const [draggedFile] = newOpenFiles.splice(draggedIndex, 1);
          newOpenFiles.splice(dropIndex, 0, draggedFile);
          return { ...layout, openFileIds: newOpenFiles };
        } else if (layout.type === 'splitter') {
          // Need recursive update for splitters
          const updatePanelFilesInSplitter = (node: LayoutNode): LayoutNode => {
            if (node.type === 'panel' && node.id === panelId) {
              const newOpenFiles = [...node.openFileIds];
              const [draggedFile] = newOpenFiles.splice(draggedIndex, 1);
              newOpenFiles.splice(dropIndex, 0, draggedFile);
              return { ...node, openFileIds: newOpenFiles };
            }
            if (node.type === 'splitter') {
              return { 
                ...node, 
                children: [updatePanelFilesInSplitter(node.children[0]), updatePanelFilesInSplitter(node.children[1])] 
              };
            }
            return node;
          };
          return updatePanelFilesInSplitter(layout);
        } 
        return layout; // Should not happen
      });
    }

    // Reset the drag state
    setDraggedIndex(null);
    setDropIndex(null);
    setDragSourcePanelId(null);
  };
  
  // Handler for initiating external drag (split)
  // This component doesn't handle the drop, only initiates
  const handleDragStartExternal = (fileId: string, sourcePanelId: string, e: React.DragEvent) => {
    // Set data for EditorPanel drop handler
    const dragData = JSON.stringify({ fileId, sourcePanelId });
    
    // Use a specific type for tab splits if needed, otherwise use general JSON
    e.dataTransfer.setData('application/json+tab-split', dragData);
    // Provide fallback generic JSON data as well
    e.dataTransfer.setData('application/json', dragData); 
    
    e.dataTransfer.effectAllowed = 'move';
    
    // Optionally set a drag image (e.g., a ghost of the tab)
    // e.dataTransfer.setDragImage(e.target, 0, 0); 
  };

  // Activate tab when clicked
  const handleActivateTab = (fileId: string, targetPanelId: string) => {
    if (targetPanelId === panelId) {
      setActiveFileId(fileId);
    }
  };

  // Apply visual drag and drop styles
  const getTabClassName = (index: number) => {
    // Only apply drag effects if this is the source panel
    if (dragSourcePanelId !== panelId) return '';
    
    if (draggedIndex === index) {
      return 'tab-dragging';
    }
    if (dropIndex === index && draggedIndex !== null && draggedIndex !== index) {
      return 'tab-drag-over';
    }
    return '';
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hidden border-b border-gray-700/50 bg-[hsl(var(--dark-8))] flex-shrink-0">
      {openFiles.length > 0 ? (
        <div className="flex">
          {openFiles.map((fileId, index) => {
            const file = getFileById(fileId);
            if (!file) return null;
            
            const isActive = fileId === activeFileId;
            
            return (
              <div 
                key={fileId} 
                className={`tab-transition ${getTabClassName(index)}`}
              >
                <CodeTab
                  fileId={fileId}
                  file={file}
                  panelId={panelId}
                  isActive={isActive}
                  index={index}
                  onActivate={handleActivateTab}
                  onClose={onCloseTab}
                  onDragStartInternal={handleDragStartInternal}
                  onDragStartExternal={handleDragStartExternal}
                  onDragEnter={handleDragEnterInternal}
                  onDragEndInternal={handleDragEndInternal}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-2 text-[hsl(var(--dark-3))]">No files open</div>
      )}
    </div>
  );
};

export default TabsContainer; 