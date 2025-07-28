import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Loader2, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { AudioSpectrogram } from "./AudioSpectrogram";

interface Message {
  id: string;
  content: string;
  type: "user" | "agent";
  timestamp: Date;
}

interface VoiceInterfaceProps {
  userEmail: string;
}

export function VoiceInterface({ userEmail }: VoiceInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Voice conversation started successfully",
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onMessage: (message: any) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message.text || message.message || "",
        type: message.source === "user" ? "user" : "agent",
        timestamp: new Date(),
      };
      
      if (newMessage.content.trim()) {
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
    clientTools: {
      get_user_email: () => {
        return userEmail;
      },
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Generate signed URL for the conversation
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=agent_01jzvrgx8pff7btgjfwb8js84h`,
        {
          method: "GET",
          headers: {
            "xi-api-key": "sk_95743eec1f42508fa0a70799d722e18ee3871eb616ebb281",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { signed_url } = await response.json();
      await conversation.startSession({ 
        agentId: "agent_01jzvrgx8pff7btgjfwb8js84h"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopConversation = async () => {
    await conversation.endSession();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Unified Voice Chat Interface */}
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col h-[600px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    isConnected && isUserSpeaking ? 'bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse' : 
                    isConnected && conversation.isSpeaking ? 'bg-blue-600 shadow-lg shadow-blue-600/50 animate-pulse' : 
                    isConnected ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                    'bg-muted-foreground/40'
                  }`} />
                  <h4 className="text-lg font-semibold">Voice Conversation</h4>
                </div>
                <span className="text-sm text-muted-foreground">
                  {messages.length} messages
                </span>
              </div>
              
              {/* Chat Messages */}
              <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
                <AnimatePresence initial={false}>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-full text-muted-foreground"
                    >
                      <div className="text-center space-y-2">
                        <Send className="h-12 w-12 mx-auto opacity-50" />
                        <p>Start speaking to begin your conversation</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-start gap-3 ${
                            message.type === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.type === "agent" && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                              <div className="w-4 h-4 rounded-full bg-primary" />
                            </div>
                          )}
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          {message.type === "user" && (
                            <img 
                              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=32&h=32&fit=crop&crop=face"
                              alt="User"
                              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=32&h=32&fit=crop&crop=face";
                              }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              {/* Audio Visualization - Small and Elegant */}
              <AnimatePresence>
                {(isConnected && conversation.isSpeaking) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-primary rounded-full"
                              animate={{
                                height: [4, Math.random() * 16 + 8, 4],
                                opacity: [0.4, 1, 0.4],
                              }}
                              transition={{
                                duration: 0.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.05,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-primary ml-2">AI speaking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice Control */}
              <div className="flex flex-col items-center space-y-4 pt-4 border-t border-border/50">
                <motion.div
                  className="relative"
                  animate={{
                    scale: conversation.isSpeaking ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: conversation.isSpeaking ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <Button
                    variant={isConnected ? "glow" : "voice"}
                    size="icon-lg"
                    onClick={isConnected ? stopConversation : startConversation}
                    disabled={conversation.status === "connecting"}
                    className="relative overflow-hidden w-16 h-16"
                  >
                    <AnimatePresence mode="wait">
                      {conversation.status === "connecting" ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 180 }}
                        >
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </motion.div>
                      ) : isConnected ? (
                        <motion.div
                          key="connected"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <PhoneOff className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="disconnected"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Mic className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                  
                  {(isUserSpeaking && isConnected) && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-400/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
                
                <div className="text-center">
                  <motion.p
                    animate={{
                      color: isConnected ? "hsl(var(--voice-primary))" : "hsl(var(--muted-foreground))",
                    }}
                    className="text-sm font-medium"
                  >
                    {conversation.status === "connecting"
                      ? "Connecting..."
                      : isConnected
                      ? conversation.isSpeaking
                        ? "AI is responding..."
                        : isUserSpeaking
                        ? "Listening..."
                        : "Tap to speak"
                      : "Start conversation"}
                  </motion.p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}