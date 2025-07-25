export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      parking_reservations: {
        Row: {
          cancelled_at: string | null
          contact_phone: string
          created_at: string
          duration_hours: number
          estimated_arrival_time: string
          id: string
          parking_space_id: string
          payment_method: string
          payment_status: string | null
          reservation_status: string
          special_instructions: string | null
          stripe_payment_intent_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
          vehicle_number: string | null
          vehicle_type: string
        }
        Insert: {
          cancelled_at?: string | null
          contact_phone: string
          created_at?: string
          duration_hours: number
          estimated_arrival_time: string
          id?: string
          parking_space_id: string
          payment_method: string
          payment_status?: string | null
          reservation_status?: string
          special_instructions?: string | null
          stripe_payment_intent_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          vehicle_number?: string | null
          vehicle_type: string
        }
        Update: {
          cancelled_at?: string | null
          contact_phone?: string
          created_at?: string
          duration_hours?: number
          estimated_arrival_time?: string
          id?: string
          parking_space_id?: string
          payment_method?: string
          payment_status?: string | null
          reservation_status?: string
          special_instructions?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          vehicle_number?: string | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_reservations_parking_space_id_fkey"
            columns: ["parking_space_id"]
            isOneToOne: false
            referencedRelation: "parking_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_spaces: {
        Row: {
          accepts_cash_on_arrival: boolean | null
          additional_charges: string | null
          amenities: string[] | null
          available_spaces: number | null
          capacity: number
          contact_email: string
          contact_phone: string
          created_at: string
          description: string
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          precise_location: string | null
          price_per_hour: number
          space_name: string
          updated_at: string
          user_id: string
          vehicle_counts: Json | null
          vehicle_types: string[] | null
        }
        Insert: {
          accepts_cash_on_arrival?: boolean | null
          additional_charges?: string | null
          amenities?: string[] | null
          available_spaces?: number | null
          capacity: number
          contact_email: string
          contact_phone: string
          created_at?: string
          description: string
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          precise_location?: string | null
          price_per_hour: number
          space_name: string
          updated_at?: string
          user_id: string
          vehicle_counts?: Json | null
          vehicle_types?: string[] | null
        }
        Update: {
          accepts_cash_on_arrival?: boolean | null
          additional_charges?: string | null
          amenities?: string[] | null
          available_spaces?: number | null
          capacity?: number
          contact_email?: string
          contact_phone?: string
          created_at?: string
          description?: string
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          precise_location?: string | null
          price_per_hour?: number
          space_name?: string
          updated_at?: string
          user_id?: string
          vehicle_counts?: Json | null
          vehicle_types?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
