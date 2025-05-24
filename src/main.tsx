import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Water } from "./Water";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Water />
  </StrictMode>
);
