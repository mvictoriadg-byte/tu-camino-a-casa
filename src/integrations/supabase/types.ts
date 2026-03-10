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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      housing_aids: {
        Row: {
          active: boolean
          age_limit: number | null
          aid_type: string
          benefit_amount_estimate: number | null
          benefit_description: string
          created_at: string
          family_conditions: string | null
          first_home_required: boolean | null
          id: string
          impact_type: Database["public"]["Enums"]["aid_impact_type"]
          income_limit: number | null
          max_financing_percent: number | null
          min_age: number | null
          name: string
          notes: string | null
          property_price_limit: number | null
          region: string
          residency_years_required: number | null
        }
        Insert: {
          active?: boolean
          age_limit?: number | null
          aid_type: string
          benefit_amount_estimate?: number | null
          benefit_description: string
          created_at?: string
          family_conditions?: string | null
          first_home_required?: boolean | null
          id?: string
          impact_type: Database["public"]["Enums"]["aid_impact_type"]
          income_limit?: number | null
          max_financing_percent?: number | null
          min_age?: number | null
          name: string
          notes?: string | null
          property_price_limit?: number | null
          region: string
          residency_years_required?: number | null
        }
        Update: {
          active?: boolean
          age_limit?: number | null
          aid_type?: string
          benefit_amount_estimate?: number | null
          benefit_description?: string
          created_at?: string
          family_conditions?: string | null
          first_home_required?: boolean | null
          id?: string
          impact_type?: Database["public"]["Enums"]["aid_impact_type"]
          income_limit?: number | null
          max_financing_percent?: number | null
          min_age?: number | null
          name?: string
          notes?: string | null
          property_price_limit?: number | null
          region?: string
          residency_years_required?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          month_label: string
          month_number: number
          saved_amount: number
          target_amount: number
          total_upfront: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          month_label: string
          month_number: number
          saved_amount?: number
          target_amount?: number
          total_upfront?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          month_label?: string
          month_number?: number
          saved_amount?: number
          target_amount?: number
          total_upfront?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_financial_data: {
        Row: {
          age: number
          city: string
          co_buyers: Json | null
          created_at: string
          employment_status: string
          first_home: boolean
          id: string
          monthly_debts: number
          monthly_income: number
          monthly_savings: number
          mortgage_percent: number
          num_buyers: number
          number_of_children: number
          property_type: string
          reform_state: string
          result_json: Json | null
          rooms: string
          savings: number
          size_sqm: number
          updated_at: string
          user_id: string
          zone: string
        }
        Insert: {
          age: number
          city: string
          co_buyers?: Json | null
          created_at?: string
          employment_status: string
          first_home?: boolean
          id?: string
          monthly_debts?: number
          monthly_income?: number
          monthly_savings?: number
          mortgage_percent?: number
          num_buyers?: number
          number_of_children?: number
          property_type: string
          reform_state: string
          result_json?: Json | null
          rooms: string
          savings?: number
          size_sqm?: number
          updated_at?: string
          user_id: string
          zone: string
        }
        Update: {
          age?: number
          city?: string
          co_buyers?: Json | null
          created_at?: string
          employment_status?: string
          first_home?: boolean
          id?: string
          monthly_debts?: number
          monthly_income?: number
          monthly_savings?: number
          mortgage_percent?: number
          num_buyers?: number
          number_of_children?: number
          property_type?: string
          reform_state?: string
          result_json?: Json | null
          rooms?: string
          savings?: number
          size_sqm?: number
          updated_at?: string
          user_id?: string
          zone?: string
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
      user_wishlist: {
        Row: {
          created_at: string
          estimated_price: number | null
          id: string
          notes: string | null
          title: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_price?: number | null
          id?: string
          notes?: string | null
          title?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_price?: number | null
          id?: string
          notes?: string | null
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      aid_impact_type:
        | "financing_increase"
        | "downpayment_reduction"
        | "grant"
        | "tax_reduction"
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
      aid_impact_type: [
        "financing_increase",
        "downpayment_reduction",
        "grant",
        "tax_reduction",
      ],
      app_role: ["admin", "user"],
    },
  },
} as const
