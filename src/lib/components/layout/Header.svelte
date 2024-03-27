<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import LOGO from '$lib/assets/logos/logo.png'
	import { AsideConfig } from '$lib/config/layout/aside.config'
	import { HeaderConfig } from '$lib/config/layout/header.config'
	import { currentUser } from '$lib/store/currentUser'
	import type { INotification } from '$lib/types/notification.types'
	import { handleLogout } from '$lib/utils/logout'
	import { toggleDarkMode } from '$lib/utils/toggleDarkMode'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { writable } from 'svelte/store'
	import { fade, slide } from 'svelte/transition'

	let isNotificationsOpen = writable(false)
	let isDropdownOpen = writable(false)
	let isBars = writable(false)
	let notifications: INotification[] = []
	let isHome = false
	const supabase = $page.data.supabase as SupabaseClient

	$: isHome = $page.url.pathname === '/space'
	$: notifications = $page.data.user?.notifications ?? $currentUser.notifications

	$: if (!$currentUser) {
		goto('/login')
	}

	$: if ($isBars && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'hidden'
	} else if (!$isBars && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'auto'
	}

	function handleResize(): void {
		const width = document.documentElement.clientWidth

		if (width > 767) {
			isBars.set(false)
		}
	}
</script>

<svelte:window on:resize={handleResize} />

{#if $currentUser}
	<div class="sticky top-0 sm:pt-5 flex z-50 sm:backdrop-blur-sm sm:h-[75px] sm:mb-5">
		<header
			class="relative shadow-sm w-full h-14 px-1 sm:px-3 sm:mb-3 flex items-center justify-evenly md:justify-between bg-white dark:bg-dark_white sm:rounded-xl"
		>
			<!-- ? Searcher -->
			<label
				for="searcher"
				class="hidden items-center px-2 bg-bg md:flex dark:bg-dark_light_gray dark:text-white
	rounded-xl h-9 gap-1 transition focus-within:text-primary"
			>
				<Icon icon="majesticons:search-line" class="text-xl" />
				<input
					style="border: none !important; outline: none !important;"
					class="h-full focus:ring-0 border-none outline-none text-base bg-transparent transition-all text-dark focus:pl-1"
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
						<img in:fade class="h-9 w-9 object-cover rounded-full" src={$currentUser.photo_url} alt="Galaxy Space" />
						<p class="hidden md:flex">
							{$currentUser.public_name}
						</p>
					</a>
				</li>

				<!-- HOME ICON -->
				<li class="sm:hidden inline-block">
					<a
						href="/space"
						class="h-full grid place-content-center text-2xl bg-bg p-2.5 dark:bg-dark_light_gray dark:text-white
				rounded-full text-dark sm:hover:bg-primary sm:hover:text-white
				{isHome ? 'bg-primary dark:bg-primary text-white dark:text-white' : ''}
				"
					>
						<Icon icon="solar:home-smile-linear" class="text-xl" />
					</a>
				</li>

				<!-- ? Profile Button -->
				<li class="hidden sm:flex">
					<a
						style="font-family: 'Gabarito', sans-serif;"
						href="/space/u/{$currentUser.username}"
						class="text-base font-normal flex items-center gap-1 bg-bg dark:bg-dark_light_gray dark:text-white
			md:pr-3 rounded-full text-dark sm:hover:bg-primary sm:hover:text-white"
					>
						<img in:fade class="h-9 w-9 object-cover rounded-full" src={$currentUser.photo_url} alt="Galaxy Space" />
						<p class="hidden md:flex">
							{$currentUser.public_name}
						</p>
					</a>
				</li>

				{#each HeaderConfig.options as option}
					<li>
						<button
							class="h-full grid place-content-center text-2xl bg-bg p-2 dark:bg-dark_light_gray dark:text-white
				rounded-full text-dark sm:hover:bg-primary sm:hover:text-white {option.customClass}
				{$isNotificationsOpen && option.name === 'notifications' ? 'bg-primary dark:bg-primary text-white dark:text-white' : ''}
				{$isDropdownOpen && option.name === 'dropdown' ? 'bg-primary dark:bg-primary text-white dark:text-white ' : ''}
				{$isBars && option.name === 'bars' ? 'bg-primary dark:bg-primary text-white dark:text-white ' : ''}
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

								if (option.name === 'bars') {
									option.onclick({
										isBars,
										value: $isBars,
										isNotificationsOpen,
										isDropdownOpen
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
					class="absolute scroll-smooth scroll-modern top-16 right-0 bg-white dark:bg-dark_white shadow-2xl z-10 rounded-lg w-52 h-52 overflow-y-auto"
				>
					<h1 class="text-center font-bold text-black py-2 border-b-2 border-gray-200 dark:border-dark_light_gray dark:text-dark_text">
						Notifications
					</h1>
					<div transition:fade={{ duration: 200 }} class="w-full h-max">
						{#if notifications.length > 0}
							{#each notifications as notification}
								<div class="p-2 border-b-2 border-light_gray dark:border-dark_light_gray">
									{#if notification.type === 'follow'}
										<h1 class="text-base text-dark font-semibold flex items-center gap-1">
											<Icon icon="mdi:account-plus" class="text-sm" />
											{notification.title}
										</h1>
									{:else}
										<h1 class="text-base text-dark dark:text-white font-bold">
											{notification.title}
										</h1>
									{/if}
									{#if notification.type === 'follow'}
										<a on:click={() => ($isNotificationsOpen = false)} href="/space/u/{notification.from_username}" class="text-sm"
											>{@html notification.description}</a
										>
									{:else}
										<p class="text-sm py-2 dark:text-gray-400">{@html notification.description}</p>
									{/if}
								</div>
							{/each}
						{:else}
							<div class="mx-auto my-5 flex flex-col items-center">
								<lord-icon src="https://cdn.lordicon.com/nmipallp.json" trigger="loop" delay="2000" style="width:90px;height:90px" />
								<p class="text-lg font-semibold text-dark">Ehh.. this is dead</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if $isDropdownOpen}
				<div
					transition:slide={{ duration: 150 }}
					class="absolute scroll-smooth scroll-modern top-16 right-0 bg-white dark:bg-dark_white shadow-2xl z-10 rounded-lg w-52 h-max"
				>
					<h1 class="text-center font-bold text-black dark:text-dark_text py-2 border-b-2 border-gray-200 dark:border-dark_light_gray">Menu</h1>
					<div transition:fade={{ duration: 200 }} class="w-full h-max">
						<a
							class="flex text-dark items-center gap-1 px-2 py-3 font-semibold border-b dark:border-dark_light_gray hover:bg-primary hover:text-white dark:text-dark_text"
							href="/space/u/{$currentUser.username}"
							on:click={() => ($isDropdownOpen = false)}
						>
							<Icon icon="lucide:user-2" />
							<span>My Profile</span>
						</a>
						<button
							class="w-full flex text-dark items-center gap-1 px-2 py-3 font-semibold border-b dark:border-dark_light_gray hover:bg-primary hover:text-white dark:text-dark_text"
							on:click={toggleDarkMode}
						>
							<Icon icon="fluent:dark-theme-24-regular" />
							<span>Change theme</span>
						</button>
						<a
							class="flex text-dark items-center gap-1 px-2 py-3 font-semibold border-b dark:border-dark_light_gray hover:bg-primary hover:text-white dark:text-dark_text"
							href="/space/settings"
							on:click={() => ($isDropdownOpen = false)}
						>
							<Icon icon="solar:settings-linear" />
							<span>Settings</span>
						</a>
						<button
							class="flex w-full text-dark items-center rounded-b-lg dark:border-dark_light_gray gap-1 px-2 py-3 font-semibold hover:bg-primary hover:text-white dark:text-dark_text"
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

			{#if $isBars}
				<div
					in:fade={{ duration: 100 }}
					class="fixed p-3 scroll-smooth scroll-modern top-0 right-0 bg-white dark:text-white dark:bg-dark_white shadow-2xl z-50 w-screen h-screen"
				>
					<button type="button" on:click={() => isBars.set(false)} class="absolute top-3 right-3 text-2xl p-1">
						<Icon icon="mingcute:close-fill" />
					</button>

					<!-- ? Profile btn -->
					<a
						on:click={() => isBars.set(false)}
						style="font-family: 'Gabarito', sans-serif;"
						href="/space"
						class="text-xl w-max mb-3 font-normal text-[#1D2E79] dark:text-white flex items-center gap-2"
					>
						<img class="h-10 object-cover pointer-events-none select-none" src={LOGO} alt="Galaxy Space" />
						Galaxy Space
					</a>

					<ul class="flex flex-col w-full gap-2">
						{#each AsideConfig.routes as route}
							<li>
								<a
									on:click={() => isBars.set(false)}
									href={route.name === 'Profile' ? `${route.href}/${$currentUser.username}` : route.href}
									class="active:transition-none flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
						hover:bg-black hover:bg-opacity-5 dark:hover:bg-dark_white
						text-[#808080] dark:text-dark_text select-none
						{route.customClass}
						{$page.url.pathname === route.href
										? 'link_active'
										: $page.url.pathname.includes($currentUser.username) && route.href.includes('/u')
										? 'link_active'
										: ''}"
								>
									<Icon icon={route.icon} />
									<span>{route.name}</span>
								</a>
							</li>
						{/each}

						{#if $currentUser.role === 'admin'}
							<li>
								<a
									on:click={() => isBars.set(false)}
									href="/space/statistics"
									class="active:transition-none flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
						hover:bg-black hover:bg-opacity-5 dark:hover:bg-dark_white
						text-[#808080] dark:text-dark_text select-none
						{$page.url.pathname === '/space/statistics' ? 'link_active' : ''}"
								>
									<Icon icon="nimbus:stats" />
									<span>Statistics</span>
								</a>
							</li>
						{/if}

						<li>
							<button
								on:click={() => {
									handleLogout(supabase)
									isBars.set(false)
								}}
								class="active:transition-none w-full flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
						hover:bg-black hover:bg-opacity-5 dark:hover:bg-dark_white
						text-[#808080] dark:text-dark_text select-none"
							>
								<Icon icon="heroicons-outline:logout" />
								<span>Logout</span>
							</button>
						</li>
					</ul>
				</div>
			{/if}
		</header>
	</div>
{/if}

<style lang="scss">
	.link_active {
		border-radius: 10px;
		background: linear-gradient(180deg, #5700e4 0%, #3e00a5 100%);
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
		color: white;
		padding-left: 15px;
	}

	li > a {
		font-weight: 400;
	}
</style>
