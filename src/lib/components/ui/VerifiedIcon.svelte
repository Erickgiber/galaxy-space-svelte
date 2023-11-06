<script lang="ts">
	import Icon from '@iconify/svelte'

	export let isStar: boolean
</script>

{#if isStar}
	<Icon
		class="grid place-content-center text-base"
		icon="material-symbols:verified-rounded"
		color="#5d23ce"
	/>
{/if}
