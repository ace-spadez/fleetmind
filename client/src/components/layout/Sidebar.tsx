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
  Settings 
} from "lucide-react";

const Sidebar = () => {
  const { activeModule, setActiveModule } = useWorkspace();

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
  };

  const navItems = [
    { id: "home", icon: <Home size={22} />, module: "home" as Module },
    { id: "chat", icon: <Bot size={22} />, module: "chat" as Module },
    { id: "docs", icon: <NotebookText size={22} />, module: "docs" as Module },
    { id: "code", icon: <Code size={22} />, module: "code" as Module },
    { id: "chart", icon: <PieChart size={22} />, module: "chart" as Module },
    { id: "budget", icon: <DollarSign size={22} />, module: "budget" as Module },
  ];

  return (
    <div className="w-16 bg-[hsl(var(--sidebar-background))] flex flex-col items-center py-4 border-r border-[hsl(var(--sidebar-border))]">
      <div className="flex flex-col items-center space-y-6 flex-1">
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

      <IconButton
        variant={activeModule === "settings" ? "active" : "default"}
        onClick={() => handleModuleClick("settings")}
        className="mt-auto"
        aria-label="settings"
      >
        <Settings size={22} />
      </IconButton>
    </div>
  );
};

export default Sidebar;
