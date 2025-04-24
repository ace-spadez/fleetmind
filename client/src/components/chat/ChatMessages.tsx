import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { Bot } from "lucide-react";

type ChatMessagesProps = {
  messages: Message[];
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      {messages.map((message) => (
        <div key={message.id} className="flex">
          <div 
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
              message.sender === 'bot' 
                ? 'bg-[hsl(var(--secondary))]' 
                : 'bg-[hsl(var(--primary))]'
            }`}
          >
            {message.sender === 'bot' ? (
              <Bot size={20} />
            ) : (
              <span className="font-medium">U</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className={`font-medium ${
                message.sender === 'bot' 
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-white'
              }`}>
                {message.sender === 'bot' ? (message.botName || 'Bot') : (message.userName || 'User')}
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
