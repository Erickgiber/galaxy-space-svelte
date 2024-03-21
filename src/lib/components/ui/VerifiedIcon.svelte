<script lang="ts">
	import Icon from '@iconify/svelte'

	export let isStar: boolean
	export let className: string = ''
</script>

{#if isStar}
	<Icon class="grid place-content-center text-base {className}" icon="material-symbols:verified-rounded" color="#5d23ce" />
{/if}
