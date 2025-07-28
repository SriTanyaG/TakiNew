export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversation_elevenlabs: {
        Row: {
          conversation: string
          created_at: string | null
          email: string
          embedding: string | null
          id: string
        }
        Insert: {
          conversation: string
          created_at?: string | null
          email: string
          embedding?: string | null
          id?: string
        }
        Update: {
          conversation?: string
          created_at?: string | null
          email?: string
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      conversation_vectors: {
        Row: {
          ai_response: string
          conversation_context: string
          created_at: string | null
          embedding: string
          embedding_dimensions: number | null
          embedding_model: string | null
          id: number
          metadata: Json | null
          session_id: string
          user_email: string | null
          user_input: string
          user_name: string | null
        }
        Insert: {
          ai_response: string
          conversation_context: string
          created_at?: string | null
          embedding: string
          embedding_dimensions?: number | null
          embedding_model?: string | null
          id?: number
          metadata?: Json | null
          session_id: string
          user_email?: string | null
          user_input: string
          user_name?: string | null
        }
        Update: {
          ai_response?: string
          conversation_context?: string
          created_at?: string | null
          embedding?: string
          embedding_dimensions?: number | null
          embedding_model?: string | null
          id?: number
          metadata?: Json | null
          session_id?: string
          user_email?: string | null
          user_input?: string
          user_name?: string | null
        }
        Relationships: []
      }
      conversation_vectors_elevenlabs: {
        Row: {
          ai_response: string
          conversation_context: string
          created_at: string | null
          embedding: string
          embedding_dimensions: number | null
          embedding_model: string | null
          id: number
          metadata: Json | null
          session_id: string
          user_email: string | null
          user_input: string
          user_name: string | null
        }
        Insert: {
          ai_response: string
          conversation_context: string
          created_at?: string | null
          embedding: string
          embedding_dimensions?: number | null
          embedding_model?: string | null
          id?: number
          metadata?: Json | null
          session_id: string
          user_email?: string | null
          user_input: string
          user_name?: string | null
        }
        Update: {
          ai_response?: string
          conversation_context?: string
          created_at?: string | null
          embedding?: string
          embedding_dimensions?: number | null
          embedding_model?: string | null
          id?: number
          metadata?: Json | null
          session_id?: string
          user_email?: string | null
          user_input?: string
          user_name?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          Agent_id: string | null
          Agent_name: string | null
          conversation_content: string
          conversation_id: string
          created_at: string | null
          id: number
          timestamp: string | null
          user_email: string
          User_id: string | null
        }
        Insert: {
          Agent_id?: string | null
          Agent_name?: string | null
          conversation_content: string
          conversation_id: string
          created_at?: string | null
          id?: number
          timestamp?: string | null
          user_email: string
          User_id?: string | null
        }
        Update: {
          Agent_id?: string | null
          Agent_name?: string | null
          conversation_content?: string
          conversation_id?: string
          created_at?: string | null
          id?: number
          timestamp?: string | null
          user_email?: string
          User_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_User_id_fkey"
            columns: ["User_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["User_id"]
          },
        ]
      }
      conversations_summa: {
        Row: {
          conversation_content: string
          conversation_id: string
          created_at: string | null
          id: number
          timestamp: string | null
          user_email: string
        }
        Insert: {
          conversation_content: string
          conversation_id: string
          created_at?: string | null
          id?: number
          timestamp?: string | null
          user_email: string
        }
        Update: {
          conversation_content?: string
          conversation_id?: string
          created_at?: string | null
          id?: number
          timestamp?: string | null
          user_email?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories_elevenlabs: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_voice_bot: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          "embedding 01": string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          "embedding 01"?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          "embedding 01"?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          email: string | null
          phone_number: string | null
          user_id: string | null
          User_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          phone_number?: string | null
          user_id?: string | null
          User_id?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          phone_number?: string | null
          user_id?: string | null
          User_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args:
          | { query_embedding: string; match_count?: number; filter?: Json }
          | {
              query_embedding: string
              match_threshold?: number
              match_count?: number
            }
        Returns: {
          id: number
          content: string
          metadata: Json
          embedding: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
