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
	<main class="flex mx-auto max-w-[1280px]">
		<Aside />

		<div class="w-full py-5 px-3">
			<Header />
			<slot />
		</div>
	</main>
{/if}
