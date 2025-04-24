import { useWorkspace } from "@/context/WorkspaceProvider";
import Sidebar from "@/components/layout/Sidebar";
import ChatModule from "@/components/chat/ChatModule";
import DocumentationModule from "@/components/documentation/DocumentationModule";
import CodeModule from "@/components/code/CodeModule";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const { activeModule } = useWorkspace();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        {activeModule === "chat" && <ChatModule />}
        {activeModule === "docs" && <DocumentationModule />}
        {activeModule === "code" && <CodeModule />}
        {activeModule === "home" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to Replit Workspace</h1>
              <p className="text-muted-foreground mb-6">Select a module from the sidebar to get started</p>
            </div>
          </div>
        )}
        {(activeModule === "chart" || activeModule === "budget" || activeModule === "settings") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">This module is under development</h1>
              <p className="text-muted-foreground">Please check back later</p>
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 rounded-full"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </div>
  );
}
