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
  Database,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatMessagesProps = {
  messages: Message[];
};

type GenerationType = "code" | "search" | "file" | "database" | "api";

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationType, setGenerationType] = useState<GenerationType>("code");
  const [generationText, setGenerationText] = useState("function processUserData(input) {\n  // Analyzing request\n  const result = input.map(item => {\n    return transformData(item);\n  });\n  return result;\n}");
  
  // Auto-generate content based on message content
  useEffect(() => {
    // Determine which type of generation to show
    const types: GenerationType[] = ["code", "search", "file", "database", "api"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setGenerationType(randomType);
    
    // Set sample generation text based on type
    if (randomType === "code") {
      setGenerationText("function processUserData(input) {\n  // Analyzing request\n  const result = input.map(item => {\n    return transformData(item);\n  });\n  return result;\n}");
    } else if (randomType === "search") {
      setGenerationText("Searching for: 'latest web development frameworks'\nFound results:\n1. Next.js 14.0\n2. SvelteKit 2.0\n3. Remix 2.0");
    } else if (randomType === "file") {
      setGenerationText("# Project Architecture\n\n## Microservices Implementation\n\n* User Service\n* Payment Service\n* Notification Service");
    } else if (randomType === "database") {
      setGenerationText("SELECT u.name, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;");
    } else {
      setGenerationText("fetch('https://api.example.com/data', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    query: 'user data',\n    limit: 10\n  })\n})");
    }
    
    // Always show generation in this component to demonstrate the functionality
    setIsGenerating(true);
  }, [messages]);

  // Scroll to bottom when messages change
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
      {/* Message history */}
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
      
      {/* Bot generating response UI */}
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
                >
                  <StopCircle size={14} />
                </Button>
              </div>
            </div>
            
            <div className="mt-2 overflow-hidden rounded-md border border-gray-700/50">
              {/* Thinking steps */}
              <div className="bg-gray-800/30 p-2 space-y-1.5 border-b border-gray-700/50">
                <div className="flex items-center text-xs gap-2">
                  <div className="text-green-400 flex items-center">
                    <Terminal size={14} />
                  </div>
                  <span className="text-green-300">
                    Analyzing requirements...
                  </span>
                </div>
                <div className="flex items-center text-xs gap-2">
                  <div className="text-blue-400 flex items-center">
                    <Code size={14} className="animate-spin" />
                  </div>
                  <span className="text-blue-300">
                    Generating solution...
                  </span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
              
              {/* Output area */}
              <div className="p-3 bg-gray-900/50 text-gray-200 font-mono text-xs whitespace-pre-wrap">
                {generationText}
                <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse"></span>
              </div>
              
              {/* Actions */}
              <div className="bg-gray-800/50 p-2 flex flex-wrap gap-2 border-t border-gray-700/50">
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-gray-900/50 hover:bg-gray-700/50 border-gray-700/50 flex items-center gap-1"
                >
                  <Play size={14} className="text-green-500" />
                  <span>Run code</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
