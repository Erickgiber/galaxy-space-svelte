<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { HeaderConfig } from '$lib/config/layout/header.config'
	import { currentUser } from '$lib/store/currentUser'
	import type { INotification } from '$lib/types/notification.types'
	import { handleLogout } from '$lib/utils/logout'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { writable } from 'svelte/store'
	import { fade, slide } from 'svelte/transition'

	let isNotificationsOpen = writable(false)
	let isDropdownOpen = writable(false)
	let notifications: INotification[] = []
	const supabase = $page.data.supabase as SupabaseClient

	$: notifications = $page.data.user?.notifications as INotification[]

	$: if (!$currentUser) {
		goto('/login')
	}
</script>

{#if $currentUser}
	<header
		class="relative w-full h-14 px-1 sm:px-3 mb-3 flex items-center justify-evenly md:justify-between bg-white rounded-xl shadow-sm"
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
			<li class="sm:hidden flex">
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

			<li>
				<a
					href="/space"
					class="h-full grid place-content-center text-2xl bg-bg p-2.5
                    rounded-full text-dark sm:hover:bg-primary sm:hover:text-white"
				>
					<Icon icon="solar:home-smile-linear" class="text-xl" />
				</a>
			</li>

			<!-- ? Profile Button -->
			<li class="hidden sm:flex">
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
									value: $isNotificationsOpen,
									isDropdownOpen
								})
							}

							if (option.name === 'dropdown') {
								option.onclick({
									isDropdownOpen,
									value: $isDropdownOpen,
									isNotificationsOpen
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
				transition:slide={{ duration: 150 }}
				class="absolute scroll-smooth scroll-modern top-16 right-0 bg-white shadow-2xl z-10 rounded-lg w-52 h-52 overflow-y-auto"
			>
				<h1 class="text-center font-bold text-black py-2 border-b-2 border-gray-200">
					Notifications
				</h1>
				<div transition:fade={{ duration: 200 }} class="w-full h-max">
					{#if notifications.length > 0}
						{#each notifications as notification}
							<div class="p-2 border-b-2 border-light_gray">
								{#if notification.type === 'follow'}
									<h1 class="text-base text-dark font-semibold flex items-center gap-1">
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
									<p class="text-sm py-2">{@html notification.description}</p>
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

		{#if $isDropdownOpen}
			<div
				transition:slide={{ duration: 150 }}
				class="absolute scroll-smooth scroll-modern top-16 right-0 bg-white shadow-2xl z-10 rounded-lg w-52 h-max"
			>
				<h1 class="text-center font-bold text-black py-2 border-b-2 border-gray-200">Menu</h1>
				<div transition:fade={{ duration: 200 }} class="w-full h-max">
					<a
						class="flex text-dark items-center gap-1 px-2 py-3 font-semibold border-b hover:bg-primary hover:text-white"
						href="/space/u/{$currentUser.username}"
						on:click={() => ($isDropdownOpen = false)}
					>
						<Icon icon="lucide:user-2" />
						<span>My Profile</span>
					</a>
					<a
						class="flex text-dark items-center gap-1 px-2 py-3 font-semibold border-b hover:bg-primary hover:text-white"
						href="/space/settings"
						on:click={() => ($isDropdownOpen = false)}
					>
						<Icon icon="solar:settings-linear" />
						<span>Settings</span>
					</a>
					<button
						class="flex w-full text-dark items-center rounded-b-lg gap-1 px-2 py-3 font-semibold hover:bg-primary hover:text-white"
						on:click={() => {
							handleLogout(supabase)
							$isDropdownOpen = false
						}}
					>
						<Icon icon="heroicons-outline:logout" />
						<span>Logout</span>
					</button>
				</div>
			</div>
		{/if}
	</header>
{/if}
