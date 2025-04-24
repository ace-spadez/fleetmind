import { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Bot, Cpu, Terminal, BrainCircuit, Network, Zap, MessageSquare } from 'lucide-react';
import { BotRole, OrgBot } from '@/types';
import { Badge } from '@/components/ui/badge';

interface BotNodeSidebarProps {
  botId: string;
  onClose: () => void;
}

// Helper to get role-specific icons, colors and descriptions
const getRoleDetails = (role: BotRole) => {
  switch (role) {
    case 'ceo':
      return { 
        icon: <BrainCircuit className="h-5 w-5 text-purple-400" />, 
        color: 'bg-purple-900/20 border-purple-500/30 text-purple-400',
        description: 'Makes high-level strategic decisions and manages the entire organization'
      };
    case 'vp':
      return { 
        icon: <Network className="h-5 w-5 text-blue-400" />, 
        color: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
        description: 'Oversees departments and implements organizational strategies'
      };
    case 'manager':
      return { 
        icon: <Zap className="h-5 w-5 text-green-400" />, 
        color: 'bg-green-900/20 border-green-500/30 text-green-400',
        description: 'Manages teams and resources to complete specific projects'
      };
    case 'developer':
      return { 
        icon: <Terminal className="h-5 w-5 text-amber-400" />, 
        color: 'bg-amber-900/20 border-amber-500/30 text-amber-400',
        description: 'Writes code and implements specific features'
      };
    default:
      return { 
        icon: <Cpu className="h-5 w-5 text-gray-400" />, 
        color: 'bg-gray-900/20 border-gray-500/30 text-gray-400',
        description: 'General purpose AI bot'
      };
  }
};

const BotNodeSidebar = ({ botId, onClose }: BotNodeSidebarProps) => {
  const { orgBots, setOrgBots } = useWorkspace();
  const [bot, setBot] = useState<OrgBot | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const selectedBot = orgBots.find(b => b.id === botId);
    if (selectedBot) {
      setBot(selectedBot);
    }
  }, [botId, orgBots]);

  const handleChange = (field: keyof OrgBot, value: string) => {
    if (!bot) return;
    
    const updatedBot = { ...bot, [field]: value };
    setBot(updatedBot);
  };

  const handleSave = () => {
    if (!bot) return;
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setOrgBots(orgBots.map(b => (b.id === botId ? bot : b)));
      setIsSaving(false);
    }, 500);
  };

  if (!bot) {
    return (
      <div className="w-96 h-full bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bot Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-800 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-24 mb-2.5"></div>
            <div className="h-3 bg-gray-800 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  const roleDetails = getRoleDetails(bot.role);

  return (
    <div className="w-96 h-full bg-gray-900 border-l border-gray-800 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bot size={18} className="text-primary" />
          Bot Details
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      {/* Bot header */}
      <div className={`p-6 ${roleDetails.color} border-b border-gray-800 flex items-center gap-4`}>
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center shadow-lg">
          {roleDetails.icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{bot.name}</h2>
          <Badge variant="outline" className={`mt-1 ${roleDetails.color}`}>
            {bot.role.toUpperCase()}
          </Badge>
        </div>
      </div>
      
      {/* Bot details */}
      <div className="p-4 space-y-5">
        <div className="rounded-md bg-gray-800/50 p-3 text-sm text-gray-300 border border-gray-700">
          <p>{roleDetails.description}</p>
        </div>
      
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bot ID</label>
          <Input 
            value={bot.id} 
            disabled 
            className="bg-gray-800 border-gray-700 text-gray-400 font-mono text-xs"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bot Name</label>
          <Input 
            value={bot.name} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bot Role</label>
          <Select
            value={bot.role}
            onValueChange={(value) => handleChange('role', value as BotRole)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="vp">VP</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Bot Description</label>
          <Textarea 
            value={bot.description || ''} 
            onChange={(e) => handleChange('description', e.target.value)}
            className="bg-gray-800 border-gray-700"
            rows={4}
            placeholder="Enter a description for this bot..."
          />
        </div>
        
        <div className="pt-2 flex items-center gap-2">
          <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" className="flex items-center gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700">
            <MessageSquare size={16} />
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BotNodeSidebar;