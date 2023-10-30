<script>
	import { HeaderConfig } from '$lib/config/layout/header.config'
	import Icon from '@iconify/svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { fade } from 'svelte/transition'
</script>

<header
	class="w-full h-14 px-3 mb-3 flex items-center justify-between bg-white rounded-xl shadow-sm"
>
	<!-- ? Searcher -->
	<label
		for="searcher"
		class="flex items-center px-2 bg-bg
		rounded-xl h-9 gap-1 transition focus-within:text-primary"
	>
		<Icon icon="majesticons:search-line" class="text-xl" />
		<input
			class="h-full text-base bg-transparent outline-none transition-all text-dark focus-within:pl-1"
			type="search"
			placeholder="Search"
		/>
	</label>

	<ul class="flex items-center gap-2">
		<!-- ? Profile Button -->
		<li>
			<a
				style="font-family: 'Gabarito', sans-serif;"
				href="/space/u/{$currentUser.username}"
				class="text-lg font-normal flex items-center gap-1 bg-bg
				pr-3 rounded-full text-dark hover:bg-primary hover:text-white"
			>
				<img
					in:fade
					class="h-9 w-9 object-cover rounded-full"
					src={$currentUser.photo_url}
					alt="Galaxy Space"
				/>
				{$currentUser.public_name}
			</a>
		</li>

		{#each HeaderConfig.options as option}
			<li>
				<button
					class="h-full grid place-content-center text-2xl bg-bg p-2
                    rounded-full text-dark hover:bg-primary hover:text-white"
					on:click={option.onclick}
				>
					<Icon icon={option.icon} />
				</button>
			</li>
		{/each}
	</ul>
</header>
