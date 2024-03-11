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
	<vm-player playsinline class={className}>
		<vm-video cross-origin="true">
			<source data-src={src} type="video/mp4" />
			<track default kind="subtitles" src="https://media.vimejs.com/subs/english.vtt" srclang="en" label="English" />
			<track kind="subtitles" src="https://media.vimejs.com/subs/spanish.vtt" srclang="es" label="Spanish" />
		</vm-video>

		<vm-default-ui />
	</vm-player>
{/if}

{#if !src}
	<h1 class="text-red-500 text-2xl text-center">No video SRC</h1>
{/if}
