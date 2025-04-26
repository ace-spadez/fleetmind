import React, { useRef } from 'react';
import { X, Code, BotMessageSquare, FileText, Network } from 'lucide-react';
import { ContentType } from '@/types';

interface ContentTabProps {
  id: string;
  title: string;
  contentType: ContentType;
  panelId: string;
  isActive: boolean;
  index: number;
  onActivate: (id: string, panelId: string) => void;
  onClose: (id: string, panelId: string, e: React.MouseEvent) => void;
  onDragStartInternal: (index: number, panelId: string) => void;
  onDragStartExternal: (id: string, panelId: string, e: React.DragEvent) => void;
  onDragEnter: (index: number) => void;
  onDragEndInternal: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  id,
  title,
  contentType,
  panelId,
  isActive,
  index,
  onActivate,
  onClose,
  onDragStartInternal,
  onDragStartExternal,
  onDragEnter,
  onDragEndInternal
}) => {
  const tabRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    // Set data in multiple formats to maximize compatibility
    const splitData = JSON.stringify({ id, contentType, sourcePanelId: panelId });
    
    // For internal reordering within the same panel
    e.dataTransfer.setData('application/json+tab-reorder', 
      JSON.stringify({ index, panelId }));
    
    // For external splitting to another panel - use multiple formats for reliability
    e.dataTransfer.setData('application/json+tab-split', splitData);
    e.dataTransfer.setData('application/json', splitData);
    e.dataTransfer.setData('text/plain', id); // Simplest fallback
    
    // Set allowed effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Set a custom ghost image
    if (tabRef.current) {
      const rect = tabRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(tabRef.current, rect.width / 2, rect.height / 2);
      
      // Add dragging class for styling
      setTimeout(() => {
        if (tabRef.current) tabRef.current.classList.add('opacity-50');
      }, 0);
    }
    
    // Notify parent components
    onDragStartInternal(index, panelId);
    onDragStartExternal(id, panelId, e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); // Always prevent default to ensure we get dragover events
    
    // Check if we have reordering data and are from the same panel
    if (e.dataTransfer.types.includes('application/json+tab-reorder')) {
      // During dragenter, we cannot access the data with getData
      // Just notify parent component that we entered this index
      onDragEnter(index);
    }
  };

  const handleDragEnd = () => {
    if (tabRef.current) {
      tabRef.current.classList.remove('opacity-50');
    }
    onDragEndInternal();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Needed to allow drop
    e.dataTransfer.dropEffect = 'move';
  };

  // Get icon based on content type
  const getIcon = () => {
    switch (contentType) {
      case 'code':
        return <Code size={14} className="mr-1.5" />;
      case 'chat':
        return <BotMessageSquare size={14} className="mr-1.5" />;
      case 'docs':
        return <FileText size={14} className="mr-1.5" />;
      case 'organization':
        return <Network size={14} className="mr-1.5" />;
      default:
        return <FileText size={14} className="mr-1.5" />;
    }
  };

  return (
    <div
      ref={tabRef}
      className={`flex items-center text-xs px-3 py-1.5 border-r border-gray-700/50 select-none
        ${isActive ? 'bg-[hsl(var(--dark-9))] text-white font-medium' : 'bg-[hsl(var(--dark-8))] text-[hsl(var(--dark-3))]'}
        hover:bg-[hsl(var(--dark-7))] hover:text-white cursor-pointer transition-colors`}
      onClick={() => onActivate(id, panelId)}
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {getIcon()}
      <span className="truncate max-w-[120px]">{title}</span>
      <button
        className="ml-2 opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClose(id, panelId, e);
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ContentTab; 