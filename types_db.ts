export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string
					created_at: string
					email: string
					full_name: string | null
					avatar_url: string | null
				}
				Insert: {
					id: string
					created_at?: string
					email: string
					full_name?: string | null
					avatar_url?: string | null
				}
				Update: {
					id?: string
					created_at?: string
					email?: string
					full_name?: string | null
					avatar_url?: string | null
				}
			}
			songs: {
				Row: {
					id: string
					user_id: string
					author: string
					title: string
					song_path: string
					image_path: string
					created_at: string
				}
				Insert: {
					id: string
					user_id: string
					author: string
					title: string
					song_path: string
					image_path: string
					created_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					author?: string
					title?: string
					song_path?: string
					image_path?: string
					created_at?: string
				}
			}
			liked_songs: {
				Row: {
					id: string
					user_id: string
					song_id: string
					created_at: string
				}
				Insert: {
					id: string
					user_id: string
					song_id: string
					created_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					song_id?: string
					created_at?: string
				}
			}
			playlists: {
				Row: {
					id: string
					user_id: string
					title: string
					description: string | null
					image_path: string | null
					created_at: string
				}
				Insert: {
					id: string
					user_id: string
					title: string
					description?: string | null
					image_path?: string | null
					created_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					title?: string
					description?: string | null
					image_path?: string | null
					created_at?: string
				}
			}
			playlist_songs: {
				Row: {
					id: string
					playlist_id: string
					song_id: string
					created_at: string
				}
				Insert: {
					id: string
					playlist_id: string
					song_id: string
					created_at?: string
				}
				Update: {
					id?: string
					playlist_id?: string
					song_id?: string
					created_at?: string
				}
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
	}
}
