import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { TreeNode } from '@/types';

interface CodeTabProps {
  fileId: string;
  file: TreeNode;
  isActive: boolean;
  index: number;
  onActivate: (fileId: string) => void;
  onClose: (fileId: string, e: React.MouseEvent) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

const CodeTab: React.FC<CodeTabProps> = ({
  fileId,
  file,
  isActive,
  index,
  onActivate,
  onClose,
  onDragStart,
  onDragEnter,
  onDragEnd
}) => {
  const tabRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    // Set the drag data with the tab index
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Set a custom ghost image (optional)
    if (tabRef.current) {
      const rect = tabRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(tabRef.current, rect.width / 2, rect.height / 2);
    }
    
    // Add dragging class for styling
    setTimeout(() => {
      if (tabRef.current) tabRef.current.classList.add('opacity-50');
    }, 0);
    
    // Notify parent component
    onDragStart(index);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    if (tabRef.current) tabRef.current.classList.remove('opacity-50');
    onDragEnd();
  };

  return (
    <div
      ref={tabRef}
      className={`
        flex items-center px-3 py-2 cursor-pointer border-r border-gray-700/50 
        select-none gap-2 max-w-[180px] transition-colors
        ${isActive 
          ? 'bg-[hsl(var(--dark-6))] border-t-2 border-t-[hsl(var(--primary))] border-b-0' 
          : 'hover:bg-[hsl(var(--dark-6))/50] border-t-2 border-t-transparent'}
      `}
      onClick={() => onActivate(fileId)}
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <span className="truncate text-sm">{file.name}</span>
      <button
        className="h-4 w-4 rounded-sm hover:bg-[hsl(var(--dark-8))] flex items-center justify-center flex-shrink-0"
        onClick={(e) => onClose(fileId, e)}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default CodeTab; 