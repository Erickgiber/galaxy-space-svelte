<script lang="ts">
	export let data
	let category = data.category
	$: category = data.category
</script>

<article class="flex items-center gap-1 border-b border-gray-300 text-xl dark:border-dark_light_gray pb-1">
	<h1 class="font-semibold dark:text-white">{category.name?.toUpperCase()}</h1>
</article>

<section class="py-2">
	<h1 class="dark:text-white">Coming soon...</h1>
</section>
