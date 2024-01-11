<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import LOGO from '$lib/assets/logos/logo.png'
	import { AsideConfig } from '$lib/config/layout/aside.config'
	import { currentUser } from '$lib/store/currentUser'
	import { handleLogout } from '$lib/utils/logout'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'

	const supabase = $page.data.supabase as SupabaseClient

	$: if (!$currentUser) {
		goto('/login')
	}
</script>

{#if $currentUser}
	<aside class="w-52 min-w-[208px] h-screen hidden sm:flex flex-col px-5 py-5 gap-8 select-none">
		<!-- ? Profile btn -->
		<a
			style="font-family: 'Gabarito', sans-serif;"
			href="/space"
			class="text-xl font-normal text-[#1D2E79] dark:text-white flex items-center gap-1.5"
		>
			<img
				class="h-10 object-cover pointer-events-none select-none"
				src={LOGO}
				alt="Galaxy Space"
			/>
			Galaxy Space
		</a>

		<ul class="flex flex-col w-full gap-2">
			{#each AsideConfig.routes as route}
				<li>
					<a
						href={route.name === 'Profile' ? `${route.href}/${$currentUser.username}` : route.href}
						class="flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
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
						href="/space/statistics"
						class="flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
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
					on:click={() => handleLogout(supabase)}
					class="w-full flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
                    hover:bg-black hover:bg-opacity-5 dark:hover:bg-dark_white
                    text-[#808080] dark:text-dark_text select-none"
				>
					<Icon icon="heroicons-outline:logout" />
					<span>Logout</span>
				</button>
			</li>
		</ul>
	</aside>
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
