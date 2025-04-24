import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceProvider";
import { PlusCircle, Gift, SmilePlus } from "lucide-react";

type ChatInputProps = {
  channelId: string;
};

const ChatInput = ({ channelId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { addMessage } = useWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      addMessage(channelId, message, false);
      
      // Simulate bot response
      setTimeout(() => {
        let botResponse = "Thanks for your message! I'm here to help with any questions you have.";
        
        if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
          botResponse = "Hello there! How can I assist you today?";
        } else if (message.toLowerCase().includes("help")) {
          botResponse = "I'd be happy to help! Could you please provide more details about what you need assistance with?";
        } else if (message.toLowerCase().includes("code") || message.toLowerCase().includes("programming")) {
          botResponse = "I can help with coding questions! What programming language or framework are you working with?";
        }
        
        addMessage(channelId, botResponse, true);
      }, 1000);
      
      setMessage("");
    }
  };

  return (
    <div className="p-4 border-t border-[hsl(var(--dark-7))]">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input 
            type="text" 
            placeholder={`Message #${channelId}`} 
            className="bg-[hsl(var(--discord-7))] rounded-md text-[hsl(var(--dark-1))] py-2.5 px-4 w-full focus:outline-none focus:ring-1 focus:ring-primary pr-28"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="absolute right-2 top-2 flex space-x-1.5">
            <button type="button" className="text-[hsl(var(--dark-2))] hover:text-white">
              <PlusCircle size={20} />
            </button>
            <button type="button" className="text-[hsl(var(--dark-2))] hover:text-white">
              <Gift size={20} />
            </button>
            <button type="button" className="text-[hsl(var(--dark-2))] hover:text-white">
              <SmilePlus size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
