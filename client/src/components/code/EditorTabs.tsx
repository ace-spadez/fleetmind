import React from 'react';
import { EditorPane } from '@/types';
import { X, Circle } from 'lucide-react';

interface EditorTabsProps {
  pane: EditorPane;
  onTabClose: (tabId: string) => void;
  onTabClick: (tabId: string) => void;
  onTabDragStart: (tabId: string) => void;
  onTabDragEnd: () => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  pane,
  onTabClose,
  onTabClick,
  onTabDragStart,
  onTabDragEnd
}) => {
  return (
    <div className="flex h-10 bg-[hsl(var(--dark-8))] border-b border-gray-700/50 overflow-x-auto hide-scrollbar">
      {pane.tabs.map(tab => (
        <div 
          key={tab.id}
          className={`
            flex items-center px-3 min-w-[120px] max-w-[200px]
            border-r border-gray-700/50 group hover:bg-[hsl(var(--dark-7))]
            ${tab.active ? 'bg-[hsl(var(--dark-7))]' : 'bg-[hsl(var(--dark-8))]'}
            ${tab.active ? 'text-white' : 'text-[hsl(var(--dark-2))]'}
            cursor-pointer relative select-none
          `}
          onClick={() => onTabClick(tab.id)}
          draggable={true}
          onDragStart={() => onTabDragStart(tab.id)}
          onDragEnd={onTabDragEnd}
        >
          {/* Tab dirty indicator */}
          {tab.isDirty && (
            <Circle 
              size={8} 
              fill="currentColor" 
              className="text-blue-400 mr-1.5" 
            />
          )}

          {/* Tab title with truncation */}
          <span className="truncate flex-1 text-sm">{tab.fileName}</span>
          
          {/* Close button */}
          <button
            className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X size={14} />
          </button>
          
          {/* Active tab indicator - blue line at the top */}
          {tab.active && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </div>
      ))}
      
      {/* Empty space after tabs */}
      <div className="flex-1 border-b border-gray-700/50"></div>
    </div>
  );
};

export default EditorTabs;