<script lang="ts">
	import { browser } from '$app/environment'
	import { preloadCode, preloadData } from '$app/navigation'
	import SelectServiceGithub from '$lib/components/ui/Services/SelectServiceGithub.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import type { TypeSelectService } from '$lib/types/select-service.types'
	import Icon from '@iconify/svelte'

	export let data
	let authWithAnyApp = Boolean(data.services.length > 0)
	let selectServiceOpened: TypeSelectService = {
		enable: false,
		service: ''
	}

	const setServiceOpened = (enable: boolean, service: TypeSelectService['service']) => {
		selectServiceOpened = { enable, service }
	}

	$: if ($currentUser && browser) {
		preloadData('/space/statistics')
		preloadData('/space/learning')
		preloadData('/space/services')
		preloadData('/space/contacts')
		preloadData('/space')
		preloadCode('/space')

		preloadData(`/space/u/${$currentUser.username}`)
		preloadCode(`/space/u/${$currentUser.username}`)
	}
</script>

<svelte:head>
	<title>Services | Galaxy Space</title>
</svelte:head>

<article class="flex items-center p-2 pb-3 sm:p-0 sm:pb-1 gap-1 text-xl">
	<h1 class="font-semibold w-full dark:text-white border-b border-gray-300 dark:border-dark_light_gray">Services</h1>
</article>

{#if !authWithAnyApp}
	<div class="dark:text-white flex items-center gap-1.5 bg-white dark:bg-dark_light_gray p-2 rounded-lg mt-1 mb-3">
		<Icon icon="emojione:warning" class="-translate-y-[1px]" />
		<p>Take it easy! No private information will be saved. Nor will it be shared</p>
	</div>

	{#if !selectServiceOpened.enable}
		<button
			on:click={() => setServiceOpened(true, 'github')}
			class="bg-[#161B22] border border-[#30363D] text-white font-bold py-2 px-4 rounded
    transition-all hover:bg-opacity-80 active:scale-95 active:transition-none"
		>
			Auth with GitHub
		</button>
	{/if}
{:else}
	<div class="flex flex-wrap">
		<a
			href="/space/services/github"
			class="bg-[#161B22] border border-[#30363D] text-white font-bold py-2 px-4 rounded
    		transition-all hover:bg-opacity-80 active:scale-95 active:transition-none"
		>
			GitHub
		</a>
	</div>
{/if}

<!-- ! Services logic rendering -->
{#if selectServiceOpened.service === 'github'}
	<SelectServiceGithub bind:selectServiceOpened bind:authWithAnyApp />
{/if}
