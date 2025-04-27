import { useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import Sidebar from "@/components/layout/Sidebar";
import ChatModule from "@/components/chat/ChatModule";
import DocumentationModule from "@/components/documentation/DocumentationModule";
import CodeModule from "@/components/code/CodeModule";
import TaskModule from "@/components/task/TaskModule";
import OrganizationModule from "@/components/organization/OrganizationModule";
import { Module } from "@/types";
import CommandPalette from "@/components/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useLocation } from "wouter";

interface HomeProps {
  initialModule?: Module;
}

export default function Home({ initialModule }: HomeProps) {
  const { activeModule, setActiveModule } = useWorkspace();
  const { isOpen, close } = useCommandPalette();
  const [, navigate] = useLocation();
  
  // Set the active module from the URL when the component mounts
  useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule, activeModule, setActiveModule]);

  // We're using the unified CodeModule for chat, code and docs
  const shouldUseCodeModule = (module: Module) => 
    module === "code" || module === "chat" || module === "docs";

  const commands = [
    // Navigation commands
    { 
      id: 'goto-home', 
      name: 'Go to Dashboard', 
      shortcut: '⌘D', 
      action: () => navigate('/') 
    },
    { 
      id: 'goto-chat', 
      name: 'Go to Chat', 
      shortcut: '⌘1', 
      action: () => navigate('/chat') 
    },
    { 
      id: 'goto-docs', 
      name: 'Go to Documentation', 
      shortcut: '⌘2', 
      action: () => navigate('/docs') 
    },
    { 
      id: 'goto-code', 
      name: 'Go to Code Editor', 
      shortcut: '⌘3', 
      action: () => navigate('/code') 
    },
    { 
      id: 'goto-organization', 
      name: 'Go to Organization', 
      shortcut: '⌘4', 
      action: () => navigate('/organization') 
    },
    
    // Action commands
    { 
      id: 'new-chat', 
      name: 'New Chat', 
      shortcut: '⌘N', 
      action: () => console.log('Create new chat') 
    },
    { 
      id: 'settings', 
      name: 'Open Settings', 
      shortcut: '⌘,', 
      action: () => navigate('/settings') 
    },
    
    // Help commands
    { 
      id: 'help', 
      name: 'Help & Documentation', 
      shortcut: '⌘?', 
      action: () => window.open('https://docs.fleetmind.io', '_blank') 
    }
  ];

  return (
    <>
      <div className="h-screen flex overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden">
          {shouldUseCodeModule(activeModule) ? (
            <CodeModule />
          ) : activeModule === "organization" ? (
            <OrganizationModule />
          ) : activeModule === "task" ? (
            <TaskModule isActiveModule={true} />
          ) : activeModule === "home" ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Workspace</h1>
                <p className="text-muted-foreground mb-6">Select a module from the sidebar to get started</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">This module is under development</h1>
                <p className="text-muted-foreground">Please check back later</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CommandPalette 
        isOpen={isOpen} 
        onClose={close} 
        commands={commands} 
      />
    </>
  );
}
