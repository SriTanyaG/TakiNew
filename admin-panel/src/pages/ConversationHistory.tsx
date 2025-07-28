import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Bot, 
  Clock, 
  Search,
  Download,
  Filter,
  Calendar,
  Hash,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  timestamp: string;
  messages: Message[];
}

const ConversationHistory = () => {
  const { agentId, userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"content" | "date" | "id">("content");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchConversationHistory();
  }, [agentId, userId]);

  const fetchConversationHistory = async () => {
    try {
      // Get conversations for this specific agent and user ID
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('Agent_id', agentId)
        .eq('User_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (conversations.length > 0) {
        // Get agent name using edge function
        const { data: agentDetailsResponse, error: agentError } = await supabase.functions.invoke('get-agent-details', {
          body: { agent_ids: [agentId] }
        });
        
        if (agentError) {
          console.error('Error fetching agent details:', agentError);
          setAgentName(`Agent ${agentId}`);
        } else {
          const agentDetails = agentDetailsResponse?.data || [];
          const agentDetail = agentDetails[0];
          setAgentName(agentDetail?.Agent_name || `Agent ${agentId}`);
        }
        
        // Get user details from Users table
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('email')
          .eq('User_id', userId)
          .single();
        
        if (!userError && userData?.email) {
          setUserName(userData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        } else {
          setUserName(`User ${userId}`);
        }
      }

      // Also get conversation vectors for more detailed conversation data
      // First get user email from Users table for vector lookup
      const { data: userData } = await supabase
        .from('Users')
        .select('email')
        .eq('User_id', userId)
        .single();
      
      const { data: vectors, error: vectorError } = await supabase
        .from('conversation_vectors')
        .select('*')
        .eq('user_email', userData?.email || '')
        .order('created_at', { ascending: false });

      if (vectorError) {
        console.error('Error fetching conversation vectors:', vectorError);
      }

      // Process conversations into the expected format
      const processedConversations: Conversation[] = [];

      // Combine conversations and vectors by timestamp correlation
      for (const conv of conversations) {
        let messages: Message[] = [];
        
        try {
          // If conversation_content is JSON with messages
          const parsed = JSON.parse(conv.conversation_content);
          if (Array.isArray(parsed)) {
            messages = parsed.map((msg: any) => ({
              type: msg.role === 'user' || msg.type === 'user' ? 'user' : 'bot',
              content: msg.content || msg.message || msg.text || 'No content',
              timestamp: new Date(conv.timestamp).toLocaleTimeString()
            }));
          } else if (parsed.content || parsed.message) {
            // Single message format
            messages = [{
              type: 'user',
              content: parsed.content || parsed.message,
              timestamp: new Date(conv.timestamp).toLocaleTimeString()
            }];
          } else {
            // Fallback to plain text
            messages = [{
              type: 'user',
              content: conv.conversation_content,
              timestamp: new Date(conv.timestamp).toLocaleTimeString()
            }];
          }
        } catch {
          // If not JSON, treat as plain text
          messages = [{
            type: 'user',
            content: conv.conversation_content,
            timestamp: new Date(conv.timestamp).toLocaleTimeString()
          }];
        }

        // Find corresponding AI response from vectors
        const relatedVector = vectors?.find(v => {
          const timeDiff = Math.abs(new Date(v.created_at).getTime() - new Date(conv.timestamp).getTime());
          return timeDiff < 300000; // Within 5 minutes
        });

        if (relatedVector && relatedVector.ai_response) {
          messages.push({
            type: 'bot',
            content: relatedVector.ai_response,
            timestamp: new Date(relatedVector.created_at).toLocaleTimeString()
          });
        }

        processedConversations.push({
          id: conv.conversation_id || `conv_${Date.now()}_${Math.random()}`,
          timestamp: conv.timestamp,
          messages
        });
      }

      // If no conversations found but vectors exist, create conversations from vectors
      if (processedConversations.length === 0 && vectors && vectors.length > 0) {
        for (const vector of vectors) {
          const messages: Message[] = [];
          
          if (vector.user_input) {
            messages.push({
              type: 'user',
              content: vector.user_input,
              timestamp: new Date(vector.created_at).toLocaleTimeString()
            });
          }
          
          if (vector.ai_response) {
            messages.push({
              type: 'bot',
              content: vector.ai_response,
              timestamp: new Date(vector.created_at).toLocaleTimeString()
            });
          }

          if (messages.length > 0) {
            processedConversations.push({
              id: `vector_${vector.id}`,
              timestamp: vector.created_at,
              messages
            });
          }
        }
      }

      setConversations(processedConversations);
      
      // Set user name from user data if not already set
      if (!userName) {
        const { data: userData } = await supabase
          .from('Users')
          .select('email')
          .eq('User_id', userId)
          .single();
        
        if (userData?.email) {
          setUserName(userData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        } else {
          setUserName(`User ${userId}`);
        }
      }
      
    } catch (error) {
      console.error('Error fetching conversation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm && !dateFilter) return true;
    
    switch (searchType) {
      case "content":
        return conv.messages.some(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "id":
        return conv.id.toLowerCase().includes(searchTerm.toLowerCase());
      case "date":
        if (dateFilter) {
          const convDate = new Date(conv.timestamp);
          const filterDate = new Date(dateFilter);
          return convDate.toDateString() === filterDate.toDateString();
        }
        return true;
      default:
        return true;
    }
  });

  const exportToPDF = (conversationData?: Conversation) => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;

    // Title
    pdf.setFontSize(16);
    pdf.text(conversationData ? `Conversation: ${conversationData.id}` : "Complete Conversation History", 20, yPosition);
    yPosition += 10;

    // User and Agent info
    pdf.setFontSize(12);
    pdf.text(`User: ${userName} | Agent: ${agentName}`, 20, yPosition);
    yPosition += 20;

    const dataToExport = conversationData ? [conversationData] : filteredConversations;

    dataToExport.forEach((conv, convIndex) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Conversation header
      pdf.setFontSize(14);
      pdf.text(`Conversation ${convIndex + 1} - ${new Date(conv.timestamp).toLocaleString()}`, 20, yPosition);
      yPosition += 15;

      // Messages
      conv.messages.forEach((message) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(10);
        pdf.text(`${message.type === 'user' ? 'User' : 'Bot'} (${message.timestamp}):`, 20, yPosition);
        yPosition += 8;

        // Split long messages into multiple lines
        const lines = pdf.splitTextToSize(message.content, 170);
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * 6 + 10;
      });

      yPosition += 10;
    });

    // Save the PDF
    const filename = conversationData 
      ? `conversation_${conversationData.id}_${new Date().toISOString().split('T')[0]}.pdf`
      : `conversation_history_${userName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(filename);
  };

  const selectedConv = selectedConversation ? 
    conversations.find(conv => conv.id === selectedConversation) : 
    conversations[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/agent/${agentId}`)}
                className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Users</span>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Conversation History</h1>
                <p className="text-sm text-muted-foreground">
                  {userName} • {agentName} • User ID: {userId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => exportToPDF()}
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </Button>
              
              <Select value={searchType} onValueChange={(value: "content" | "date" | "id") => setSearchType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="id">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Conversation ID</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="date">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border shadow-medium h-[600px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    Conversations ({filteredConversations.length})
                  </CardTitle>
                </div>
                
                <div className="space-y-3">
                  {searchType === "date" ? (
                    <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateFilter}
                          onSelect={(date) => {
                            setDateFilter(date);
                            setShowDatePicker(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={
                          searchType === "id" 
                            ? "Search by conversation ID..." 
                            : "Search conversations..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input border-border focus:border-primary"
                      />
                    </div>
                  )}
                  
                  {(searchTerm || dateFilter) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setDateFilter(undefined);
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[450px]">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filteredConversations.map((conv, index) => (
                      <Card
                        key={conv.id}
                        className={`cursor-pointer border transition-all duration-200 hover:scale-[1.02] ${
                          selectedConversation === conv.id || (!selectedConversation && index === 0)
                            ? "border-primary bg-primary/5" 
                            : "border-border bg-card hover:border-primary"
                        }`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {new Date(conv.timestamp).toLocaleDateString()}
                              </Badge>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(conv.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-card-foreground font-medium line-clamp-2">
                              {conv.messages[0]?.content}
                            </p>
                            
                            <p className="text-xs text-muted-foreground">
                              {conv.messages.length} messages
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Detail */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border shadow-medium h-[600px]">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-card-foreground">
                      Conversation Details
                    </CardTitle>
                    {selectedConv && (
                      <p className="text-sm text-muted-foreground">
                        Started on {new Date(selectedConv.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {selectedConv && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToPDF(selectedConv)}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[450px]">
                  {selectedConv ? (
                    <div className="p-6 space-y-4">
                      {selectedConv.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex items-start space-x-3 ${
                            message.type === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.type === "bot" && (
                            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-soft">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                          
                          <div className={`max-w-[70%] ${message.type === "user" ? "order-1" : ""}`}>
                            <div
                              className={`p-4 rounded-2xl shadow-soft ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card border border-border"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            
                            <div className={`flex items-center space-x-2 mt-1 text-xs text-muted-foreground ${
                              message.type === "user" ? "justify-end" : "justify-start"
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{message.timestamp}</span>
                            </div>
                          </div>

                          {message.type === "user" && (
                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                              <User className="w-4 h-4 text-accent" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Select a conversation to view details</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;