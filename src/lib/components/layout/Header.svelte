<script lang="ts">
	import { HeaderConfig } from '$lib/config/layout/header.config'
	import Icon from '@iconify/svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { fade, slide } from 'svelte/transition'
	import { writable } from 'svelte/store'
	import { page } from '$app/stores'
	import type { INotification } from '$lib/types/notification.types'

	let isNotificationsOpen = writable(false)
	let notifications: INotification[] = []

	$: notifications = $page.data.user?.notifications as INotification[]
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
				md:pr-3 rounded-full text-dark sm:hover:bg-primary sm:hover:text-white"
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
                    rounded-full text-dark sm:hover:bg-primary sm:hover:text-white
					{$isNotificationsOpen && option.name === 'notifications' ? 'bg-primary text-white' : ''}
					"
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
			class="absolute top-16 right-0 bg-white shadow-xl z-10 rounded-xl w-72 h-52"
		>
			<h1 class="text-center font-bold text-dark py-2 border-b-2 border-gray-200">Notifications</h1>
			<div class="w-full h-max">
				{#if notifications.length > 0}
					{#each notifications as notification}
						<div class="p-2 border-b-2 border-light_gray">
							{#if notification.type === 'follow'}
								<h1 class="text-base text-dark font-bold flex items-center gap-1">
									<Icon icon="mdi:account-plus" class="text-sm" />
									{notification.title}
								</h1>
							{:else}
								<h1 class="text-base text-dark font-bold">{notification.title}</h1>
							{/if}
							{#if notification.type === 'follow'}
								<a
									on:click={() => ($isNotificationsOpen = false)}
									href="/space/u/{notification.from_username}"
									class="text-sm">{@html notification.description}</a
								>
							{:else}
								<p class="text-sm py-2">{notification.description}</p>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="mx-auto my-5 flex flex-col items-center">
						<lord-icon
							src="https://cdn.lordicon.com/nmipallp.json"
							trigger="loop"
							delay="2000"
							style="width:90px;height:90px"
						/>
						<p class="text-lg font-semibold text-dark">Ehh.. this is dead</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</header>
