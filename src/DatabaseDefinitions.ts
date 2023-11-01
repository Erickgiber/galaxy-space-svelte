export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			posts: {
				Row: {
					created_at: string
					email: string | null
					id: number
					image_url: string | null
					post_id: string
					text: string | null
					username: string | null
					uuid: string | null
				}
				Insert: {
					created_at?: string
					email?: string | null
					id?: number
					image_url?: string | null
					post_id?: string
					text?: string | null
					username?: string | null
					uuid?: string | null
				}
				Update: {
					created_at?: string
					email?: string | null
					id?: number
					image_url?: string | null
					post_id?: string
					text?: string | null
					username?: string | null
					uuid?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'posts_email_fkey'
						columns: ['email']
						referencedRelation: 'register'
						referencedColumns: ['email']
					},
					{
						foreignKeyName: 'posts_username_fkey'
						columns: ['username']
						referencedRelation: 'register'
						referencedColumns: ['username']
					},
					{
						foreignKeyName: 'posts_uuid_fkey'
						columns: ['uuid']
						referencedRelation: 'register'
						referencedColumns: ['uuid']
					}
				]
			}
			profiles: {
				Row: {
					cover_photo_url: string | null
					created_at: string
					description: string
					email: string | null
					id: number
					is_star: boolean
					lastname: string | null
					name: string | null
					photo_url: string | null
					public_name: string | null
					username: string | null
					uuid: string
				}
				Insert: {
					cover_photo_url?: string | null
					created_at?: string
					description?: string
					email?: string | null
					id?: number
					is_star?: boolean
					lastname?: string | null
					name?: string | null
					photo_url?: string | null
					public_name?: string | null
					username?: string | null
					uuid?: string
				}
				Update: {
					cover_photo_url?: string | null
					created_at?: string
					description?: string
					email?: string | null
					id?: number
					is_star?: boolean
					lastname?: string | null
					name?: string | null
					photo_url?: string | null
					public_name?: string | null
					username?: string | null
					uuid?: string
				}
				Relationships: [
					{
						foreignKeyName: 'profiles_email_fkey'
						columns: ['email']
						referencedRelation: 'register'
						referencedColumns: ['email']
					},
					{
						foreignKeyName: 'profiles_public_name_fkey'
						columns: ['public_name']
						referencedRelation: 'register'
						referencedColumns: ['public_name']
					},
					{
						foreignKeyName: 'profiles_username_fkey'
						columns: ['username']
						referencedRelation: 'register'
						referencedColumns: ['username']
					},
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
					email: string
					id: number
					public_name: string
					role: string
					username: string
					uuid: string
				}
				Insert: {
					created_at?: string
					email: string
					id?: number
					public_name: string
					role?: string
					username: string
					uuid?: string
				}
				Update: {
					created_at?: string
					email?: string
					id?: number
					public_name?: string
					role?: string
					username?: string
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
