<script>
	import { page } from '$app/stores'
	import { currentUser } from '$lib/store/currentUser'

	const isThisUser = $currentUser.username === $page.params.username
</script>

<svelte:head>
	<title>{$currentUser.public_name} | Galaxy Space</title>
</svelte:head>

<h1>Profile</h1>
