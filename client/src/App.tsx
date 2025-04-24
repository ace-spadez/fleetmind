import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <WorkspaceProvider>
          <Toaster />
          <Switch>
            <Route path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </WorkspaceProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
