<script lang="ts">
	import { navigating } from '$app/stores'
	import { fade } from 'svelte/transition'

	let isNavigating = $navigating
	let animation = false
	$: {
		if (!$navigating) {
			animation = false
			setTimeout(() => {
				isNavigating = $navigating
			}, 200)
		} else {
			setTimeout(() => {
				isNavigating = $navigating
				animation = true
			}, 10)
		}
	}
</script>

{#if isNavigating}
	<div
		transition:fade
		class="w-full h-0.5 bg-primary fixed top-0 left-0 {animation ? 'w-2/6' : ''}
        transition-all duration-200 rounded-2xl"
	/>
{/if}
