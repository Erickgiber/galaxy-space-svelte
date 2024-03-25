<script lang="ts">
	import { browser } from '$app/environment'
	import { preloadCode, preloadData } from '$app/navigation'
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import { currentUser } from '$lib/store/currentUser'

	$: if ($currentUser && browser) {
		preloadData('/space/statistics')
		preloadData('/space/learning')
		preloadData('/space/services')
		preloadData('/space/contacts')
		preloadData('/space')
		preloadCode('/space')

		preloadData(`/space/u/${$currentUser.username}`)
		preloadCode(`/space/u/${$currentUser.username}`)
	}
</script>

<svelte:head>
	<title>My contacts | Galaxy Space</title>
</svelte:head>

<BreadCrumb data={{ current: { title: 'My Contacts', icon: 'ic:twotone-connect-without-contact' } }} />
