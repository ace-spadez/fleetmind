import { useState, useEffect } from "react";
import { X, Plus, ArrowRight, Trash2, PencilLine, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Instruction = {
  id: string;
  text: string;
  isEditing?: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'complete';
  source: string;
  target: string;
};

type DirectiveBusChatProps = {
  channelId: string;
  sourceBotId: string;
  targetBotId: string;
};

// Generate a simple ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Example instructions for demonstration
const mockInstructions: Instruction[] = [
  {
    id: generateId(),
    text: "Analyze user requirements and create component specifications",
    priority: "high",
    status: "active",
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  },
  {
    id: generateId(),
    text: "Design UI components according to specifications and brand guidelines",
    priority: "medium",
    status: "pending",
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  },
  {
    id: generateId(),
    text: "Optimize component rendering for performance improvements",
    priority: "low",
    status: "complete",
    source: "swift-eagle-9042",
    target: "creative-owl-7238"
  }
];

const DirectiveBusChat = ({ channelId, sourceBotId, targetBotId }: DirectiveBusChatProps) => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [newInstruction, setNewInstruction] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  // Initialize with example data
  useEffect(() => {
    setInstructions(mockInstructions);
  }, []);
  
  // Add new instruction
  const handleAddInstruction = () => {
    if (newInstruction.trim() === "") return;
    
    const instruction: Instruction = {
      id: generateId(),
      text: newInstruction,
      priority: "medium",
      status: "pending",
      source: sourceBotId,
      target: targetBotId
    };
    
    setInstructions([...instructions, instruction]);
    setNewInstruction("");
    setIsAdding(false);
  };
  
  // Start editing an instruction
  const startEditing = (id: string) => {
    setInstructions(
      instructions.map(instruction => 
        instruction.id === id 
          ? { ...instruction, isEditing: true } 
          : { ...instruction, isEditing: false }
      )
    );
  };
  
  // Save edited instruction
  const saveInstruction = (id: string, newText: string) => {
    setInstructions(
      instructions.map(instruction => 
        instruction.id === id 
          ? { ...instruction, text: newText, isEditing: false } 
          : instruction
      )
    );
  };
  
  // Delete instruction
  const deleteInstruction = (id: string) => {
    setInstructions(instructions.filter(instruction => instruction.id !== id));
  };
  
  // Change instruction priority
  const togglePriority = (id: string) => {
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    
    setInstructions(
      instructions.map(instruction => {
        if (instruction.id === id) {
          const currentIndex = priorities.indexOf(instruction.priority);
          const nextIndex = (currentIndex + 1) % priorities.length;
          return { ...instruction, priority: priorities[nextIndex] };
        }
        return instruction;
      })
    );
  };
  
  // Change instruction status
  const toggleStatus = (id: string) => {
    const statuses: ('active' | 'pending' | 'complete')[] = ['active', 'pending', 'complete'];
    
    setInstructions(
      instructions.map(instruction => {
        if (instruction.id === id) {
          const currentIndex = statuses.indexOf(instruction.status);
          const nextIndex = (currentIndex + 1) % statuses.length;
          return { ...instruction, status: statuses[nextIndex] };
        }
        return instruction;
      })
    );
  };
  
  // Get color for priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-500/20 text-red-300 border-red-500/30";
      case 'medium': return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case 'low': return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };
  
  // Get color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return "bg-green-500/20 text-green-300 border-green-500/30";
      case 'pending': return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case 'complete': return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header with connection info */}
      <div className="p-3 border-b border-gray-700/50 bg-gray-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-gray-400" />
          <h3 className="text-sm font-medium">Directive Bus</h3>
          <div className="flex items-center text-xs text-gray-400">
            <span className="text-blue-400">{sourceBotId}</span>
            <ArrowRight size={12} className="mx-1" />
            <span className="text-green-400">{targetBotId}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs px-2 flex items-center gap-1 bg-blue-900/20 hover:bg-blue-800/30 text-blue-300"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} />
          <span>Add</span>
        </Button>
      </div>
      
      {/* Instructions list */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {instructions.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            <p>No instructions in this directive bus.</p>
            <p className="text-xs mt-1">Add instructions using the button above.</p>
          </div>
        ) : (
          instructions.map((instruction) => (
            <div key={instruction.id} className="bg-gray-800/30 rounded-md border border-gray-700/50 overflow-hidden">
              {instruction.isEditing ? (
                <div className="p-3">
                  <Input
                    defaultValue={instruction.text}
                    className="bg-gray-900/50 border-gray-700 text-gray-200 text-xs mb-2"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveInstruction(instruction.id, e.currentTarget.value);
                      } else if (e.key === 'Escape') {
                        setInstructions(
                          instructions.map(i => i.id === instruction.id ? { ...i, isEditing: false } : i)
                        );
                      }
                    }}
                  />
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs bg-green-900/20 text-green-400 hover:bg-green-900/30"
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                        saveInstruction(instruction.id, input?.value || instruction.text);
                      }}
                    >
                      <Check size={12} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                      onClick={() => {
                        setInstructions(
                          instructions.map(i => i.id === instruction.id ? { ...i, isEditing: false } : i)
                        );
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3">
                    <p className="text-xs text-gray-200">{instruction.text}</p>
                  </div>
                  <div className="p-2 border-t border-gray-700/50 bg-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] py-0 h-4 ${getPriorityColor(instruction.priority)}`}
                        onClick={() => togglePriority(instruction.id)}
                      >
                        {instruction.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] py-0 h-4 ${getStatusColor(instruction.status)}`}
                        onClick={() => toggleStatus(instruction.id)}
                      >
                        {instruction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                        onClick={() => startEditing(instruction.id)}
                      >
                        <PencilLine size={12} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                        onClick={() => deleteInstruction(instruction.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        
        {/* New instruction input */}
        {isAdding && (
          <div className="bg-gray-800/30 rounded-md border border-gray-700/50 p-3">
            <Input
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Type new instruction and press Enter..."
              className="bg-gray-900/50 border-gray-700 text-gray-200 text-xs mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddInstruction();
                } else if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewInstruction("");
                }
              }}
            />
            <div className="flex justify-end gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs bg-green-900/20 text-green-400 hover:bg-green-900/30"
                onClick={handleAddInstruction}
              >
                <Check size={12} className="mr-1" />
                <span>Add</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs bg-gray-800 text-gray-400 hover:bg-gray-700"
                onClick={() => {
                  setIsAdding(false);
                  setNewInstruction("");
                }}
              >
                <X size={12} className="mr-1" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectiveBusChat;