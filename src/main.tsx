import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Game } from "./lib/features/Battlefield/Battlefield.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Game />
  </StrictMode>
);
