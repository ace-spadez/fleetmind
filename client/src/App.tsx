import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import { WorkspaceProvider } from "./context/WorkspaceProvider";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <WorkspaceProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </WorkspaceProvider>
    </TooltipProvider>
  );
}

export default App;
