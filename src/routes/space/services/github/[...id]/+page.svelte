<script lang="ts">
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import Icon from '@iconify/svelte'

	export let data
	const repo = data.repo
</script>

<BreadCrumb
	data={{
		module: { title: data.module.title, href: data.module.href, icon: data.module.icon },
		current: { title: data.current.title, icon: data.current.icon, href: data.current.href },
		child: { title: data.child.title, icon: data.child.icon }
	}}
	className="sm:flex hidden"
/>

<section class="flex mt-3 sm:mt-0 flex-col px-3 dark:text-white justify-between gap-3">
	<a href={data.current.href} class="bg-primary text-white sm:hidden w-max px-2 py-1 rounded-md flex items-center gap-1">
		<Icon icon="lets-icons:back" />
		Back
	</a>
	<h1 class="text-xl sm:text-2xl flex items-center gap-1">
		<Icon icon={data.child.icon} class="sm:hidden" />
		<span>{repo.name}</span>
	</h1>
	<article class="flex items-center flex-wrap gap-1.5 overflow-x-auto overflow-y-hidden pb-2">
		{#if repo.topics.length > 0}
			{#each repo.topics as topic}
				<span
					class="topic dark:bg-white bg-dark dark:bg-opacity-20 text-white font-semibold {topic} text-sm px-2 pb-0.5 flex justify-center items-center rounded-md"
					>{topic}</span
				>
			{/each}
		{:else}
			<span class="bg-black text-white text-sm px-2 pb-0.5 rounded-md">no-topic</span>
		{/if}
	</article>

	<h3>Building...</h3>
</section>

<style lang="scss">
	@import '$lib/styles/topics-github.scss';
</style>
