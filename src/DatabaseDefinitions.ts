export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					cover_photo_url: string | null
					created_at: string
					id: number
					lastname: string | null
					name: string | null
					photo_url: string | null
					uuid: string
				}
				Insert: {
					cover_photo_url?: string | null
					created_at?: string
					id?: number
					lastname?: string | null
					name?: string | null
					photo_url?: string | null
					uuid: string
				}
				Update: {
					cover_photo_url?: string | null
					created_at?: string
					id?: number
					lastname?: string | null
					name?: string | null
					photo_url?: string | null
					uuid?: string
				}
				Relationships: [
					{
						foreignKeyName: 'profiles_uuid_fkey'
						columns: ['uuid']
						referencedRelation: 'register'
						referencedColumns: ['uuid']
					}
				]
			}
			register: {
				Row: {
					created_at: string
					email: string | null
					id: number
					public_name: string | null
					username: string | null
					uuid: string
				}
				Insert: {
					created_at?: string
					email?: string | null
					id?: number
					public_name?: string | null
					username?: string | null
					uuid?: string
				}
				Update: {
					created_at?: string
					email?: string | null
					id?: number
					public_name?: string | null
					username?: string | null
					uuid?: string
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
