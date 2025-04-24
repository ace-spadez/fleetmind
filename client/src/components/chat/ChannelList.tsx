import { useWorkspace } from "@/context/WorkspaceProvider";
import { Channel } from "@/types";
import { ChevronDown, Plus, Mic, Headphones, Settings } from "lucide-react";
import UserProfile from "./UserProfile";

const ChannelList = () => {
  const { activeChannelId, setActiveChannelId } = useWorkspace();

  const primaryChannels: Channel[] = [
    { id: "assistant-bot", name: "assistant-bot", type: "primary", active: activeChannelId === "assistant-bot" },
    { id: "code-helper", name: "code-helper", type: "primary", active: activeChannelId === "code-helper" },
    { id: "design-bot", name: "design-bot", type: "primary", active: activeChannelId === "design-bot" },
    { id: "data-analyst", name: "data-analyst", type: "primary", active: activeChannelId === "data-analyst" },
  ];

  const directiveChannels: Channel[] = [
    { id: "code-to-design", name: "code-to-design", type: "directive", active: activeChannelId === "code-to-design" },
    { id: "design-to-deploy", name: "design-to-deploy", type: "directive", active: activeChannelId === "design-to-deploy" },
    { id: "dev-to-analytics", name: "dev-to-analytics", type: "directive", active: activeChannelId === "dev-to-analytics" },
  ];

  const handleChannelClick = (channelId: string) => {
    setActiveChannelId(channelId);
  };

  return (
    <div className="w-64 bg-[hsl(var(--discord-9))] flex flex-col border-r border-gray-700/50">
      {/* Server/Workspace Name */}
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <h2 className="font-semibold text-white">Workspace</h2>
        <ChevronDown className="ml-auto text-[hsl(var(--dark-2))]" size={18} />
      </div>
      
      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="text-xs font-semibold text-[hsl(var(--dark-2))] px-2 py-1 uppercase flex items-center">
            <span>Primary Bots</span>
            <Plus className="ml-auto" size={14} />
          </div>
          
          <div className="space-y-1">
            {primaryChannels.map((channel) => (
              <div 
                key={channel.id}
                className={`px-2 py-1 rounded ${channel.active 
                  ? 'bg-[hsl(var(--discord-7))] text-white' 
                  : 'text-[hsl(var(--dark-2))] hover:text-white hover:bg-[hsl(var(--discord-8))]'} 
                  flex items-center cursor-pointer`}
                onClick={() => handleChannelClick(channel.id)}
              >
                <span>#</span>
                <span className="ml-1">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-[hsl(var(--dark-2))] px-2 py-1 uppercase flex items-center">
            <span>Directive Buses</span>
            <Plus className="ml-auto" size={14} />
          </div>
          
          <div className="space-y-1">
            {directiveChannels.map((channel) => (
              <div 
                key={channel.id}
                className={`px-2 py-1 rounded ${channel.active 
                  ? 'bg-[hsl(var(--discord-7))] text-white' 
                  : 'text-[hsl(var(--dark-2))] hover:text-white hover:bg-[hsl(var(--discord-8))]'} 
                  flex items-center cursor-pointer`}
                onClick={() => handleChannelClick(channel.id)}
              >
                <span>#</span>
                <span className="ml-1">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* User Profile */}
      <UserProfile />
    </div>
  );
};

export default ChannelList;
