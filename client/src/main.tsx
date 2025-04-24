import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { WorkspaceProvider } from "./context/WorkspaceProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <WorkspaceProvider>
      <App />
    </WorkspaceProvider>
  </ThemeProvider>
);
