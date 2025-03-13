import { useSupabaseClient } from '@supabase/auth-helpers-react'

const useAuth = () => {
	const supabaseClient = useSupabaseClient()

	const signOut = async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (error) {
			throw error
		}
	}

	return {
		signOut,
	}
}

export default useAuth
