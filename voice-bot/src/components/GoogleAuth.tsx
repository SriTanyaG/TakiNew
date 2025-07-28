import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthProps {
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
  user: GoogleUser | null;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleAuth({ onLogin, onLogout, user }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "844002845433-04e9jb4i8hu404usig2sm4hnqt18skml.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });
      }
    };

    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleAuth;
        document.head.appendChild(script);
      } else {
        initializeGoogleAuth();
      }
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = (response: any) => {
    setIsLoading(true);
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const user: GoogleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      onLogin(user);
    } catch (error) {
      console.error("Error parsing Google credential:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    if (window.google) {
      window.google.accounts.oauth2.initTokenClient({
        client_id: "844002845433-04e9jb4i8hu404usig2sm4hnqt18skml.apps.googleusercontent.com",
        scope: "openid email profile",
        hint: "",
        hd: "",
        callback: (response: any) => {
          if (response.access_token) {
            // Fetch user info using the access token
            fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`)
              .then(res => res.json())
              .then(userInfo => {
                const user: GoogleUser = {
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                };
                onLogin(user);
                setIsLoading(false);
              })
              .catch(error => {
                console.error("Error fetching user info:", error);
                setIsLoading(false);
              });
          }
        },
      }).requestAccessToken();
      setIsLoading(true);
    }
  };

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="flex items-center gap-3 p-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={user.picture}
              alt={user.name}
              className="h-10 w-10 rounded-full ring-2 ring-primary/20"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          Sign Out
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Welcome to Taki</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in with Google to start your AI-powered conversation
        </p>
      </div>
      <Button
        variant="voice"
        size="lg"
        onClick={handleSignIn}
        disabled={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            />
            Signing in...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </div>
        )}
      </Button>
    </motion.div>
  );
}