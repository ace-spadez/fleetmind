import React from 'react';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useLocation } from 'wouter';

const AppContainer: React.FC = () => {
  const { isOpen, close } = useCommandPalette();
  const [, navigate] = useLocation();

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
    },
    
    // System commands
    { 
      id: 'toggle-theme', 
      name: 'Toggle Dark/Light Mode', 
      action: () => console.log('Toggle theme') 
    }
  ];

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative">
      {/* Other app components would go here */}
      <CommandPalette 
        isOpen={isOpen} 
        onClose={close} 
        commands={commands} 
      />
    </div>
  );
};

export default AppContainer; 