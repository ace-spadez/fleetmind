import ChannelList from "./ChannelList";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import UserProfile from "./UserProfile";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { Hash, Users, Bell, Pin, Search } from "lucide-react";

const ChatModule = () => {
  const { activeChannelId, chats } = useWorkspace();
  
  const activeChat = chats.find(chat => chat.channelId === activeChannelId);
  
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat Channels List */}
      <ChannelList />
      
      {/* Chat Content */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--discord-6))]">
        {/* Chat Header */}
        <div className="h-14 border-b border-[hsl(var(--dark-7))] flex items-center px-4">
          <div className="flex items-center">
            <Hash className="text-[hsl(var(--dark-2))] mr-2" size={18} />
            <h3 className="font-medium text-white">{activeChannelId}</h3>
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
        
        {/* Chat Messages */}
        <ChatMessages messages={activeChat?.messages || []} />
        
        {/* Chat Input */}
        <ChatInput channelId={activeChannelId} />
      </div>
    </div>
  );
};

export default ChatModule;
