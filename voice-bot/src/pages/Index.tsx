import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { VoiceInterface } from "@/components/VoiceInterface";
import { GoogleAuth } from "@/components/GoogleAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MessageSquare, Brain, Shield } from "lucide-react";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

const Index = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);

  const handleLogin = (userData: GoogleUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const features = [
    {
      icon: Mic,
      title: "Real-time Voice Chat",
      description: "Experience natural conversations with AI-powered voice technology",
    },
    {
      icon: MessageSquare,
      title: "Live Text Display",
      description: "See your conversation transcribed in real-time for better context",
    },
    {
      icon: Brain,
      title: "Advanced AI",
      description: "Powered by ElevenLabs' cutting-edge conversational AI models",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Google OAuth integration ensures your conversations are private",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 py-12">
        {!user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                  Taki
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Your intelligent AI voice assistant with advanced conversation capabilities
                </p>
                
                {/* Combined Google Auth and Ready to Start */}
                <Card className="bg-gradient-card border-0 shadow-card max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <GoogleAuth user={user} onLogin={handleLogin} onLogout={handleLogout} />
                    <div className="text-sm text-muted-foreground mt-4">
                      Secure • Private • Intelligent
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="inline-flex p-3 bg-gradient-primary rounded-lg mb-4"
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-2"
              >
                Welcome back, {user.name}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                Start a voice conversation with our AI assistant
              </motion.p>
            </div>
            
            <VoiceInterface userEmail={user.email} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
