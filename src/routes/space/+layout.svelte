<script>
	import { goto } from '$app/navigation'
	import Aside from '$lib/components/layout/Aside.svelte'
	import Header from '$lib/components/layout/Header.svelte'
	import { currentUser } from '$lib/store/currentUser'

	$: if (!$currentUser) {
		goto('/')
	}
</script>

{#if $currentUser}
	<main class="flex mx-auto max-w-[1336px]">
		<Aside />

		<div class="w-full sm:py-5 sm:px-3">
			<Header />
			<slot />
		</div>
	</main>
{/if}
