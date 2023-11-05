<script lang="ts">
	import { HeaderConfig } from '$lib/config/layout/header.config'
	import Icon from '@iconify/svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { draw, fade, slide } from 'svelte/transition'
	import { writable } from 'svelte/store'

	let isNotificationsOpen = writable(false)
</script>

<header
	class="relative w-full h-14 px-3 mb-3 flex items-center justify-center md:justify-between bg-white rounded-xl shadow-sm"
>
	<!-- ? Searcher -->
	<label
		for="searcher"
		class="hidden items-center px-2 bg-bg md:flex
		rounded-xl h-9 gap-1 transition focus-within:text-primary"
	>
		<Icon icon="majesticons:search-line" class="text-xl" />
		<input
			class="h-full text-base bg-transparent outline-none transition-all text-dark focus-within:pl-1"
			type="search"
			placeholder="Search"
		/>
	</label>

	<ul class="relative w-full md:w-max justify-evenly md:justify-start flex items-center gap-2">
		<!-- ? Profile Button -->
		<li>
			<a
				style="font-family: 'Gabarito', sans-serif;"
				href="/space/u/{$currentUser.username}"
				class="text-base font-normal flex items-center gap-1 bg-bg
				md:pr-3 rounded-full text-dark hover:bg-primary hover:text-white"
			>
				<img
					in:fade
					class="h-9 w-9 object-cover rounded-full"
					src={$currentUser.photo_url}
					alt="Galaxy Space"
				/>
				<p class="hidden md:flex">
					{$currentUser.public_name}
				</p>
			</a>
		</li>

		{#each HeaderConfig.options as option}
			<li>
				<button
					class="h-full grid place-content-center text-2xl bg-bg p-2
                    rounded-full text-dark hover:bg-primary hover:text-white"
					on:click={() => {
						if (option.name === 'notifications') {
							option.onclick({
								isNotificationsOpen,
								value: $isNotificationsOpen
							})
						}
					}}
				>
					<Icon icon={option.icon} />
				</button>
			</li>
		{/each}
	</ul>

	{#if $isNotificationsOpen}
		<div
			transition:slide
			class="absolute top-16 right-0 bg-white bg-opacity-95 backdrop-blur-sm shadow-xl z-10 rounded-xl w-72 h-52"
		>
			<h1 class="text-center py-2 border-b-2 border-gray-200">Notifications</h1>
			<div class="w-full h-max">
				<p class="text-center py-2">Nothing here :p</p>
			</div>
		</div>
	{/if}
</header>
