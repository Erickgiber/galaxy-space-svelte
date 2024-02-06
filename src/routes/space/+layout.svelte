<script lang="ts">
	import { goto } from '$app/navigation'
	import appLoader from '$lib/assets/logos/loader.png'
	import Aside from '$lib/components/layout/Aside.svelte'
	import Header from '$lib/components/layout/Header.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { onMount } from 'svelte'
	import { fade, slide } from 'svelte/transition'

	let isLoadingApp = true

	$: if (!$currentUser) {
		goto('/')
	}

	$: if (isLoadingApp && typeof window !== 'undefined') {
		window.document.body.style.cssText = `overflow: hidden !important;`
	}

	onMount(() => {
		setTimeout(() => {
			isLoadingApp = false
			window.document.body.style.cssText = `overflow: auto !important;`
		}, 1000)
	})
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

{#if isLoadingApp}
	<div
		out:fade={{ duration: 150, delay: 200 }}
		class="flex flex-col items-center justify-center w-full h-full fixed top-0 left-0 bg-bg dark:bg-dark_bg overflow-hidden"
	>
		<img out:fade={{ duration: 50 }} class="min-w-[125px] min-h-[125px] max-w-[150px] max-h-[150px] w-full h-full" src={appLoader} alt="" />
		<br />
		<span out:slide={{ duration: 200 }} class="dark:text-white font-semibold text-xl">Galaxy Space</span>
	</div>
{/if}
