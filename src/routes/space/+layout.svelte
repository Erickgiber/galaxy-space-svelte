<script>
	import Aside from '$lib/components/layout/Aside.svelte'
	import Header from '$lib/components/layout/Header.svelte'
</script>

<main class="flex mx-auto max-w-[1440px]">
	<Aside />

	<div class="w-full py-5 px-3">
		<Header />
		<slot />
	</div>
</main>
