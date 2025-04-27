import { useWorkspace } from "@/context/WorkspaceProvider";
import { useTheme } from "@/context/ThemeProvider";
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
  Users,
  Sun,
  Moon,
  BotMessageSquare,
  Network,
  Terminal,
  CheckSquare,
  BrainCircuit,
  Library,
  HeartPulse,
  Activity,
  PiggyBank
} from "lucide-react";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

const Sidebar = () => {
  const { activeModule, setActiveModule } = useWorkspace();
  const { theme, toggleTheme } = useTheme();

  const handleModuleClick = (module: Module) => {
    setActiveModule(module);
    // Update the URL to reflect the active module
    window.history.pushState({}, "", `/${module === "home" ? "" : module}`);
  };

  const navItems = [
    { 
      id: "chat", 
      name: "Channels",
      icon: <BotMessageSquare size={17} />, 
      module: "chat" as Module,
      description: "Chat with AI assistants and view conversations between bots" 
    },
    { 
      id: "docs", 
      name: "Plan & Document",
      icon: <Library size={17} />, 
      module: "docs" as Module,
      description: "Create and manage project documentation and notes" 
    },
    { 
      id: "code", 
      name: "Code",
      icon: <Code size={17} />, 
      module: "code" as Module,
      description: "View and edit code files with syntax highlighting" 
    },
    { 
      id: "task", 
      name: "Tasks",
      icon: <CheckSquare size={17} />, 
      module: "task" as Module,
      description: "Manage and track tasks and project progress" 
    },
    { 
      id: "chart", 
      name: "Monitor",
      icon: <Activity size={17} />, 
      module: "chart" as Module,
      description: "Visualize metrics and data with interactive charts" 
    },
    { 
      id: "organization", 
      name: "Orchestration",
      icon: <BrainCircuit size={17} />, 
      module: "organization" as Module,
      description: "View the organization structure and bot hierarchy" 
    },
    { 
      id: "budget", 
      name: "Budget",
      icon: <PiggyBank size={17} />, 
      module: "budget" as Module,
      description: "Track and manage project budget and expenses" 
    },
  ];

  return (
    <TooltipProvider>
      <div className="w-10 bg-[hsl(var(--sidebar-background))] flex flex-col items-center py-4 border-r border-[hsl(var(--sidebar-border))]">
        {/* Home button at top */}
        <EnhancedTooltip 
          trigger={
            <IconButton
              key="home"
              variant={activeModule === "home" ? "active" : "default"}
              onClick={() => handleModuleClick("home")}
              aria-label="home"
              className="mb-6"
            >
              <Home size={18} />
            </IconButton>
          }
          title="Home"
          icon={<Home size={18} />}
          description="Return to the home dashboard view"
        />
        
        {/* Center the main navigation items */}
        <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
          {navItems.map((item) => (
            <EnhancedTooltip
              key={item.id}
              trigger={
                <IconButton
                  variant={"default"}
                  // on hover, change bg
                  className={`relative hover:bg-gray-700/50`}
                  onClick={() => handleModuleClick(item.module)}
                  aria-label={item.id}
                >
                  {item.icon}
                  {/* a circle if active */}
                  {activeModule === item.module && (
                    <div className="absolute right-0 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </IconButton>
              }
              title={item.name}
              icon={item.icon}
              description={item.description}
            />
          ))}
        </div>

        {/* Theme toggle button */}
        <EnhancedTooltip
          trigger={
            <IconButton
              variant="default"
              onClick={toggleTheme}
              className="mt-auto mb-3"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          }
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          description={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        />
        
        {/* Settings button at bottom */}
        <EnhancedTooltip
          trigger={
            <IconButton
              variant={activeModule === "settings" ? "active" : "default"}
              onClick={() => handleModuleClick("settings")}
              aria-label="settings"
            >
              <Settings size={18} />
            </IconButton>
          }
          title="Settings"
          icon={<Settings size={18} />}
          description="Configure application preferences and user settings"
        />
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
