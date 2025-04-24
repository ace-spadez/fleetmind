import { createContext, useContext, useState, ReactNode } from "react";
import { Module, ChatData, File, TreeNode } from "../types";
import { mockChats } from "../data/mockChats";
import { mockDocuments } from "../data/mockDocuments";
import { mockCode } from "../data/mockCode";

interface WorkspaceContextType {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  chats: ChatData[];
  addMessage: (channelId: string, content: string, isBotMessage: boolean) => void;
  documents: File[];
  setDocuments: (documents: File[]) => void;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  updateDocumentContent: (id: string, content: string) => void;
  createDocument: (name: string, parentId?: string) => void;
  codeFiles: TreeNode[];
  setCodeFiles: (files: TreeNode[]) => void;
  activeCodeFileId: string | null;
  setActiveCodeFileId: (id: string | null) => void;
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

  return (
    <WorkspaceContext.Provider 
      value={{
        activeModule,
        setActiveModule,
        activeChannelId,
        setActiveChannelId,
        chats,
        addMessage,
        documents,
        setDocuments,
        activeDocumentId,
        setActiveDocumentId,
        updateDocumentContent,
        createDocument,
        codeFiles,
        setCodeFiles,
        activeCodeFileId,
        setActiveCodeFileId
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
