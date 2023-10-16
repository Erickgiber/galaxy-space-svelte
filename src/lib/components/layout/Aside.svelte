<script lang="ts">
	import { page } from '$app/stores'
	import { AsideConfig } from '$lib/config/layout/aside.config'
	import Icon from '@iconify/svelte'
	import LOGO from '$lib/assets/logos/logo.png'
</script>

<aside class="w-52 min-w-[208px] h-screen flex flex-col px-5 py-5 gap-8 select-none">
	<!-- ? Profile btn -->

	<a
		style="font-family: 'Gabarito', sans-serif;"
		href="/"
		class="text-xl font-normal text-[#1D2E79] flex items-center gap-1.5"
	>
		<img class="h-10 object-cover" src={LOGO} alt="Galaxy Space" />
		Galaxy Space
	</a>

	<ul class="flex flex-col w-full gap-2">
		{#each AsideConfig.routes as route}
			<li>
				<a
					href={route.href}
					class="flex items-center gap-1.5 text-lg px-1.5 py-2.5 rounded-lg transition-all
                    hover:bg-black hover:bg-opacity-5
                    text-[#808080] select-none
                    {route.customClass}
                    {$page.url.pathname === route.href ? 'link_active' : ''}"
				>
					<Icon icon={route.icon} />
					<span>{route.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>

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
