<script lang="ts">
	import { Player, Video } from '@vime/svelte'
	import { onMount } from 'svelte'
	const videoSrc = 'https://files.catbox.moe/f7ehee.mp4'
	export let loaded = false

	onMount(() => {
		loaded = true
	})
</script>

{#if loaded}
	<!-- By default there are no controls so let's turn them on. -->
	<Player controls>
		<Video crossorigin="" poster="">
			<!-- These are passed directly to the underlying HTML5 `<video>` element. -->
			<!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
			<source data-src={videoSrc} type="video/mp4" />
			<track default kind="subtitles" src="https://media.vimejs.com/subs/english.vtt" srclang="en" label="English" />
		</Video>

		<!-- ... -->
	</Player>
{/if}
