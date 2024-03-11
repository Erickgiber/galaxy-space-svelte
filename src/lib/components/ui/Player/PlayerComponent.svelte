<script lang="ts">
	// @ts-nocheck
	import { Player, Video } from '@vime/svelte'
	import { onMount } from 'svelte'
	export let loaded = false
	export let src: string
	export let className: string = ''

	onMount(() => {
		loaded = true
	})
</script>

{#if loaded && src}
	<!-- By default there are no controls so let's turn them on. -->
	<Player controls class={className}>
		<Video crossorigin="">
			<!-- These are passed directly to the underlying HTML5 `<video>` element. -->
			<!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
			<source data-src={src} type="video/mp4" />
			<track default kind="subtitles" src="https://media.vimejs.com/subs/english.vtt" srclang="en" label="English" />
		</Video>

		<!-- ... -->
	</Player>
{/if}

{#if !src}
	<h1 class="text-red-500 text-2xl text-center">No video SRC</h1>
{/if}
