import { User, Mic, Headphones, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = () => {
  return (
    <div className="p-3 bg-[hsl(var(--discord-10))] border-t border-gray-700/50 flex items-center">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarFallback className="bg-green-600 text-white">U</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-white">User</div>
        <div className="text-xs text-[hsl(var(--dark-2))]">Online</div>
      </div>
      
      <div className="flex space-x-2 text-[hsl(var(--dark-2))]">
        <button className="hover:text-white">
          <Mic size={16} />
        </button>
        <button className="hover:text-white">
          <Headphones size={16} />
        </button>
        <button className="hover:text-white">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;