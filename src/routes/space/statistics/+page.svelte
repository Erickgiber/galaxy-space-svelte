<script lang="ts">
	export let data
</script>

<svelte:head>
	<title>Statistics | Galaxy Space</title>
</svelte:head>

<span class="text-lg my-2 rounded-lg">
	<b>
		{data.totalUsers}
	</b>
	users registered in the app
</span>
