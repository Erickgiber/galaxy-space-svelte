<script lang="ts">
	import { invalidate } from '$app/navigation'
	import Spinner from '$lib/components/ui/Spinner.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { loadTheme } from '$lib/utils/loadTheme'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'
	import { onMount } from 'svelte'
	import '../app.scss'
	export let data

	// Optionally set default options here
	const options: SvelteToastOptions = {
		theme: {
			'--toastBackground': '#000',
			'--toastColor': '#fff',
			'--toastProgressBackground': 'va(--primary)'
		},
		intro: {
			y: -100,
			opacity: 0
		},
		dismissable: false
	}

	// @ts-ignore
	let { supabase, session, user } = data
	// @ts-ignore
	$: ({ supabase, session, user } = data)

	$: if (user) {
		currentUser.set(user)
	}

	onMount(() => {
		loadTheme()
		if (session && user) {
			currentUser.set(user)
		}
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<Spinner />
<SvelteToast {options} />
<slot />
<!-- <a href="https://www.flaticon.com/free-icons/deploy" title="deploy icons">Deploy icons created by Freepik - Flaticon</a> -->
<!-- <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Flat Icons - Flaticon</a> -->
