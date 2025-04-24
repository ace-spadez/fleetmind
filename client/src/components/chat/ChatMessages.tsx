import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Bot, 
  MessageSquareText, 
  Code, 
  Search, 
  FileText, 
  Play, 
  StopCircle, 
  Terminal, 
  FileEdit, 
  Database, 
  ArrowRight, 
  RefreshCw,
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatMessagesProps = {
  messages: Message[];
};

type GenerationStep = {
  text: string;
  complete: boolean;
  type: 'thinking' | 'output' | 'action' | 'link';
  action?: string;
  icon?: React.ReactNode;
};

type GenerationAction = 'code' | 'search' | 'file' | 'database' | 'api';

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState("");
  const [generationType, setGenerationType] = useState<GenerationAction>("code");
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  
  // Simulate more advanced bot generation for active channels
  useEffect(() => {
    // Only attempt generation if the last message is from a user
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const shouldGenerate = Math.random() > 0.3; // 70% chance of generating
      const userMessage = messages[messages.length - 1].content.toLowerCase();
      
      // Initialize generation
      setIsGenerating(shouldGenerate);
      setIsStopped(false);
      setElapsed(0);
      
      if (shouldGenerate) {
        // Determine type of generation based on user message content
        let generationType: GenerationAction = "code";
        
        if (userMessage.includes("search") || userMessage.includes("find") || userMessage.includes("look")) {
          generationType = "search";
        } else if (userMessage.includes("file") || userMessage.includes("document") || userMessage.includes("save")) {
          generationType = "file";
        } else if (userMessage.includes("database") || userMessage.includes("data") || userMessage.includes("store")) {
          generationType = "database";
        } else if (userMessage.includes("api") || userMessage.includes("fetch") || userMessage.includes("request")) {
          generationType = "api";
        }
        
        setGenerationType(generationType);
        
        // Create appropriate generation steps based on type
        let steps: GenerationStep[] = [];
        
        if (generationType === "code") {
          steps = [
            { text: "Analyzing request...", complete: true, type: 'thinking', icon: <RefreshCw size={14} className="text-blue-400 animate-spin" /> },
            { text: "Generating solution approach...", complete: true, type: 'thinking', icon: <Code size={14} className="text-blue-400" /> },
            { text: "Writing code implementation...", complete: false, type: 'thinking', icon: <Terminal size={14} className="text-green-400" /> },
            { text: "function processUserData(input) {\n  // Analyzing user request\n  const result = input.map(item => {\n    return transformData(item);\n  });\n  return result;\n}", complete: false, type: 'output' },
            { text: "Test with sample data", complete: false, type: 'action', action: 'run', icon: <Play size={14} className="text-green-500" /> }
          ];
        } else if (generationType === "search") {
          steps = [
            { text: "Formulating search query...", complete: true, type: 'thinking', icon: <Search size={14} className="text-blue-400" /> },
            { text: "Searching web for information...", complete: false, type: 'thinking', icon: <Globe size={14} className="text-blue-400" /> },
            { text: "Latest web development frameworks 2025:", complete: false, type: 'output' },
            { text: "1. Next.js 14.0 - Full-stack React framework", complete: false, type: 'link', action: 'open', icon: <ExternalLink size={14} className="text-blue-400" /> },
            { text: "2. SvelteKit 2.0 - Svelte meta-framework", complete: false, type: 'link', action: 'open', icon: <ExternalLink size={14} className="text-blue-400" /> }
          ];
        } else if (generationType === "file") {
          steps = [
            { text: "Analyzing file requirements...", complete: true, type: 'thinking', icon: <FileText size={14} className="text-blue-400" /> },
            { text: "Preparing file content...", complete: false, type: 'thinking', icon: <FileEdit size={14} className="text-amber-400" /> },
            { text: "# Project Architecture\n\n## Microservices Implementation\n\n* User Service\n* Payment Service\n* Notification Service", complete: false, type: 'output' },
            { text: "Save to project-architecture.md", complete: false, type: 'action', action: 'save', icon: <ArrowRight size={14} className="text-green-500" /> }
          ];
        } else if (generationType === "database") {
          steps = [
            { text: "Analyzing data schema...", complete: true, type: 'thinking', icon: <Database size={14} className="text-blue-400" /> },
            { text: "Generating query...", complete: false, type: 'thinking', icon: <Code size={14} className="text-blue-400" /> },
            { text: "SELECT u.name, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;", complete: false, type: 'output' },
            { text: "Execute query", complete: false, type: 'action', action: 'run', icon: <Play size={14} className="text-green-500" /> }
          ];
        } else if (generationType === "api") {
          steps = [
            { text: "Analyzing API requirements...", complete: true, type: 'thinking', icon: <Globe size={14} className="text-blue-400" /> },
            { text: "Formulating request...", complete: false, type: 'thinking', icon: <Code size={14} className="text-blue-400" /> },
            { text: "fetch('https://api.example.com/data', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    query: 'user data',\n    limit: 10\n  })\n})", complete: false, type: 'output' },
            { text: "Test API call", complete: false, type: 'action', action: 'run', icon: <Play size={14} className="text-green-500" /> }
          ];
        }
        
        setGenerationSteps(steps);
        
        // Initialize with first step complete
        let currentStep = 0;
        
        // Set up interval to simulate progressive completion of steps
        const interval = setInterval(() => {
          if (isStopped) {
            clearInterval(interval);
            return;
          }
          
          setElapsed(prev => prev + 1);
          
          // Every 2-3 seconds, complete another step
          if (elapsed % 3 === 0 && currentStep < steps.length - 1) {
            currentStep++;
            setGenerationSteps(prev => 
              prev.map((step, idx) => 
                idx <= currentStep ? { ...step, complete: true } : step
              )
            );
          }
          
          // After all steps are complete, stop generating
          if (currentStep >= steps.length - 1 && elapsed > steps.length * 3) {
            clearInterval(interval);
            setTimeout(() => setIsGenerating(false), 2000);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      }
    } else {
      setIsGenerating(false);
    }
  }, [messages, isStopped]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot size={48} className="mx-auto mb-4 text-[hsl(var(--primary))]" />
          <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
          <p className="text-[hsl(var(--dark-2))]">Start a conversation with this bot!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* User divider - greyed out line above user messages */}
      <div className="border-t border-gray-700/50 pt-2 -mt-2"></div>
      
      {messages.map((message) => (
        <div key={message.id} className="flex">
          <div 
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
              message.sender === 'bot' 
                ? 'bg-blue-900/30 border border-blue-500/30' 
                : 'bg-[hsl(var(--primary))]'
            }`}
          >
            {message.sender === 'bot' ? (
              <MessageSquareText size={18} className="text-blue-300" />
            ) : (
              <span className="font-medium">U</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className={`font-medium ${
                message.sender === 'bot' 
                  ? 'text-blue-400'
                  : 'text-white'
              }`}>
                {message.sender === 'bot' ? (message.botName || 'clever-fox-3721') : (message.userName || 'User')}
              </span>
              <span className="text-xs text-[hsl(var(--dark-3))] ml-2">
                {formatDate(message.timestamp)}
              </span>
            </div>
            <div className="mt-1 text-[hsl(var(--dark-1))]">
              {message.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Bot generating response UI - Elegant progressive steps */}
      {isGenerating && (
        <div className="flex">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-900/30 border border-blue-500/30">
            {generationType === "code" && <Code size={18} className="text-blue-300" />}
            {generationType === "search" && <Search size={18} className="text-blue-300" />}
            {generationType === "file" && <FileText size={18} className="text-blue-300" />}
            {generationType === "database" && <Database size={18} className="text-blue-300" />}
            {generationType === "api" && <Globe size={18} className="text-blue-300" />}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-blue-400">clever-fox-3721</span>
                <span className="ml-2 text-xs bg-blue-500/20 px-2 py-0.5 rounded text-blue-200 font-mono">
                  {generationType === "code" ? "coding" : 
                   generationType === "search" ? "searching" : 
                   generationType === "file" ? "editing file" :
                   generationType === "database" ? "querying db" : "calling api"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-red-950/30 text-red-400 hover:bg-red-900/30"
                  onClick={() => setIsStopped(true)}
                >
                  <StopCircle size={14} />
                </Button>
                {isStopped && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-green-950/30 text-green-400 hover:bg-green-900/30"
                    onClick={() => setIsStopped(false)}
                  >
                    <Play size={14} />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2 overflow-hidden rounded-md border border-gray-700/50">
              {/* Thinking and action steps */}
              <div className="bg-gray-800/30 p-2 space-y-1.5 border-b border-gray-700/50">
                {generationSteps.filter(step => step.type === 'thinking').map((step, index) => (
                  <div key={index} className="flex items-center text-xs gap-2">
                    <div className={`${step.complete ? 'text-green-400' : 'text-blue-400'} flex items-center`}>
                      {step.icon || <RefreshCw size={12} className={step.complete ? '' : 'animate-spin'} />}
                    </div>
                    <span className={`${step.complete ? 'text-green-300' : 'text-blue-300'}`}>
                      {step.text}
                    </span>
                    {!step.complete && <span className="animate-pulse">...</span>}
                  </div>
                ))}
              </div>
              
              {/* Output area */}
              {generationSteps.filter(step => step.type === 'output').map((step, index) => (
                <div key={index} className="p-3 bg-gray-900/50 text-gray-200 font-mono text-xs whitespace-pre-wrap">
                  {step.text}
                  {!step.complete && <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse"></span>}
                </div>
              ))}
              
              {/* Links and actions */}
              {generationSteps.filter(step => step.type === 'link' || step.type === 'action').length > 0 && (
                <div className="bg-gray-800/50 p-2 flex flex-wrap gap-2 border-t border-gray-700/50">
                  {generationSteps
                    .filter(step => step.type === 'link' || step.type === 'action')
                    .map((step, index) => (
                      <Button 
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-gray-900/50 hover:bg-gray-700/50 border-gray-700/50 flex items-center gap-1"
                      >
                        {step.icon}
                        <span>{step.text}</span>
                      </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
