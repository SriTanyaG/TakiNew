import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  MessageSquare, 
  Clock, 
  Search,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  name: string;
  email: string;
  conversations_count: number;
  last_conversation: string;
  total_messages: number;
  status: string;
  recent_preview: string;
}

const AgentUsers = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersForAgent();
  }, [agentId]);

  const fetchUsersForAgent = async () => {
    try {
      // Get conversations for this agent
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('Agent_id', agentId);

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
      }

      // Group by User_id and count conversations
      const userMap = new Map();
      
      for (const conv of conversations) {
        const userId = conv.User_id;
        if (!userId) continue; // Skip if no User_id
        
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            name: '', // Will be filled from Users table
            email: '', // Will be filled from Users table
            conversations_count: 0,
            last_conversation: conv.created_at,
            recent_preview: conv.conversation_content?.substring(0, 50) + "..." || "No content available",
            total_messages: 0
          });
        }
        
        const user = userMap.get(userId);
        user.conversations_count++;
        
        // Update last conversation if this one is more recent
        if (new Date(conv.created_at) > new Date(user.last_conversation)) {
          user.last_conversation = conv.created_at;
          user.recent_preview = conv.conversation_content?.substring(0, 50) + "..." || "No content available";
        }
      }

      // Get user details from Users table
      const userIds = Array.from(userMap.keys());
      if (userIds.length > 0) {
        const { data: userDetails, error: userError } = await supabase
          .from('Users')
          .select('User_id, email')
          .in('User_id', userIds);

        if (!userError && userDetails) {
          for (const userDetail of userDetails) {
            if (userMap.has(userDetail.User_id)) {
              const user = userMap.get(userDetail.User_id);
              user.email = userDetail.email || '';
              // Generate display name from email (part before @)
              user.name = userDetail.email ? 
                userDetail.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                'Unknown User';
            }
          }
        }
      }

      // Get message counts from conversation_vectors table
      const { data: vectors, error: vectorError } = await supabase
        .from('conversation_vectors')
        .select('user_email');

      if (!vectorError && vectors) {
        for (const vector of vectors) {
          // Find user by email to match with message counts
          for (const [userId, userData] of userMap.entries()) {
            if (userData.email === vector.user_email) {
              userData.total_messages++;
              break;
            }
          }
        }
      }

      const processedUsers = Array.from(userMap.values())
        .filter(user => user.email) // Only include users with valid email
        .map(user => ({
          ...user,
          status: "active", // Default status
          last_conversation: formatLastActive(user.last_conversation)
        }));

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastActive = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    navigate(`/admin/agent/${agentId}/user/${userId}`);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
                
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">{agentName}</h1>
                  <p className="text-sm text-muted-foreground">User Management • Agent ID: {agentId}</p>
                </div>
              </div>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border border-border shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-card-foreground">{users.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {users.filter(user => user.status === "active").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <User className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {users.reduce((sum, user) => sum + user.total_messages, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card className="bg-card border border-border shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                  <Tooltip key={user.id}>
                    <TooltipTrigger asChild>
                      <Card
                        className="cursor-pointer bg-card border border-border hover:border-primary hover:shadow-soft transition-all duration-300 hover:scale-[1.02] group"
                        onClick={() => handleUserClick(user.id)}
                        onMouseEnter={() => setHoveredUser(user.id)}
                        onMouseLeave={() => setHoveredUser(null)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                                <User className="w-6 h-6 text-primary-foreground" />
                              </div>
                              
                              <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>Last active: {user.last_conversation}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="text-center">
                                <p className="text-xl font-bold text-card-foreground">{user.conversations_count}</p>
                                <p className="text-xs text-muted-foreground">Conversations</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-xl font-bold text-card-foreground">{user.total_messages}</p>
                                <p className="text-xs text-muted-foreground">Messages</p>
                              </div>

                              <Badge 
                                variant={user.status === "active" ? "default" : "secondary"}
                                className={`${user.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"} text-white`}
                              >
                                {user.status}
                              </Badge>

                              <Eye className="w-5 h-5 text-primary group-hover:text-accent transition-colors duration-200" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    
                    <TooltipContent side="top" className="max-w-sm p-4 bg-card border border-border shadow-large">
                      <div className="space-y-2">
                        <p className="font-semibold text-card-foreground">Recent Conversation</p>
                        <p className="text-sm text-muted-foreground">{user.recent_preview}</p>
                        <p className="text-xs text-muted-foreground">Click to view full conversation history</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AgentUsers;