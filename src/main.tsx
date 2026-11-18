import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
if (import.meta.env.DEV) {
  createRoot(root).render(<App />);
} else {
  hydrateRoot(root, <App />);
}
