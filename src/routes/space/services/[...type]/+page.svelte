<script lang="ts">
	import { goto } from '$app/navigation'
	import VerifiedIcon from '$lib/components/ui/VerifiedIcon.svelte'
	import { currentUser } from '$lib/store/currentUser.js'

	export let data
	let service_info = data.service_info
	$: service_info = data.service_info

	async function handleLogout(): Promise<void> {
		const supabase = data.supabase
		const request = await supabase.from("services").delete().eq("uuid", $currentUser.uuid)
		goto("/space/services")
		console.log(request)
	}
</script>

<article class="flex items-center p-2 pb-3 sm:p-0 sm:pb-1 gap-1 mb-3 text-xl">
	<h1 class="font-semibold w-full capitalize dark:text-white border-b border-gray-300 dark:border-dark_light_gray">{data.type}</h1>
</article>

<section class="flex dark:text-white">
	<article class="flex flex-wrap gap-2">
		<a href={service_info.html_url} target="_blank">
			<img
				width="150"
				height="150"
				src={service_info.avatar_url}
				alt={service_info.name}
				class="rounded-3xl border-2 border-primary border-opacity-50 bg-light_gray dark:bg-dark_light_gray"
			/>
		</a>
		<div>
			<p class="text-2xl flex items-center gap-2">
				{service_info.name}
				<VerifiedIcon isStar={$currentUser.is_star} className="text-xl" />
			</p>
			<p class="dark:text-dark text-xl">@{service_info.login}</p>
		</div>
		<button class="bg-red-400 hover:bg-red-500 active:bg-red-500 h-max px-2 py-1 text-white rounded" on:click={handleLogout} type="button">Logout</button>
	</article>
</section>
