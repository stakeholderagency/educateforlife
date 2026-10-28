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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          room_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          room_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      community_team_members: {
        Row: {
          created_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "community_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      community_teams: {
        Row: {
          archived_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          kind: string
          name: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          name: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      connection_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["connection_request_status"]
          to_legacy_id: string | null
          to_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["connection_request_status"]
          to_legacy_id?: string | null
          to_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["connection_request_status"]
          to_legacy_id?: string | null
          to_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_to_legacy_id_fkey"
            columns: ["to_legacy_id"]
            isOneToOne: false
            referencedRelation: "legacy_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_to_legacy_id_fkey"
            columns: ["to_legacy_id"]
            isOneToOne: false
            referencedRelation: "public_legacy_members"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          headline: string | null
          id: string
          join_date: string | null
          last_name: string | null
          location_city: string | null
          location_country: string | null
          member_type: Database["public"]["Enums"]["member_type"][] | null
          referral_count: number
          referrer_email: string | null
          referrer_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          headline?: string | null
          id?: string
          join_date?: string | null
          last_name?: string | null
          location_city?: string | null
          location_country?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          referral_count?: number
          referrer_email?: string | null
          referrer_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          headline?: string | null
          id?: string
          join_date?: string | null
          last_name?: string | null
          location_city?: string | null
          location_country?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          referral_count?: number
          referrer_email?: string | null
          referrer_name?: string | null
        }
        Relationships: []
      }
      library_attachments: {
        Row: {
          created_at: string
          height: number | null
          id: string
          mime_type: string | null
          original_url: string | null
          post_id: string
          size_bytes: number | null
          storage_path: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_url?: string | null
          post_id: string
          size_bytes?: number | null
          storage_path: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_url?: string | null
          post_id?: string
          size_bytes?: number | null
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "library_attachments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "library_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      library_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          source_id: string | null
          source_url: string | null
          topic_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          source_id?: string | null
          source_url?: string | null
          topic_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          source_id?: string | null
          source_url?: string | null
          topic_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      library_posts: {
        Row: {
          author_avatar_url: string | null
          author_display_name: string | null
          body_html: string | null
          body_text: string | null
          created_at: string
          id: string
          parent_post_id: string | null
          source_created_at: string | null
          source_id: string | null
          source_url: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_display_name?: string | null
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          id?: string
          parent_post_id?: string | null
          source_created_at?: string | null
          source_id?: string | null
          source_url?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_display_name?: string | null
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          id?: string
          parent_post_id?: string | null
          source_created_at?: string | null
          source_id?: string | null
          source_url?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "library_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "library_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      library_topics: {
        Row: {
          author_avatar_url: string | null
          author_display_name: string | null
          category_id: string
          created_at: string
          id: string
          last_activity_at: string | null
          post_count: number
          slug: string
          source_created_at: string | null
          source_id: string | null
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_display_name?: string | null
          category_id: string
          created_at?: string
          id?: string
          last_activity_at?: string | null
          post_count?: number
          slug: string
          source_created_at?: string | null
          source_id?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_display_name?: string | null
          category_id?: string
          created_at?: string
          id?: string
          last_activity_at?: string | null
          post_count?: number
          slug?: string
          source_created_at?: string | null
          source_id?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "library_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      member_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          completed_at: string
          created_at: string
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          completed_at?: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          completed_at?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      member_interests: {
        Row: {
          category: Database["public"]["Enums"]["interest_category"]
          created_at: string
          id: string
          interest: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["interest_category"]
          created_at?: string
          id?: string
          interest: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["interest_category"]
          created_at?: string
          id?: string
          interest?: string
          user_id?: string
        }
        Relationships: []
      }
      member_work: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          organization_domain: string | null
          organization_name: string
          role_title: string | null
          start_date: string | null
          updated_at: string
          user_id: string
          work_type: Database["public"]["Enums"]["work_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          organization_domain?: string | null
          organization_name: string
          role_title?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
          work_type: Database["public"]["Enums"]["work_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          organization_domain?: string | null
          organization_name?: string
          role_title?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
          work_type?: Database["public"]["Enums"]["work_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          full_name: string | null
          headline: string | null
          id: string
          join_date: string | null
          languages: string[] | null
          last_name: string | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          looking_for: string | null
          member_type: Database["public"]["Enums"]["member_type"][] | null
          mission_statement: string | null
          offering: string | null
          onboarding_completed: boolean
          phone: string | null
          referral_count: number
          referrer_email: string | null
          referrer_name: string | null
          skills: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          join_date?: string | null
          languages?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          mission_statement?: string | null
          offering?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          referral_count?: number
          referrer_email?: string | null
          referrer_name?: string | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          join_date?: string | null
          languages?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          mission_statement?: string | null
          offering?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          referral_count?: number
          referrer_email?: string | null
          referrer_name?: string | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_room_hosts: {
        Row: {
          host_room_url: string
          room_id: string
        }
        Insert: {
          host_room_url: string
          room_id: string
        }
        Update: {
          host_room_url?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_room_hosts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "video_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      video_rooms: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          kind: string
          room_url: string
          team_id: string | null
          whereby_meeting_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          kind: string
          room_url: string
          team_id?: string | null
          whereby_meeting_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          kind?: string
          room_url?: string
          team_id?: string | null
          whereby_meeting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_rooms_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "community_teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_legacy_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          first_name: string | null
          headline: string | null
          id: string | null
          join_date: string | null
          last_name: string | null
          location_city: string | null
          location_country: string | null
          member_type: Database["public"]["Enums"]["member_type"][] | null
          referral_count: number | null
          referrer_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: never
          first_name?: never
          headline?: string | null
          id?: string | null
          join_date?: string | null
          last_name?: never
          location_city?: string | null
          location_country?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          referral_count?: number | null
          referrer_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: never
          first_name?: never
          headline?: string | null
          id?: string | null
          join_date?: string | null
          last_name?: never
          location_city?: string | null
          location_country?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          referral_count?: number | null
          referrer_name?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          first_name: string | null
          full_name: string | null
          headline: string | null
          id: string | null
          join_date: string | null
          languages: string[] | null
          last_name: string | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          looking_for: string | null
          member_type: Database["public"]["Enums"]["member_type"][] | null
          mission_statement: string | null
          offering: string | null
          onboarding_completed: boolean | null
          referral_count: number | null
          skills: string[] | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: never
          first_name?: never
          full_name?: never
          headline?: string | null
          id?: string | null
          join_date?: string | null
          languages?: string[] | null
          last_name?: never
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          mission_statement?: string | null
          offering?: string | null
          onboarding_completed?: boolean | null
          referral_count?: number | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: never
          first_name?: never
          full_name?: never
          headline?: string | null
          id?: string | null
          join_date?: string | null
          languages?: string[] | null
          last_name?: never
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string | null
          member_type?: Database["public"]["Enums"]["member_type"][] | null
          mission_statement?: string | null
          offering?: string | null
          onboarding_completed?: boolean | null
          referral_count?: number | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_member_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_community_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      purge_old_chat_messages: { Args: never; Returns: undefined }
    }
    Enums: {
      activity_type:
        | "event"
        | "course"
        | "project"
        | "contribution"
        | "mentoring"
        | "workshop"
      app_role: "admin" | "moderator" | "member"
      connection_request_status: "pending" | "accepted" | "declined"
      interest_category: "passion" | "learning" | "expertise" | "seeking"
      member_type: "entrepreneur" | "academic" | "learner" | "professional"
      work_type:
        | "startup"
        | "academic_institution"
        | "organization"
        | "independent"
        | "other"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: [
        "event",
        "course",
        "project",
        "contribution",
        "mentoring",
        "workshop",
      ],
      app_role: ["admin", "moderator", "member"],
      connection_request_status: ["pending", "accepted", "declined"],
      interest_category: ["passion", "learning", "expertise", "seeking"],
      member_type: ["entrepreneur", "academic", "learner", "professional"],
      work_type: [
        "startup",
        "academic_institution",
        "organization",
        "independent",
        "other",
      ],
    },
  },
} as const
