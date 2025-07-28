import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (theme === "dark" || (!theme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className="relative flex items-center h-10 w-20 bg-secondary/60 hover:bg-secondary/80 rounded-full border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track background with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-muted opacity-50" />
      
      {/* Sliding toggle */}
      <motion.div
        animate={{
          x: isDark ? 40 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="relative z-10 flex items-center justify-center w-8 h-8 bg-background border border-border/20 rounded-full shadow-md"
      >
        <motion.div
          animate={{
            rotate: isDark ? 360 : 0,
            scale: isDark ? 1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <Sun className={`h-4 w-4 transition-all duration-300 ${!isDark ? 'text-primary opacity-100' : 'text-muted-foreground opacity-40'}`} />
        <Moon className={`h-4 w-4 transition-all duration-300 ${isDark ? 'text-primary opacity-100' : 'text-muted-foreground opacity-40'}`} />
      </div>
    </motion.button>
  );
}