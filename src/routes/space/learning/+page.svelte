<script lang="ts">
	import { browser } from '$app/environment'
	import { preloadCode, preloadData } from '$app/navigation'
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { FoldersList } from '$lib/utils/learning/folders'
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
	<title>Learning | Galaxy Space</title>
</svelte:head>

<BreadCrumb data={{ current: { title: 'Learning', icon: 'icon-park-outline:book-one' } }} />

<section class="flex flex-wrap px-3 sm:px-0">
	{#each FoldersList as { title, icon, author, level, href }}
		<a
			{href}
			class="px-2 flex flex-wrap items-center gap-1 dark:border-dark_light_gray w-full h-14 rounded-md bg-white dark:bg-dark_white shadow-sm dark:text-white"
		>
			<Icon {icon} class="text-[28px] my-2" />
			<article class="flex flex-col leading-none">
				<h1 class="text-center font-bold text-sm">{title} - {level}</h1>
				<h2 class="text-[13px] font-semibold text-dark_text">By: {author}</h2>
			</article>
		</a>
	{/each}
</section>
