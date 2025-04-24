import { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { BotRole, OrgBot } from '@/types';

interface BotNodeSidebarProps {
  botId: string;
  onClose: () => void;
}

const BotNodeSidebar = ({ botId, onClose }: BotNodeSidebarProps) => {
  const { orgBots, setOrgBots } = useWorkspace();
  const [bot, setBot] = useState<OrgBot | null>(null);

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
    
    setOrgBots(orgBots.map(b => (b.id === botId ? bot : b)));
  };

  if (!bot) {
    return (
      <div className="w-80 h-full bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bot Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bot Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <Input 
            value={bot.id} 
            disabled 
            className="bg-gray-800 border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input 
            value={bot.name} 
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
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
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            value={bot.description || ''} 
            onChange={(e) => handleChange('description', e.target.value)}
            className="bg-gray-800 border-gray-700"
            rows={4}
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BotNodeSidebar;