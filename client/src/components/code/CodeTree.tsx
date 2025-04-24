import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { TreeNode } from "@/types";
import { ChevronDown, ChevronRight, Folder, FileCode, FileJson, File, GitBranch, Plus } from "lucide-react";

type CodeTreeProps = {
  codeFiles: TreeNode[];
  onFileClick?: (file: TreeNode) => void;
};

const CodeTree = ({ codeFiles, onFileClick }: CodeTreeProps) => {
  const { activeCodeFileId, setActiveCodeFileId, openFileInEditor } = useWorkspace();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "components": true
  });
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) {
      return <FileJson className="text-yellow-400/80 mr-2" size={16} />;
    } else if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <FileCode className="text-blue-400/80 mr-2" size={16} />;
    } else {
      return <File className="text-[hsl(var(--dark-2))] mr-2" size={16} />;
    }
  };
  
  const handleFileClick = (node: TreeNode) => {
    // Set active file in the sidebar
    setActiveCodeFileId(node.id);
    
    // Use callback if provided (for custom behavior)
    if (onFileClick) {
      onFileClick(node);
    } else {
      // Default behavior: open in the editor
      openFileInEditor(node.id, node.name, node.path);
    }
  };
  
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.id];
    const isActive = node.id === activeCodeFileId;
    
    return (
      <div key={node.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-[hsl(var(--dark-7))] cursor-pointer group
            ${isActive && !isFolder ? 'bg-[hsl(var(--dark-7))]' : ''}`}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.id);
            } else {
              handleFileClick(node);
            }
          }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="text-[hsl(var(--dark-2))]  group-hover:text-white mr-1" size={16} />
              ) : (
                <ChevronRight className="text-[hsl(var(--dark-2))] group-hover:text-white mr-1" size={16} />
              )}
              <Folder className="text-yellow-500/70 group-hover:text-yellow-500 mr-2" size={16} />
              <span className={`text-sm ${isActive ? 'text-white' : 'text-[hsl(var(--dark-1))]'}`}>{node.name}</span>
            </>
          ) : (
            <>
              <div className="ml-4">
                {getFileIcon(node.name)}
              </div>
              <span className={`text-sm ${isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--dark-1))]'}`}>{node.name}</span>
            </>
          )}
        </div>
        
        {isFolder && isExpanded && node.children && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-64 bg-[hsl(var(--dark-8))] flex flex-col border-r border-gray-700/50 flex-shrink-0">
      {/* Repository Header */}
      <div className="p-3 border-b border-gray-700/50 flex items-center">
        <h2 className="font-medium text-white text-sm">EXPLORER</h2>
        <button className="ml-auto text-[hsl(var(--dark-2))] hover:text-white">
          <Plus size={16} />
        </button>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-1">
        {codeFiles.map(file => renderNode(file))}
      </div>
    </div>
  );
};

export default CodeTree;
