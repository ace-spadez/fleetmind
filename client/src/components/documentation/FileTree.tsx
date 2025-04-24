import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { File } from "@/types";
import { ChevronDown, ChevronRight, Folder, FileText, Plus } from "lucide-react";

type FileTreeProps = {
  documents: File[];
};

const FileTree = ({ documents }: FileTreeProps) => {
  const { activeDocumentId, setActiveDocumentId, createDocument } = useWorkspace();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "project": true,
    "solar-system": true
  });
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const renderFile = (file: File, depth: number = 0) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders[file.id];
    const isActive = file.id === activeDocumentId;
    
    return (
      <div key={file.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-[hsl(var(--dark-7))] cursor-pointer file-tree-item ${isActive && !isFolder ? 'bg-[hsl(var(--dark-7))]' : ''}`}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(file.id);
            } else {
              setActiveDocumentId(file.id);
            }
          }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="text-[hsl(var(--dark-2))] mr-1" size={16} />
              ) : (
                <ChevronRight className="text-[hsl(var(--dark-2))] mr-1" size={16} />
              )}
              <Folder className="text-[hsl(var(--dark-2))] mr-2" size={16} />
              <span className={`text-sm ${isActive ? 'text-white' : 'text-[hsl(var(--dark-1))]'}`}>{file.name}</span>
            </>
          ) : (
            <>
              <FileText className="text-[hsl(var(--dark-2))] mr-2" size={16} />
              <span className={`text-sm ${isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--dark-1))]'}`}>{file.name}</span>
            </>
          )}
        </div>
        
        {isFolder && isExpanded && file.children && file.children.length > 0 && (
          <div>
            {file.children.map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-64 bg-[hsl(var(--dark-8))] flex flex-col border-r border-[hsl(var(--dark-7))]">
      {/* Workspace Header */}
      <div className="p-4 border-b border-[hsl(var(--dark-7))] flex items-center">
        <h2 className="font-semibold text-white">Documents</h2>
        <button 
          className="ml-auto text-[hsl(var(--dark-2))] hover:text-white"
          onClick={() => createDocument("New Document.md")}
        >
          <Plus size={18} />
        </button>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {documents.map(doc => renderFile(doc))}
      </div>
    </div>
  );
};

export default FileTree;
