import { useWorkspace } from "@/context/WorkspaceProvider";
import { Channel } from "@/types";
import { ChevronDown, Plus, Mic, Headphones, Settings } from "lucide-react";
import UserProfile from "./UserProfile";

const ChannelList = () => {
  const { activeChannelId, setActiveChannelId } = useWorkspace();

  const primaryChannels: Channel[] = [
    { 
      id: "clever-fox-3721", 
      name: "clever-fox-3721", 
      type: "primary", 
      active: activeChannelId === "clever-fox-3721", 
      botType: "Assistant AI", 
      isActive: true 
    },
    { 
      id: "swift-eagle-9042", 
      name: "swift-eagle-9042", 
      type: "primary", 
      active: activeChannelId === "swift-eagle-9042", 
      botType: "Code Helper AI", 
      isActive: false 
    },
    { 
      id: "creative-owl-7238", 
      name: "creative-owl-7238", 
      type: "primary", 
      active: activeChannelId === "creative-owl-7238", 
      botType: "Design AI", 
      isActive: true 
    },
    { 
      id: "precise-deer-5190", 
      name: "precise-deer-5190", 
      type: "primary", 
      active: activeChannelId === "precise-deer-5190", 
      botType: "Data Analyst AI", 
      isActive: false 
    },
  ];

  const directiveChannels: Channel[] = [
    { 
      id: "code-to-design", 
      name: "swift-eagle-9042 → creative-owl-7238", 
      type: "directive", 
      active: activeChannelId === "code-to-design" 
    },
    { 
      id: "design-to-deploy", 
      name: "creative-owl-7238 → clever-fox-3721", 
      type: "directive", 
      active: activeChannelId === "design-to-deploy" 
    },
    { 
      id: "dev-to-analytics", 
      name: "swift-eagle-9042 → precise-deer-5190", 
      type: "directive", 
      active: activeChannelId === "dev-to-analytics" 
    },
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
                <div className="relative mr-2">
                  {channel.isActive ? (
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400/50 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">{channel.name}</span>
                  <span className="text-xs text-gray-400">{channel.botType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-[hsl(var(--dark-2))] px-2 py-1 uppercase flex items-center">
            <span>Directive Buses</span>
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
                <div className="relative mr-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-xs">{channel.name}</span>
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
