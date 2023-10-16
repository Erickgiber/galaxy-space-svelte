<script lang="ts">
	import Aside from '$lib/components/layout/Aside.svelte'
	import Header from '$lib/components/layout/Header.svelte'
	import BackgroundAnimated from '$lib/components/ui/BackgroundAnimated.svelte'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { currentUser, type ICurrentUser } from '$lib/store/currentUser'
	import '../app.scss'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	export let data

	// Optionally set default options here
	const options = {}

	let { supabase, session, user } = data
	$: ({ supabase, session, user } = data)

	$: if (user) {
		currentUser.set(user)
	}

	onMount(() => {
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
{#if $currentUser}
	<main class="flex mx-auto max-w-[1440px]">
		<Aside />

		<div class="w-full py-5 px-3">
			<Header />
			<slot />
		</div>
	</main>
{:else}
	<BackgroundAnimated />
	<main class="w-full flex justify-center items-center min-h-screen">
		<slot />
	</main>
{/if}
<!-- <a href="https://www.flaticon.com/free-icons/deploy" title="deploy icons">Deploy icons created by Freepik - Flaticon</a> -->
