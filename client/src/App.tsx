import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import React from 'react';

const App: React.FC = () => {
  const [location] = useLocation();
  
  // Extract module from the current location
  const getModuleFromPath = (path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/chat')) return 'chat';
    if (path.startsWith('/docs')) return 'docs';
    if (path.startsWith('/code')) return 'code';
    if (path.startsWith('/organization')) return 'organization';
    if (path.startsWith('/chart')) return 'chart';
    if (path.startsWith('/budget')) return 'budget';
    if (path.startsWith('/task')) return 'task';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeModule = getModuleFromPath(location);

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <TooltipProvider>
          <Toaster />
          <Switch>
            {/* Home route will render with the module extracted from the URL */}
            <Route path="/" component={() => <Home initialModule={activeModule} />} />
            <Route path="/chat" component={() => <Home initialModule="chat" />} />
            <Route path="/docs" component={() => <Home initialModule="docs" />} />
            <Route path="/code" component={() => <Home initialModule="code" />} />
            <Route path="/organization" component={() => <Home initialModule="organization" />} />
            <Route path="/chart" component={() => <Home initialModule="chart" />} />
            <Route path="/budget" component={() => <Home initialModule="budget" />} />
            <Route path="/task" component={() => <Home initialModule="task" />} />
            <Route path="/settings" component={() => <Home initialModule="settings" />} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
};

export default App;
