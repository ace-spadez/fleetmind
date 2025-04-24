import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';

type BotNodeData = {
  label: string;
  role: string;
  description?: string;
};

const BotNode = ({ data, isConnectable }: NodeProps<BotNodeData>) => {
  const { label, role } = data;
  
  return (
    <div className="px-4 py-2 rounded-md border border-gray-700 shadow-md min-w-[160px] bg-gray-800">
      {/* Top handle - for directive bus */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '35%', background: '#ef4444' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '35%', background: '#ef4444' }}
        isConnectable={isConnectable}
      />
      
      {/* Bottom handle - for communications */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '75%', background: '#9ca3af' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '75%', background: '#9ca3af' }}
        isConnectable={isConnectable}
      />
      
      <div className="flex flex-col items-center">
        <Bot size={24} className="text-white mb-1" />
        <div className="text-white font-medium text-sm">{label}</div>
        <div className="text-gray-300 text-xs uppercase mt-1">{role}</div>
      </div>
    </div>
  );
};

export default memo(BotNode);