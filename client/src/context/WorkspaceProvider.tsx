import { createContext, useContext, useState, ReactNode } from "react";
import { 
  Module, 
  ChatData, 
  File, 
  TreeNode, 
  Message, 
  OrgBot, 
  BotConnection,
  EditorLayout,
  EditorPane,
  EditorTab
} from "../types";
import { mockChats } from "../data/mockChats";
import { mockDocuments } from "../data/mockDocuments";
import { mockCode } from "../data/mockCode";
import { mockOrgBots } from "../data/mockOrgBots";
import { mockOrgConnections } from "../data/mockOrgConnections";

interface WorkspaceContextType {
  // General workspace
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  
  // Chat module
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  chats: ChatData[];
  addMessage: (channelId: string, content: string, isBotMessage: boolean) => void;
  
  // Document module
  documents: File[];
  setDocuments: (documents: File[]) => void;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  updateDocumentContent: (id: string, content: string) => void;
  createDocument: (name: string, parentId?: string) => void;
  
  // Code editor module
  codeFiles: TreeNode[];
  setCodeFiles: (files: TreeNode[]) => void;
  activeCodeFileId: string | null;
  setActiveCodeFileId: (id: string | null) => void;
  updateCodeFileContent: (fileId: string, content: string) => void;
  
  // VSCode-style editor features
  editorLayout: EditorLayout;
  openFileInEditor: (fileId: string, fileName: string, filePath: string, paneId?: string) => void;
  closeEditorTab: (tabId: string, paneId: string) => void;
  setActiveEditorTab: (tabId: string, paneId: string) => void;
  splitEditorPane: (direction: 'horizontal' | 'vertical', sourceTabId: string) => void;
  closeEditorPane: (paneId: string) => void;
  resizeEditorPanes: (sizes: number[]) => void;
  moveTabToPane: (tabId: string, sourcePaneId: string, targetPaneId: string) => void;
  
  // Organization module
  orgBots: OrgBot[];
  setOrgBots: (bots: OrgBot[]) => void;
  orgConnections: BotConnection[];
  setOrgConnections: (connections: BotConnection[]) => void;
  activeBotId: string | null;
  setActiveBotId: (id: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  console.log("WorkspaceProvider initialized");
  
  const [activeModule, setActiveModule] = useState<Module>("chat");
  const [activeChannelId, setActiveChannelId] = useState<string>("assistant-bot");
  const [chats, setChats] = useState<ChatData[]>(mockChats);
  const [documents, setDocuments] = useState<File[]>(mockDocuments);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>("overview");
  const [codeFiles, setCodeFiles] = useState<TreeNode[]>(mockCode);
  const [activeCodeFileId, setActiveCodeFileId] = useState<string | null>("solarsystem");
  
  // Code editor state - VSCode style with multiple panes and tabs
  const [editorLayout, setEditorLayout] = useState<EditorLayout>({
    direction: 'horizontal',
    panes: [
      {
        id: 'main-pane',
        tabs: [],
        activeTabId: null,
        size: 1  // Default flex size
      }
    ]
  });
  
  // Organization state
  const [orgBots, setOrgBots] = useState<OrgBot[]>(mockOrgBots);
  const [orgConnections, setOrgConnections] = useState<BotConnection[]>(mockOrgConnections);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);

  const addMessage = (channelId: string, content: string, isBotMessage: boolean) => {
    setChats(prev => {
      const channelIndex = prev.findIndex(chat => chat.channelId === channelId);
      
      // Create the message with proper type safety
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: isBotMessage ? 'bot' : 'user',
        timestamp: new Date(),
        userName: 'User',
        botName: 'AssistantBot'
      };
      
      if (channelIndex === -1) {
        return [...prev, {
          channelId,
          messages: [newMessage]
        }];
      }
      
      const updatedChat = {
        ...prev[channelIndex],
        messages: [
          ...prev[channelIndex].messages,
          newMessage
        ]
      };
      
      const newChats = [...prev];
      newChats[channelIndex] = updatedChat;
      
      return newChats;
    });
  };

  const updateDocumentContent = (id: string, content: string) => {
    const updateContent = (docs: File[]): File[] => {
      return docs.map(doc => {
        if (doc.id === id) {
          return { ...doc, content };
        }
        if (doc.children) {
          return { ...doc, children: updateContent(doc.children) };
        }
        return doc;
      });
    };
    
    setDocuments(prev => updateContent(prev));
  };

  const createDocument = (name: string, parentId?: string) => {
    const newDoc: File = {
      id: Date.now().toString(),
      name,
      type: name.includes('.') ? 'file' : 'folder',
      content: name.includes('.') ? '' : undefined,
      children: name.includes('.') ? undefined : [],
      extension: name.includes('.') ? name.split('.').pop() : undefined
    };
    
    const insertDocument = (docs: File[]): File[] => {
      if (!parentId) {
        return [...docs, newDoc];
      }
      
      return docs.map(doc => {
        if (doc.id === parentId) {
          return {
            ...doc,
            children: [...(doc.children || []), { ...newDoc, parentId }]
          };
        }
        if (doc.children) {
          return { ...doc, children: insertDocument(doc.children) };
        }
        return doc;
      });
    };
    
    setDocuments(prev => insertDocument(prev));
  };

  // Function to update code file content
  const updateCodeFileContent = (fileId: string, content: string) => {
    const updateContent = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === fileId) {
          return { ...node, content };
        }
        if (node.children) {
          return { ...node, children: updateContent(node.children) };
        }
        return node;
      });
    };
    
    setCodeFiles(prev => updateContent(prev));
  };

  // Function to find a node in the tree by ID
  const findFileNodeById = (id: string): TreeNode | undefined => {
    const find = (nodes: TreeNode[]): TreeNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children?.length) {
          const found = find(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return find(codeFiles);
  };

  // Open file in the editor and create a tab
  const openFileInEditor = (fileId: string, fileName: string, filePath: string, paneId?: string) => {
    // Use the first pane if no pane is specified
    const targetPaneId = paneId || editorLayout.panes[0].id;
    
    // Generate a unique tab ID
    const tabId = `tab-${Date.now()}`;
    
    setEditorLayout(prev => {
      // Create a new tab
      const newTab: EditorTab = {
        id: tabId,
        fileId,
        fileName,
        filePath,
        active: true,
      };
      
      // Update the panes - deactivate all other tabs in the target pane
      const updatedPanes = prev.panes.map(pane => {
        if (pane.id === targetPaneId) {
          // Check if this file is already open in a tab
          const existingTabIndex = pane.tabs.findIndex(tab => tab.fileId === fileId);
          
          if (existingTabIndex >= 0) {
            // File is already open, just activate it
            return {
              ...pane,
              tabs: pane.tabs.map(tab => ({
                ...tab,
                active: tab.fileId === fileId,
              })),
              activeTabId: pane.tabs[existingTabIndex].id,
            };
          }
          
          // Otherwise add a new tab
          return {
            ...pane,
            tabs: [
              ...pane.tabs.map(tab => ({ ...tab, active: false })),
              newTab,
            ],
            activeTabId: tabId,
          };
        }
        
        // Other panes remain unchanged
        return pane;
      });
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
    
    // Also set the active code file in the sidebar
    setActiveCodeFileId(fileId);
  };

  // Close a tab in the editor
  const closeEditorTab = (tabId: string, paneId: string) => {
    setEditorLayout(prev => {
      // Find the pane
      const paneIndex = prev.panes.findIndex(p => p.id === paneId);
      if (paneIndex === -1) return prev;
      
      const pane = prev.panes[paneIndex];
      
      // Find the tab
      const tabIndex = pane.tabs.findIndex(t => t.id === tabId);
      if (tabIndex === -1) return prev;
      
      // Determine the new active tab if closing the active one
      let newActiveTabId = pane.activeTabId;
      
      if (pane.activeTabId === tabId) {
        // If closing active tab, activate the next tab, or the previous if there's no next
        if (tabIndex < pane.tabs.length - 1) {
          newActiveTabId = pane.tabs[tabIndex + 1].id;
        } else if (tabIndex > 0) {
          newActiveTabId = pane.tabs[tabIndex - 1].id;
        } else {
          newActiveTabId = null;
        }
      }
      
      // Create updated tabs for the pane
      const updatedTabs = pane.tabs.filter(t => t.id !== tabId);
      
      // Activate the new tab
      if (newActiveTabId) {
        updatedTabs.forEach(tab => {
          tab.active = tab.id === newActiveTabId;
        });
      }
      
      // Update the pane
      const updatedPane = {
        ...pane,
        tabs: updatedTabs,
        activeTabId: newActiveTabId,
      };
      
      // Update all panes
      const updatedPanes = [...prev.panes];
      updatedPanes[paneIndex] = updatedPane;
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
  };

  // Set active tab in a pane
  const setActiveEditorTab = (tabId: string, paneId: string) => {
    setEditorLayout(prev => {
      // Update the panes
      const updatedPanes = prev.panes.map(pane => {
        if (pane.id === paneId) {
          // Find the tab
          const tab = pane.tabs.find(t => t.id === tabId);
          if (!tab) return pane;
          
          // Set active tab in the sidebar
          setActiveCodeFileId(tab.fileId);
          
          // Update the pane with the new active tab
          return {
            ...pane,
            tabs: pane.tabs.map(t => ({ ...t, active: t.id === tabId })),
            activeTabId: tabId,
          };
        }
        return pane;
      });
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
  };

  // Split an editor pane
  const splitEditorPane = (direction: 'horizontal' | 'vertical', sourceTabId: string) => {
    setEditorLayout(prev => {
      // Find the pane containing the source tab
      const sourcePaneIndex = prev.panes.findIndex(
        pane => pane.tabs.some(tab => tab.id === sourceTabId)
      );
      
      if (sourcePaneIndex === -1) return prev;
      
      const sourcePane = prev.panes[sourcePaneIndex];
      const sourceTab = sourcePane.tabs.find(tab => tab.id === sourceTabId);
      
      if (!sourceTab) return prev;
      
      // Create a new pane
      const newPaneId = `pane-${Date.now()}`;
      const newTabId = `tab-${Date.now()}`;
      
      // Create a new tab for the new pane, copied from the source tab
      const newTab: EditorTab = {
        id: newTabId,
        fileId: sourceTab.fileId,
        fileName: sourceTab.fileName,
        filePath: sourceTab.filePath,
        active: true,
      };
      
      const newPane: EditorPane = {
        id: newPaneId,
        tabs: [newTab],
        activeTabId: newTabId,
        size: 1,
      };
      
      // Recalculate sizes for all panes
      const totalPanes = prev.panes.length + 1;
      const equalSize = 1 / totalPanes;
      
      const updatedPanes = prev.panes.map(pane => ({
        ...pane,
        size: equalSize,
      }));
      
      // Add the new pane
      updatedPanes.splice(sourcePaneIndex + 1, 0, {
        ...newPane, 
        size: equalSize,
      });
      
      return {
        direction, // Update the layout direction based on the split
        panes: updatedPanes,
      };
    });
  };

  // Close an editor pane
  const closeEditorPane = (paneId: string) => {
    setEditorLayout(prev => {
      // Can't close if there's only one pane
      if (prev.panes.length <= 1) return prev;
      
      // Remove the pane
      const updatedPanes = prev.panes.filter(pane => pane.id !== paneId);
      
      // Redistribute sizes
      const equalSize = 1 / updatedPanes.length;
      updatedPanes.forEach(pane => {
        pane.size = equalSize;
      });
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
  };

  // Resize editor panes
  const resizeEditorPanes = (sizes: number[]) => {
    setEditorLayout(prev => {
      if (sizes.length !== prev.panes.length) return prev;
      
      const updatedPanes = prev.panes.map((pane, index) => ({
        ...pane,
        size: sizes[index],
      }));
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
  };

  // Move a tab from one pane to another
  const moveTabToPane = (tabId: string, sourcePaneId: string, targetPaneId: string) => {
    setEditorLayout(prev => {
      // Find the source pane
      const sourcePaneIndex = prev.panes.findIndex(p => p.id === sourcePaneId);
      if (sourcePaneIndex === -1) return prev;
      
      // Find the target pane
      const targetPaneIndex = prev.panes.findIndex(p => p.id === targetPaneId);
      if (targetPaneIndex === -1) return prev;
      
      // Find the tab
      const sourcePane = prev.panes[sourcePaneIndex];
      const tabIndex = sourcePane.tabs.findIndex(t => t.id === tabId);
      if (tabIndex === -1) return prev;
      
      // Get the tab to move
      const tabToMove = sourcePane.tabs[tabIndex];
      
      // Remove tab from source pane
      const updatedSourceTabs = sourcePane.tabs.filter(t => t.id !== tabId);
      
      // Determine new active tab in source pane
      let newSourceActiveTabId = sourcePane.activeTabId;
      if (sourcePane.activeTabId === tabId) {
        if (updatedSourceTabs.length > 0) {
          newSourceActiveTabId = updatedSourceTabs[0].id;
          updatedSourceTabs[0].active = true;
        } else {
          newSourceActiveTabId = null;
        }
      }
      
      // Update source pane
      const updatedSourcePane = {
        ...sourcePane,
        tabs: updatedSourceTabs,
        activeTabId: newSourceActiveTabId,
      };
      
      // Update target pane - add the tab and make it active
      const targetPane = prev.panes[targetPaneIndex];
      const updatedTargetTabs = [
        ...targetPane.tabs.map(t => ({ ...t, active: false })),
        { ...tabToMove, active: true },
      ];
      
      const updatedTargetPane = {
        ...targetPane,
        tabs: updatedTargetTabs,
        activeTabId: tabToMove.id,
      };
      
      // Update panes array
      const updatedPanes = [...prev.panes];
      updatedPanes[sourcePaneIndex] = updatedSourcePane;
      updatedPanes[targetPaneIndex] = updatedTargetPane;
      
      return {
        ...prev,
        panes: updatedPanes,
      };
    });
  };

  return (
    <WorkspaceContext.Provider 
      value={{
        // General workspace
        activeModule,
        setActiveModule,
        
        // Chat module
        activeChannelId,
        setActiveChannelId,
        chats,
        addMessage,
        
        // Document module
        documents,
        setDocuments,
        activeDocumentId,
        setActiveDocumentId,
        updateDocumentContent,
        createDocument,
        
        // Code editor basic state
        codeFiles,
        setCodeFiles,
        activeCodeFileId,
        setActiveCodeFileId,
        updateCodeFileContent,
        
        // VSCode-style editor features
        editorLayout,
        openFileInEditor,
        closeEditorTab,
        setActiveEditorTab,
        splitEditorPane,
        closeEditorPane,
        resizeEditorPanes,
        moveTabToPane,
        
        // Organization module
        orgBots,
        setOrgBots,
        orgConnections,
        setOrgConnections,
        activeBotId,
        setActiveBotId
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
