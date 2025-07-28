import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Search,
  LogOut,
  Bot,
  Activity,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  name: string;
  users_count: number;
  conversations_count: number;
  status: string;
  last_active: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // Get unique agent IDs from conversations table
      const { data: agentData, error } = await supabase
        .from('conversations')
        .select('Agent_id')
        .not('Agent_id', 'is', null);

      if (error) throw error;

      // Get unique agent IDs
      const uniqueAgentIds = [...new Set(agentData?.map(conv => conv.Agent_id) || [])];

      // Get agent details using edge function
      const { data: agentDetailsResponse, error: agentError } = await supabase.functions.invoke('get-agent-details', {
        body: { agent_ids: uniqueAgentIds }
      });

      let agentDetails = [];
      if (agentError) {
        console.error('Error fetching agent details:', agentError);
      } else {
        agentDetails = agentDetailsResponse?.data || [];
      }

      // Group by agent and get counts
      const agentMap = new Map();
      
      for (const conv of agentData) {
        const key = conv.Agent_id;
        if (!agentMap.has(key)) {
          const agentDetail = agentDetails?.find((detail: any) => detail.Agent_id === conv.Agent_id);
          agentMap.set(key, {
            id: conv.Agent_id,
            name: agentDetail?.Agent_name || `Agent ${conv.Agent_id}`,
            conversations_count: 0,
            users: new Set()
          });
        }
        
        agentMap.get(key).conversations_count++;
      }

      // Get user counts for each agent using User_id
      const { data: userData, error: userError } = await supabase
        .from('conversations')
        .select('Agent_id, User_id')
        .not('Agent_id', 'is', null)
        .not('User_id', 'is', null);

      if (userError) throw userError;

      for (const user of userData) {
        if (agentMap.has(user.Agent_id)) {
          agentMap.get(user.Agent_id).users.add(user.User_id);
        }
      }

      const processedAgents = Array.from(agentMap.values()).map(agent => ({
        id: agent.id,
        name: agent.name,
        users_count: agent.users.size,
        conversations_count: agent.conversations_count,
        status: "active", // Default to active since we don't have status in DB
        last_active: "Recently" // Default since we don't have last_active in DB
      }));

      setAgents(processedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleAgentClick = (agentId: string) => {
    navigate(`/admin/agent/${agentId}`);
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalUsers: agents.reduce((sum, agent) => sum + agent.users_count, 0),
    totalConversations: agents.reduce((sum, agent) => sum + agent.conversations_count, 0),
    activeAgents: agents.filter(agent => agent.status === "active").length,
    totalAgents: agents.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-soft">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Voice Bot Management Platform</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-card-foreground">{totalStats.totalUsers}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversations</p>
                  <p className="text-3xl font-bold text-card-foreground">{totalStats.totalConversations}</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-3xl font-bold text-card-foreground">{totalStats.activeAgents}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-3xl font-bold text-card-foreground">{totalStats.totalAgents}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Bot className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Section */}
        <Card className="bg-card border border-border shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-card-foreground">Voice Agents</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAgents.map((agent, index) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer bg-card border border-border hover:border-primary hover:shadow-soft transition-all duration-300 hover:scale-[1.02] group"
                  onClick={() => handleAgentClick(agent.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                          <Bot className="w-6 h-6 text-primary-foreground" />
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">ID: {agent.id}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {agent.last_active}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-card-foreground">{agent.users_count}</p>
                          <p className="text-xs text-muted-foreground">Users</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-card-foreground">{agent.conversations_count}</p>
                          <p className="text-xs text-muted-foreground">Conversations</p>
                        </div>

                        <Badge 
                          variant={agent.status === "active" ? "default" : "secondary"}
                          className={`${agent.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"} text-white`}
                        >
                          {agent.status}
                        </Badge>

                        <div className="w-2 h-2 bg-primary rounded-full group-hover:bg-accent transition-colors duration-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;