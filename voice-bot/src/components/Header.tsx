import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, LogOut, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

interface HeaderProps {
  user: GoogleUser | null;
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-primary rounded-lg opacity-20 blur-sm"
              />
              <div className="relative bg-gradient-primary p-3 rounded-lg shadow-glow">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Taki
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Voice Assistant
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserInfo(!showUserInfo)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.picture || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=32&h=32&fit=crop&crop=face"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=32&h=32&fit=crop&crop=face";
                    }}
                  />
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <AnimatePresence>
                  {showUserInfo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px] z-50"
                    >
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center gap-2 h-9 px-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}