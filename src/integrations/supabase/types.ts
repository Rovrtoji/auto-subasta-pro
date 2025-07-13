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
      appointments: {
        Row: {
          cliente_email: string
          cliente_nombre: string
          cliente_telefono: string
          created_at: string
          estado: string
          fecha: string
          hora: string
          id: string
          mensaje: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cliente_email: string
          cliente_nombre: string
          cliente_telefono: string
          created_at?: string
          estado?: string
          fecha: string
          hora: string
          id?: string
          mensaje?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cliente_email?: string
          cliente_nombre?: string
          cliente_telefono?: string
          created_at?: string
          estado?: string
          fecha?: string
          hora?: string
          id?: string
          mensaje?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          activa: boolean
          created_at: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          participantes: string[] | null
          precio_actual: number
          precio_inicial: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          activa?: boolean
          created_at?: string
          fecha_fin: string
          fecha_inicio: string
          id?: string
          participantes?: string[] | null
          precio_actual: number
          precio_inicial: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          activa?: boolean
          created_at?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          participantes?: string[] | null
          precio_actual?: number
          precio_inicial?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auctions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          auction_id: string
          cantidad: number
          created_at: string
          fecha: string
          id: string
          user_id: string
          user_name: string
        }
        Insert: {
          auction_id: string
          cantidad: number
          created_at?: string
          fecha?: string
          id?: string
          user_id: string
          user_name: string
        }
        Update: {
          auction_id?: string
          cantidad?: number
          created_at?: string
          fecha?: string
          id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          client_name: string
          id: string
          room_id: string | null
          sender: string
          text: string
          timestamp: string
        }
        Insert: {
          client_name: string
          id?: string
          room_id?: string | null
          sender: string
          text: string
          timestamp?: string
        }
        Update: {
          client_name?: string
          id?: string
          room_id?: string | null
          sender?: string
          text?: string
          timestamp?: string
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
          client_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          client_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          client_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          id: string
          message: string | null
          offer_amount: number
          status: string
          updated_at: string
          user_email: string
          user_id: string | null
          user_name: string
          user_phone: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          offer_amount: number
          status?: string
          updated_at?: string
          user_email: string
          user_id?: string | null
          user_name: string
          user_phone?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          offer_amount?: number
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
          user_name?: string
          user_phone?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          fecha_registro: string
          id: string
          nombre: string
          rol: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fecha_registro?: string
          id: string
          nombre: string
          rol?: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fecha_registro?: string
          id?: string
          nombre?: string
          rol?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          cliente_email: string
          cliente_nombre: string
          cliente_telefono: string
          created_at: string
          estado: string
          fecha_apartado: string
          id: string
          monto_seña: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cliente_email: string
          cliente_nombre: string
          cliente_telefono: string
          created_at?: string
          estado?: string
          fecha_apartado?: string
          id?: string
          monto_seña: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cliente_email?: string
          cliente_nombre?: string
          cliente_telefono?: string
          created_at?: string
          estado?: string
          fecha_apartado?: string
          id?: string
          monto_seña?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          orden: number | null
          url: string
          vehicle_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          orden?: number | null
          url: string
          vehicle_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          orden?: number | null
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          estado_anterior: string | null
          estado_nuevo: string
          id: string
          motivo: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          estado_anterior?: string | null
          estado_nuevo: string
          id?: string
          motivo?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          estado_anterior?: string | null
          estado_nuevo?: string
          id?: string
          motivo?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_status_history_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          año: number
          apartado: boolean
          caracteristicas: string[] | null
          color: string
          combustible: string
          created_at: string
          descripcion: string | null
          en_subasta: boolean
          estado_general: string
          fecha_creacion: string
          id: string
          imagen: string | null
          imagenes: string[] | null
          kilometraje: number
          marca: string
          modelo: string
          precio: number
          transmision: string
          updated_at: string
        }
        Insert: {
          año: number
          apartado?: boolean
          caracteristicas?: string[] | null
          color: string
          combustible: string
          created_at?: string
          descripcion?: string | null
          en_subasta?: boolean
          estado_general?: string
          fecha_creacion?: string
          id?: string
          imagen?: string | null
          imagenes?: string[] | null
          kilometraje?: number
          marca: string
          modelo: string
          precio: number
          transmision: string
          updated_at?: string
        }
        Update: {
          año?: number
          apartado?: boolean
          caracteristicas?: string[] | null
          color?: string
          combustible?: string
          created_at?: string
          descripcion?: string | null
          en_subasta?: boolean
          estado_general?: string
          fecha_creacion?: string
          id?: string
          imagen?: string | null
          imagenes?: string[] | null
          kilometraje?: number
          marca?: string
          modelo?: string
          precio?: number
          transmision?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_inventory_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_vehiculos: number
          vehiculos_disponibles: number
          vehiculos_apartados: number
          vehiculos_en_subasta: number
          valor_total_inventario: number
        }[]
      }
      manage_vehicle_images: {
        Args: {
          p_vehicle_id: string
          p_images: string[]
          p_primary_image?: string
        }
        Returns: undefined
      }
      update_vehicle_status: {
        Args: {
          p_vehicle_id: string
          p_nuevo_estado: string
          p_motivo?: string
        }
        Returns: undefined
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
