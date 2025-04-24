import CodeTree from "./CodeTree";
import CodeEditor from "./CodeEditor";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { TreeNode } from "@/types";
import { FileCode, GitBranch, Settings } from "lucide-react";

const CodeModule = () => {
  const { codeFiles, activeCodeFileId } = useWorkspace();
  
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
  
  const activeFile = findFileById(codeFiles, activeCodeFileId);
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* File Tree */}
      <CodeTree codeFiles={codeFiles} />
      
      {/* Code Editor */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--dark-9))]">
        {/* Code Header */}
        {activeFile ? (
          <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
            <div className="flex items-center">
              <FileCode className="text-[hsl(var(--dark-2))] mr-2" size={18} />
              <h3 className="font-medium text-white">{activeFile.name}</h3>
            </div>
            
            <div className="ml-auto flex items-center space-x-3">
              <button className="text-[hsl(var(--dark-2))] hover:text-white">
                <GitBranch size={18} />
              </button>
              <button className="text-[hsl(var(--dark-2))] hover:text-white">
                <Settings size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
            <h3 className="font-medium text-white">No file selected</h3>
          </div>
        )}
        
        {/* Code Content */}
        {activeFile ? (
          <CodeEditor fileName={activeFile.name} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <FileCode size={48} className="mx-auto mb-4 text-[hsl(var(--dark-4))]" />
              <h2 className="text-xl font-semibold text-white mb-2">No file selected</h2>
              <p className="text-[hsl(var(--dark-3))]">Select a file from the sidebar to view and edit code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeModule;
