<script lang="ts">
	import { FoldersList } from '$lib/utils/learning/folders'
	import Icon from '@iconify/svelte'
</script>

<svelte:head>
	<title>Learning | Galaxy Space</title>
</svelte:head>

<article class="flex items-center gap-1 border-b border-gray-300 text-xl dark:border-dark_light_gray pb-1">
	<Icon icon="icon-park-outline:book-one" class="text-primary" />
	<h1 class="font-semibold dark:text-white">Learning</h1>
</article>

<section class="flex flex-wrap py-2">
	{#each FoldersList as { title, icon, author, level, href }}
		<a
			{href}
			class="px-2 border flex flex-wrap items-center gap-1 dark:border-dark_light_gray w-full h-14 rounded-lg bg-white dark:bg-dark_white shadow-sm dark:text-white"
		>
			<Icon {icon} class="text-[28px] my-2" />
			<article class="flex flex-col leading-none">
				<h1 class="text-center font-bold text-sm">{title} - {level}</h1>
				<h2 class="text-[13px] font-semibold text-dark_text">By: {author}</h2>
			</article>
		</a>
	{/each}
</section>
