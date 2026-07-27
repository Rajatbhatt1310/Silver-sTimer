import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { TimerProvider } from "./context/TimerContext";
import { FocusModeProvider } from "./context/FocusModeContext";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <TimerProvider>
        <FocusModeProvider>
          <App />
        </FocusModeProvider>
      </TimerProvider>
    </AuthProvider>
  </BrowserRouter>
);