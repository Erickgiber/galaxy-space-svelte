<script>
	import { browser } from '$app/environment'
	import { preloadCode, preloadData } from '$app/navigation'
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import { MENU_CONFIG_PAGE } from '$lib/config/menus/menu-config-page'
	import { currentUser } from '$lib/store/currentUser'
	import Icon from '@iconify/svelte'

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
	<title>Settings | Galaxy Space</title>
	<meta name="keywords" content="settings,galaxy,space,galaxyspace,carupano,guayana,venezuela,social" />
	<meta name="description" content="Config your Galaxy Space account" />
</svelte:head>

<BreadCrumb data={{ current: { title: 'Settings', icon: 'solar:settings-linear' } }} />

<section class="sm:p-0 p-2">
	<ul class="flex flex-col gap-2">
		{#each MENU_CONFIG_PAGE() as { name, id, description, icon, width, href }}
			<li>
				<a
					class="w-full active:scale-[98%] active:text-white active:bg-primary dark:active:bg-primary transition-all duration-150 active:duration-0 rounded-md px-2 py-3 bg-white shadow-sm dark:bg-dark_light_gray flex flex-col"
					{href}
				>
					<h1 class="dark:text-white font-medium flex items-center gap-1">
						<Icon {icon} {width} />
						{name}
					</h1>
					<h2 class="text-dark_text text-sm md:text-base pl-1.5">{description}</h2>
				</a>
			</li>
		{/each}
	</ul>
</section>
