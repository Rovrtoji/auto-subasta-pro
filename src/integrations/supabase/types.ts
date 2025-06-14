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
