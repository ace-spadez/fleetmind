import { useWorkspace } from "@/context/WorkspaceProvider";
import { IconButton } from "../ui/icon-button";
import { Module } from "@/types";
import { 
  Home, 
  Bot, 
  NotebookText, 
  Code, 
  PieChart, 
  DollarSign, 
  Settings,
  Users
} from "lucide-react";

const Sidebar = () => {
  const { activeModule, setActiveModule } = useWorkspace();

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
  };

  const navItems = [
    { id: "chat", icon: <Bot size={18} />, module: "chat" as Module },
    { id: "docs", icon: <NotebookText size={18} />, module: "docs" as Module },
    { id: "code", icon: <Code size={18} />, module: "code" as Module },
    { id: "chart", icon: <PieChart size={18} />, module: "chart" as Module },
    { id: "organization", icon: <Users size={18} />, module: "organization" as Module },
    { id: "budget", icon: <DollarSign size={18} />, module: "budget" as Module },
  ];

  return (
    <div className="w-12 bg-[hsl(var(--sidebar-background))] flex flex-col items-center py-4 border-r border-[hsl(var(--sidebar-border))]">
      {/* Home button at top */}
      <IconButton
        key="home"
        variant={activeModule === "home" ? "active" : "default"}
        onClick={() => handleModuleClick("home")}
        aria-label="home"
        className="mb-6"
      >
        <Home size={18} />
      </IconButton>
      
      {/* Center the main navigation items */}
      <div className="flex flex-col items-center space-y-5 flex-1 justify-center">
        {navItems.map((item) => (
          <IconButton
            key={item.id}
            variant={activeModule === item.module ? "active" : "default"}
            onClick={() => handleModuleClick(item.module)}
            aria-label={item.id}
          >
            {item.icon}
          </IconButton>
        ))}
      </div>

      {/* Settings button at bottom */}
      <IconButton
        variant={activeModule === "settings" ? "active" : "default"}
        onClick={() => handleModuleClick("settings")}
        className="mt-auto"
        aria-label="settings"
      >
        <Settings size={18} />
      </IconButton>
    </div>
  );
};

export default Sidebar;
