import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  MarkerType,
  Node,
} from 'reactflow';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { OrgBot } from '@/types';
import BotNodeSidebar from '../organization/BotNodeSidebar';
import BotNode from '../organization/BotNode';
import 'reactflow/dist/style.css';

// Define custom node types
const nodeTypes = {
  botNode: BotNode,
};

const getNodeStyleByRole = (role: string) => {
  switch (role) {
    case 'ceo':
      return { backgroundColor: '#8b5cf6' }; // Purple for CEO
    case 'vp':
      return { backgroundColor: '#3b82f6' }; // Blue for VPs
    case 'manager':
      return { backgroundColor: '#10b981' }; // Green for Managers
    case 'developer':
      return { backgroundColor: '#f59e0b' }; // Amber for Developers
    default:
      return { backgroundColor: '#6b7280' }; // Gray default
  }
};

const OrganizationModule = () => {
  const { 
    orgBots, 
    orgConnections, 
    activeBotId, 
    setActiveBotId 
  } = useWorkspace();

  // Convert our data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return orgBots.map((bot) => ({
      id: bot.id,
      position: bot.position || { x: 0, y: 0 },
      data: { label: bot.name, role: bot.role, description: bot.description },
      type: 'botNode',
      style: getNodeStyleByRole(bot.role),
    }));
  }, [orgBots]);

  const initialEdges: Edge[] = useMemo(() => {
    return orgConnections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      animated: conn.type === 'directive',
      style: {
        stroke: conn.type === 'directive' ? '#ef4444' : '#9ca3af', // Red for directive, Gray for communication
        strokeWidth: conn.type === 'directive' ? 2 : 1,
        strokeDasharray: conn.type === 'communication' ? '5 5' : undefined, // Dotted line for communication
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: conn.type === 'directive' ? '#ef4444' : '#9ca3af',
      },
    }));
  }, [orgConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setActiveBotId(node.id);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
      {activeBotId && (
        <BotNodeSidebar 
          botId={activeBotId} 
          onClose={() => setActiveBotId(null)} 
        />
      )}
    </div>
  );
};

export default OrganizationModule;