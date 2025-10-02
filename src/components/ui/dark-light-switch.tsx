import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const DarkLightSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    toggleTheme();
  };
  
  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center justify-center w-12 h-6 bg-muted rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Toggle theme"
    >
      <div 
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
            <Moon className="w-3 h-3 text-muted-foreground m-1" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500 m-1" />
        )}
      </div>
    </button>
  );
};

export default DarkLightSwitch;
