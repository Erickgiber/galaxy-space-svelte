<script lang="ts">
	import Aside from '$lib/components/layout/Aside.svelte'
	import Header from '$lib/components/layout/Header.svelte'
	import BackgroundAnimated from '$lib/components/ui/BackgroundAnimated.svelte'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { currentUser } from '$lib/store/currentUser'
	import '../app.scss'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'
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
		if (session && user) {
			currentUser.set(user)
		}
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<SvelteToast {options} />
<slot />
<!-- <a href="https://www.flaticon.com/free-icons/deploy" title="deploy icons">Deploy icons created by Freepik - Flaticon</a> -->
<!-- <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Flat Icons - Flaticon</a> -->
