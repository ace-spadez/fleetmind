import React, { useState, useEffect } from 'react';
import CodeTab from './CodeTab';
import { TreeNode } from '@/types';
import './style.css';

interface TabsContainerProps {
  openFiles: string[];
  setOpenFiles: (files: string[] | ((prev: string[]) => string[])) => void;
  activeFileId: string | null;
  setActiveFileId: (id: string | null) => void;
  getFileById: (id: string) => TreeNode | null;
  onCloseTab: (fileId: string, e: React.MouseEvent) => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  openFiles,
  setOpenFiles,
  activeFileId,
  setActiveFileId,
  getFileById,
  onCloseTab
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  
  // Handle tab reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setDropIndex(index);
  };
  
  const handleDragEnd = () => {
    if (draggedIndex !== null && dropIndex !== null && draggedIndex !== dropIndex) {
      // Reorder the tabs
      setOpenFiles((prevOpenFiles) => {
        const newOpenFiles = [...prevOpenFiles];
        const [draggedFile] = newOpenFiles.splice(draggedIndex, 1);
        newOpenFiles.splice(dropIndex, 0, draggedFile);
        return newOpenFiles;
      });
    }
    
    // Reset the drag state
    setDraggedIndex(null);
    setDropIndex(null);
  };
  
  // Activate tab when clicked
  const handleActivateTab = (fileId: string) => {
    setActiveFileId(fileId);
  };
  
  // Apply visual drag and drop styles
  const getTabClassName = (index: number) => {
    if (draggedIndex === index) {
      return 'tab-dragging';
    }
    
    if (dropIndex === index && draggedIndex !== null) {
      // If dragging a tab to the left, indicate drop on right side
      if (draggedIndex < index) {
        return 'border-r-2 border-r-[hsl(var(--primary))]';
      }
      // If dragging a tab to the right, indicate drop on left side
      return 'border-l-2 border-l-[hsl(var(--primary))]';
    }
    
    return '';
  };
  
  return (
    <div className="flex overflow-x-auto scrollbar-hidden border-b border-gray-700/50 bg-[hsl(var(--dark-8))]">
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
                  isActive={isActive}
                  index={index}
                  onActivate={handleActivateTab}
                  onClose={onCloseTab}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
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