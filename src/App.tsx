import { useState } from "react";
import { Chatbot } from "./components/Chatbot";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Chatbot isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
    </div>
  );
}

export default App;
