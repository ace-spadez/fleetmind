import ChannelList from "./ChannelList";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import DirectiveBusChat from "./DirectiveBusChat";
import UserProfile from "./UserProfile";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { Hash, Users, Bell, Pin, Search, Zap } from "lucide-react";

const ChatModule = () => {
  const { activeChannelId, chats } = useWorkspace();
  
  const activeChat = chats.find(chat => chat.channelId === activeChannelId);
  
  // Check if this is a directive bus channel
  const isDirectiveBus = activeChannelId.includes('to-');
  
  // Extract source and target bot IDs for directive buses
  const getDirectiveBusInfo = () => {
    // Parse IDs from channel names like "code-to-design" or directive channel names
    if (activeChannelId === "code-to-design") {
      return { source: "swift-eagle-9042", target: "creative-owl-7238" };
    } else if (activeChannelId === "design-to-deploy") {
      return { source: "creative-owl-7238", target: "clever-fox-3721" };
    } else if (activeChannelId === "dev-to-analytics") {
      return { source: "swift-eagle-9042", target: "precise-deer-5190" };
    }
    return { source: "", target: "" };
  };
  
  const { source, target } = getDirectiveBusInfo();
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat Channels List */}
      <ChannelList />
      
      {/* Chat Content */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--discord-6))]">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-700/50 flex items-center px-4">
          <div className="flex items-center">
            {isDirectiveBus ? (
              <Zap className="text-red-400 mr-2" size={18} />
            ) : (
              <Hash className="text-[hsl(var(--dark-2))] mr-2" size={18} />
            )}
            <h3 className="font-medium text-white">{activeChannelId}</h3>
            {isDirectiveBus && (
              <span className="ml-2 text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">
                directive bus
              </span>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-3">
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Users size={18} />
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Bell size={18} />
            </button>
            <button className="text-[hsl(var(--dark-2))] hover:text-white">
              <Pin size={18} />
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[hsl(var(--dark-7))] text-[hsl(var(--dark-1))] text-sm rounded px-3 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute right-2 top-1.5 text-[hsl(var(--dark-2))]" size={16} />
            </div>
          </div>
        </div>
        
        {/* Content based on channel type */}
        {isDirectiveBus ? (
          /* Directive Bus Chat */
          <DirectiveBusChat 
            channelId={activeChannelId} 
            sourceBotId={source} 
            targetBotId={target} 
          />
        ) : (
          /* Regular Chat */
          <>
            <ChatMessages messages={activeChat?.messages || []} />
            <ChatInput channelId={activeChannelId} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModule;
