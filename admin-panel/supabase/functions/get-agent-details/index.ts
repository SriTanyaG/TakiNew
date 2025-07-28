import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

console.log("get-agent-details function started")

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

Deno.serve(async (req) => {
  console.log(`${req.method} ${req.url}`)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { agent_ids } = await req.json()
    console.log('Fetching agent details for:', agent_ids)

    if (!agent_ids || !Array.isArray(agent_ids)) {
      throw new Error('agent_ids array is required')
    }

    // Fetch agent details directly from Agent_details table
    const { data, error } = await supabase
      .from('Agent_details')
      .select('Agent_id, Agent_name')
      .in('Agent_id', agent_ids)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Successfully fetched agent details:', data)

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-agent-details function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})