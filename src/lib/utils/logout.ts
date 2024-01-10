import { goto } from '$app/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toast } from '@zerodevx/svelte-toast'

export const handleLogout = async (supabase: SupabaseClient) => {
	const toastLogout = toast.push('Logging out...')
	await supabase.auth.signOut()
	toast.pop(toastLogout)
	goto('/login')
}
