import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Shield, Sparkles, Users, MessageSquare, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVoiceBotAccess = () => {
    window.location.href = "/voicebot/";
  };

  const handleAdminAccess = () => {
    window.location.href = "/admin/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <ThemeToggle />
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Main Content */}
        <div className={`text-center space-y-8 relative z-10 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Logo & Title */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-soft animate-pulse-glow">
                <Mic className="w-12 h-12 text-primary-foreground" />
              </div>
              <Sparkles className="w-8 h-8 text-primary animate-float" />
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              Voice Bot Platform
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Next-generation AI-powered voice assistance with comprehensive analytics and management
            </p>
          </div>

          {/* Action Cards */}
          <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Voice Bot Access Card */}
            <Card className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-large bg-card border border-border/50" onClick={handleVoiceBotAccess}>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="p-6 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto w-fit transition-all duration-300 group-hover:shadow-glow group-hover:scale-110">
                    <MessageSquare className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-card-foreground">Access Voice Bot</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Experience our intelligent voice assistant with natural language processing and real-time responses
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-primary font-medium group-hover:text-accent transition-colors duration-300">
                    <span>Launch Application</span>
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel Access Card */}
            <Card className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-large bg-card border border-border/50" onClick={handleAdminAccess}>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="p-6 bg-gradient-to-br from-accent to-primary rounded-2xl mx-auto w-fit transition-all duration-300 group-hover:shadow-glow group-hover:scale-110">
                    <Shield className="w-12 h-12 text-accent-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-card-foreground">Admin Panel</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Comprehensive dashboard for managing agents, monitoring conversations, and analytics
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-accent font-medium group-hover:text-primary transition-colors duration-300">
                    <span>Enter Dashboard</span>
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <div className="w-2 h-2 bg-accent-foreground rounded-full transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className={`mt-20 transition-all duration-1000 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-3 p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
                <Users className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold text-foreground">User Management</h4>
                <p className="text-sm text-muted-foreground">Track and manage user interactions</p>
              </div>
              
              <div className="text-center space-y-3 p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
                <BarChart3 className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold text-foreground">Analytics</h4>
                <p className="text-sm text-muted-foreground">Detailed conversation insights</p>
              </div>
              
              <div className="text-center space-y-3 p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
                <MessageSquare className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold text-foreground">Conversation History</h4>
                <p className="text-sm text-muted-foreground">Complete interaction logs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
