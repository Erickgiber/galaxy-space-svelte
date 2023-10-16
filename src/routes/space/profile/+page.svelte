<script>
	import { currentUser } from '$lib/fakedb/currentUser'
</script>

<svelte:head>
	<title>{$currentUser.public_name} | Galaxy Space</title>
</svelte:head>

<h1>Profile</h1>
