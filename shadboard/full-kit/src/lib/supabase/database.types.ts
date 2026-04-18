/**
 * Replace with generated types:
 * `supabase gen types typescript --project-id … > src/lib/supabase/database.types.ts`
 * (modal.md §2.6).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
