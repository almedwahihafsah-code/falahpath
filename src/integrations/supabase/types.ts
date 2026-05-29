export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          body: string | null
          committed_at: string
          completed_at: string | null
          created_at: string
          domain_code: string
          id: string
          intent_code: string
          status: string
          title: string
          updated_at: string
          user_id: string
          verse_id: string
        }
        Insert: {
          body?: string | null
          committed_at?: string
          completed_at?: string | null
          created_at?: string
          domain_code: string
          id?: string
          intent_code: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          verse_id: string
        }
        Update: {
          body?: string | null
          committed_at?: string
          completed_at?: string | null
          created_at?: string
          domain_code?: string
          id?: string
          intent_code?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "actions_intent_code_fkey"
            columns: ["intent_code"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "actions_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      ayah_domains: {
        Row: {
          confidence_score: number | null
          created_at: string
          domain_code: string
          is_primary: boolean
          updated_at: string
          verse_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          domain_code: string
          is_primary?: boolean
          updated_at?: string
          verse_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          domain_code?: string
          is_primary?: boolean
          updated_at?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ayah_domains_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "ayah_domains_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      classification_taxonomy: {
        Row: {
          code: string
          description: string | null
          id: string
          label_ar: string
          parent_code: string | null
          sort_order: number | null
          type: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: string
          label_ar: string
          parent_code?: string | null
          sort_order?: number | null
          type: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: string
          label_ar?: string
          parent_code?: string | null
          sort_order?: number | null
          type?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          message_type: string
          name: string | null
          read_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          message_type: string
          name?: string | null
          read_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          message_type?: string
          name?: string | null
          read_at?: string | null
          status?: string
        }
        Relationships: []
      }
      daily_journal: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          id: string
          note: string | null
          peace_level: number | null
          quran_juz: number | null
          reflection_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          note?: string | null
          peace_level?: number | null
          quran_juz?: number | null
          reflection_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          note?: string | null
          peace_level?: number | null
          quran_juz?: number | null
          reflection_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_scores: {
        Row: {
          created_at: string
          domain_id: number
          id: string
          score: number
          user_id: string
          week_of: string
        }
        Insert: {
          created_at?: string
          domain_id: number
          id?: string
          score: number
          user_id: string
          week_of?: string
        }
        Update: {
          created_at?: string
          domain_id?: number
          id?: string
          score?: number
          user_id?: string
          week_of?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          anchor_verse_ref: string | null
          code: string
          created_at: string
          description_ar: string | null
          is_active: boolean
          label_ar: string
          label_en: string | null
          sort_order: number
          subtitle_ar: string | null
          updated_at: string
        }
        Insert: {
          anchor_verse_ref?: string | null
          code: string
          created_at?: string
          description_ar?: string | null
          is_active?: boolean
          label_ar: string
          label_en?: string | null
          sort_order: number
          subtitle_ar?: string | null
          updated_at?: string
        }
        Update: {
          anchor_verse_ref?: string | null
          code?: string
          created_at?: string
          description_ar?: string | null
          is_active?: boolean
          label_ar?: string
          label_en?: string | null
          sort_order?: number
          subtitle_ar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      falahi_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      function_engagements: {
        Row: {
          created_at: string
          function: string
          id: string
          points: number
          source: string
          user_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          function: string
          id?: string
          points?: number
          source?: string
          user_id: string
          verse_id: string
        }
        Update: {
          created_at?: string
          function?: string
          id?: string
          points?: number
          source?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: []
      }
      guidance_history: {
        Row: {
          actions: Json
          created_at: string
          domain: string | null
          dua: string
          guidance_domain: string | null
          id: string
          mood: string | null
          reflection: string
          situation: string | null
          user_id: string
          verse_arabic: string
          verse_reference: string
        }
        Insert: {
          actions: Json
          created_at?: string
          domain?: string | null
          dua: string
          guidance_domain?: string | null
          id?: string
          mood?: string | null
          reflection: string
          situation?: string | null
          user_id: string
          verse_arabic: string
          verse_reference: string
        }
        Update: {
          actions?: Json
          created_at?: string
          domain?: string | null
          dua?: string
          guidance_domain?: string | null
          id?: string
          mood?: string | null
          reflection?: string
          situation?: string | null
          user_id?: string
          verse_arabic?: string
          verse_reference?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          created_at: string
          date: string
          habit_key: string
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          habit_key: string
          id?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          habit_key?: string
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      intents: {
        Row: {
          code: string
          created_at: string
          description_ar: string
          is_active: boolean
          label_ar: string
          label_en: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description_ar: string
          is_active?: boolean
          label_ar: string
          label_en?: string | null
          sort_order: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description_ar?: string
          is_active?: boolean
          label_ar?: string
          label_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string
          confirmed: boolean
          email: string
          id: string
          locale: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirmation_token?: string
          confirmed?: boolean
          email: string
          id?: string
          locale?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirmation_token?: string
          confirmed?: boolean
          email?: string
          id?: string
          locale?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      reflections: {
        Row: {
          action_id: string | null
          body: string
          clarity_score: number | null
          created_at: string
          difficulty_score: number | null
          domain_code: string
          id: string
          intent_code: string
          updated_at: string
          user_id: string
          verse_id: string
        }
        Insert: {
          action_id?: string | null
          body: string
          clarity_score?: number | null
          created_at?: string
          difficulty_score?: number | null
          domain_code: string
          id?: string
          intent_code: string
          updated_at?: string
          user_id: string
          verse_id: string
        }
        Update: {
          action_id?: string | null
          body?: string
          clarity_score?: number | null
          created_at?: string
          difficulty_score?: number | null
          domain_code?: string
          id?: string
          intent_code?: string
          updated_at?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reflections_intent_code_fkey"
            columns: ["intent_code"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reflections_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      surahs: {
        Row: {
          name_ar: string
          name_translit: string
          number: number
          order_revelation: number | null
          revelation: string
          verses_count: number
        }
        Insert: {
          name_ar: string
          name_translit: string
          number: number
          order_revelation?: number | null
          revelation: string
          verses_count: number
        }
        Update: {
          name_ar?: string
          name_translit?: string
          number?: number
          order_revelation?: number | null
          revelation?: string
          verses_count?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          domain_id: number | null
          due_date: string | null
          id: string
          points: number
          priority: string
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain_id?: number | null
          due_date?: string | null
          id?: string
          points?: number
          priority?: string
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain_id?: number | null
          due_date?: string | null
          id?: string
          points?: number
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profile_signals: {
        Row: {
          dominant_domain_code: string | null
          dominant_intent_code: string | null
          last_active_at: string | null
          streak_days: number | null
          total_actions: number | null
          total_journeys: number | null
          total_reflections: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          dominant_domain_code?: string | null
          dominant_intent_code?: string | null
          last_active_at?: string | null
          streak_days?: number | null
          total_actions?: number | null
          total_journeys?: number | null
          total_reflections?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          dominant_domain_code?: string | null
          dominant_intent_code?: string | null
          last_active_at?: string | null
          streak_days?: number | null
          total_actions?: number | null
          total_journeys?: number | null
          total_reflections?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age_bracket: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string
          initial_challenge: string | null
          initial_intent_code: string | null
          locale: string | null
          onboarding_completed_at: string | null
          preferred_domains: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_bracket?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          initial_challenge?: string | null
          initial_intent_code?: string | null
          locale?: string | null
          onboarding_completed_at?: string | null
          preferred_domains?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_bracket?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          initial_challenge?: string | null
          initial_intent_code?: string | null
          locale?: string | null
          onboarding_completed_at?: string | null
          preferred_domains?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          last_activity_date: string | null
          level: number
          streak_days: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verse_bookmarks: {
        Row: {
          created_at: string
          id: string
          note: string | null
          user_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
          verse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
          verse_id?: string
        }
        Relationships: []
      }
      verse_classifications: {
        Row: {
          context: string | null
          created_at: string
          created_by: string | null
          domain_code: string | null
          educational_effects: string[] | null
          function: string | null
          id: string
          notes: string | null
          sub_domain: string | null
          tags: string[] | null
          themes: string[] | null
          updated_at: string
          verse_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          domain_code?: string | null
          educational_effects?: string[] | null
          function?: string | null
          id?: string
          notes?: string | null
          sub_domain?: string | null
          tags?: string[] | null
          themes?: string[] | null
          updated_at?: string
          verse_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          domain_code?: string | null
          educational_effects?: string[] | null
          function?: string | null
          id?: string
          notes?: string | null
          sub_domain?: string | null
          tags?: string[] | null
          themes?: string[] | null
          updated_at?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verse_classifications_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      verses: {
        Row: {
          created_at: string
          id: string
          juz: number | null
          page: number | null
          surah_number: number
          text_ar: string
          text_simple: string | null
          verse_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          juz?: number | null
          page?: number | null
          surah_number: number
          text_ar: string
          text_simple?: string | null
          verse_number: number
        }
        Update: {
          created_at?: string
          id?: string
          juz?: number | null
          page?: number | null
          surah_number?: number
          text_ar?: string
          text_simple?: string | null
          verse_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
