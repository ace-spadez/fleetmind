import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceProvider';

type BotNodeData = {
  label: string;
  role: string;
  description?: string;
  id: string;
};

const BotNode = ({ data, selected, id }: NodeProps<BotNodeData>) => {
  const { label, role } = data;
  const { activeBotId } = useWorkspace();
  const [isActive, setIsActive] = useState(false);
  
  // Randomly determine if this node is active (for the pulsating effect)
  useEffect(() => {
    setIsActive(Math.random() > 0.5);
  }, []);
  
  return (
    <div 
      className={`px-4 py-3 rounded-lg border shadow-lg min-w-[180px] bg-gray-800/90 backdrop-blur-sm relative transition-all duration-300 ${
        selected ? 'border-orange-500' : activeBotId === id ? 'border-primary shadow-primary/20' : 'border-gray-700'
      }`}
    >
      {/* Status indicator */}
      <div className="absolute -top-2 -right-2 flex items-center justify-center">
        {isActive ? (
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400/50 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-5 h-5 bg-green-300/30 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
        )}
      </div>
      
      {/* Active border effect */}
      {activeBotId === id && (
        <div className="absolute inset-0 rounded-lg border border-primary/50 animate-pulse pointer-events-none"></div>
      )}
      
      {/* Top handle - for directive bus */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '35%', background: '#ef4444', width: '8px', height: '8px' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '35%', background: '#ef4444', width: '8px', height: '8px' }}
        isConnectable={true}
      />
      
      {/* Bottom handle - for communications */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '75%', background: '#9ca3af', width: '8px', height: '8px' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '75%', background: '#9ca3af', width: '8px', height: '8px' }}
        isConnectable={true}
      />
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
          <Bot size={22} className="text-white" />
        </div>
        <div className="text-white font-medium text-sm">{label}</div>
        <div className="text-gray-300 text-xs uppercase mt-1 font-semibold tracking-wide">{role}</div>
      </div>
    </div>
  );
};

export default memo(BotNode);