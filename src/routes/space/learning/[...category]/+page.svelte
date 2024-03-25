<script lang="ts">
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'

	export let data
</script>

<BreadCrumb
	data={{
		module: { title: 'Learning', href: '/space/learning', icon: 'icon-park-outline:book-one' },
		current: { title: data.title.toUpperCase() ?? '', icon: data.icon }
	}}
/>

<section class="py-2">
	<h1 class="dark:text-white">Coming soon...</h1>
</section>
