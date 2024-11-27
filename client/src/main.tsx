import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Toaster } from "./components/ui/toaster";

const root = document.getElementById("root");

ReactDOM.createRoot(root as HTMLElement).render(
  <>
    <App />
    <Toaster />
  </>
);
