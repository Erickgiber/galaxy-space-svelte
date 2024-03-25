<script lang="ts">
	import { goto } from '$app/navigation'
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import GithubPage from '$lib/components/ui/Services/Github/GithubPage.svelte'
	import VerifiedIcon from '$lib/components/ui/VerifiedIcon.svelte'
	import { currentUser } from '$lib/store/currentUser.js'

	export let data
	let service_info = data.service_info
	$: service_info = data.service_info
</script>

<BreadCrumb data={{ module: { title: 'Services', href: '/space/services' }, current: { title: data.type ?? '' } }} />

{#if data.type === 'github'}
	<GithubPage {service_info} />
{/if}
