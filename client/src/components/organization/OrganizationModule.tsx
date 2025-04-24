import { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  MarkerType,
  Node,
  Panel,
} from 'reactflow';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { OrgBot } from '@/types';
import BotNodeSidebar from '../organization/BotNodeSidebar';
import BotNode from '../organization/BotNode';
import 'reactflow/dist/style.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Define custom node types
const nodeTypes = {
  botNode: BotNode,
};

// Function to create randomized but non-overlapping positions
const generateNodePositions = (bots: OrgBot[]) => {
  const positions = new Map<string, { x: number, y: number }>();
  const roleYPositions: Record<string, number> = {
    'ceo': 50,
    'vp': 150,
    'manager': 300,
    'developer': 450
  };
  
  const roleXSpread: Record<string, number> = {
    'ceo': 50, // Small spread for CEO (usually just one)
    'vp': 250, // Medium spread for VPs
    'manager': 250, // Medium spread for managers
    'developer': 200 // Large spread for developers
  };
  
  // Group bots by role
  const botsByRole: Record<string, OrgBot[]> = {};
  bots.forEach(bot => {
    if (!botsByRole[bot.role]) {
      botsByRole[bot.role] = [];
    }
    botsByRole[bot.role].push(bot);
  });
  
  // Assign positions based on role
  Object.entries(botsByRole).forEach(([role, roleBots]) => {
    const baseY = roleYPositions[role] || 200;
    const xSpread = roleXSpread[role] || 200;
    
    roleBots.forEach((bot, index) => {
      // Calculate X position based on the number of bots with this role
      const totalWidth = roleBots.length * xSpread;
      const startX = 100;
      const x = startX + (index * xSpread);
      
      // Add some random variation to Y position to avoid perfect alignment
      const yVariation = Math.random() * 60 - 30; // Random value between -30 and 30
      
      positions.set(bot.id, { 
        x, 
        y: baseY + yVariation 
      });
    });
  });
  
  return positions;
};

const OrganizationModule = () => {
  const { 
    orgBots, 
    orgConnections, 
    activeBotId, 
    setActiveBotId 
  } = useWorkspace();

  // Generate optimized positions for nodes
  const nodePositions = useMemo(() => generateNodePositions(orgBots), [orgBots]);

  // Convert our data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return orgBots.map((bot) => {
      const position = nodePositions.get(bot.id) || bot.position || { x: 0, y: 0 };
      
      return {
        id: bot.id,
        position,
        data: { 
          label: bot.name, 
          role: bot.role, 
          description: bot.description,
          id: bot.id 
        },
        type: 'botNode',
      };
    });
  }, [orgBots, nodePositions]);

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
  const [zoom, setZoom] = useState(1);
  const [rfInstance, setRfInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setActiveBotId(node.id);
  };

  // Handle zoom level changes
  useEffect(() => {
    if (rfInstance) {
      const { zoom } = rfInstance.getViewport();
      setZoom(zoom);
    }
  }, [rfInstance]);

  const handleZoomIn = () => {
    if (rfInstance) {
      const { x, y } = rfInstance.getViewport();
      rfInstance.setViewport({ x, y, zoom: zoom + 0.2 });
    }
  };

  const handleZoomOut = () => {
    if (rfInstance) {
      const { x, y } = rfInstance.getViewport();
      rfInstance.setViewport({ x, y, zoom: Math.max(0.1, zoom - 0.2) });
    }
  };

  const handleReset = () => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.2 });
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-900">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={2}
          style={{ background: '#0c0d10' }}
        >
          <Panel position="top-right" className="flex gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </Panel>
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