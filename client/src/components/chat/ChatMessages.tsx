import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { Bot, MessageSquareText, Code, Search, FileText, Play, StopCircle } from "lucide-react";

type ChatMessagesProps = {
  messages: Message[];
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState("");
  const [generationType, setGenerationType] = useState<"code" | "search" | "file">("code");
  
  // Simulate bot generation for active channels
  useEffect(() => {
    // 70% chance of showing generation if last message is from user
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const shouldGenerate = Math.random() > 0.3;
      setIsGenerating(shouldGenerate);
      
      if (shouldGenerate) {
        // Randomly select the type of generation
        const types: ["code", "search", "file"] = ["code", "search", "file"];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        setGenerationType(selectedType);
        
        // Generate example text based on type
        if (selectedType === "code") {
          setGeneratingText("function processUserData(input) {\n  // Analyzing user request\n  const result = input.map(item => {\n    return transformData(item);\n  });\n  return result;\n}");
        } else if (selectedType === "search") {
          setGeneratingText("Searching for: 'latest web development frameworks 2025'...\nFound 5 relevant results\nAnalyzing data from top sources...");
        } else {
          setGeneratingText("Updating file: project-architecture.md\nAdding section on microservices implementation\nGenerating deployment diagram...");
        }
      }
    } else {
      setIsGenerating(false);
    }
  }, [messages]);

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
      
      {/* Bot generating response UI */}
      {isGenerating && (
        <div className="flex animate-pulse">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-900/30 border border-blue-500/30">
            {generationType === "code" && <Code size={18} className="text-blue-300" />}
            {generationType === "search" && <Search size={18} className="text-blue-300" />}
            {generationType === "file" && <FileText size={18} className="text-blue-300" />}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className="font-medium text-blue-400">clever-fox-3721</span>
              <span className="ml-2 text-xs bg-blue-500/20 px-2 py-0.5 rounded text-blue-200 font-mono">
                {generationType === "code" ? "generating code..." : 
                 generationType === "search" ? "searching..." : "editing file..."}
              </span>
            </div>
            <div className="mt-2 p-3 bg-gray-800/70 rounded border border-gray-700/50 text-gray-300 font-mono text-sm">
              {generatingText}
              <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
