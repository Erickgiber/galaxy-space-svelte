<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { currentUser } from '$lib/store/currentUser'
	import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
	import dayjs from 'dayjs'
	import VerifiedIcon from '$lib/components/ui/VerifiedIcon.svelte'
	import Tabs from '$lib/components/ui/Tabs.svelte'
	import { tooltip } from '@svelte-plugins/tooltips'
	import Icon from '@iconify/svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import { TabsGithubPage } from './tabs'

	export let service_info: TypeGithubUserResponse
	let data = $page.data

	async function handleLogout(): Promise<void> {
		const supabase = data.supabase
		const request = await supabase.from('services').delete().eq('uuid', $currentUser.uuid)
		if (request.error) {
			toast.pop()
			toast.push('Error connecting! Try again')
			return
		}
		goto('/space/services')
	}
</script>

<section class="flex flex-col px-3 dark:text-white justify-between gap-3">
	<div class="flex w-full lg:flex-row flex-col gap-3">
		<article class="flex gap-2">
			<a href={service_info.html_url} target="_blank" class="relative group">
				<div
					class="absolute font-semibold group-hover:opacity-100 transition-all bg-black bg-opacity-60 backdrop-blur-[1px] opacity-0 flex flex-col justify-center items-center w-full h-full rounded-3xl min-w-[150px] min-h-[150px]"
				>
					<span>Go to</span>
					<span>Github Profile</span>
				</div>
				<img
					width="150"
					height="150"
					src={service_info.avatar_url}
					alt={service_info.name}
					class="min-w-[150px] min-h-[150px] rounded-3xl border-2 border-primary border-opacity-50 bg-light_gray dark:bg-dark_light_gray"
				/>
			</a>
			<div class="w-44">
				<p class="text-2xl flex items-center gap-2">
					{service_info.name}
					<VerifiedIcon isStar={$currentUser.is_star} className="text-xl" />
				</p>
				<p class="dark:text-dark text-xl">@{service_info.login}</p>
			</div>
			<button class="bg-red-400 hover:bg-red-500 active:bg-red-500 h-max px-2 py-1 text-white rounded" on:click={handleLogout} type="button"
				>Logout</button
			>
		</article>

		<article class="flex w-full flex-col bg-white dark:bg-dark_white shadow rounded-lg">
			<h1 class="py-2 px-3 font-semibold border-b dark:border-b-dark_light_gray">Description</h1>

			<div class="flex flex-col justify-between h-full">
				<div class="py-2 px-3">
					{#if service_info.bio}
						{service_info.bio}
					{:else}
						<a
							href={service_info.html_url}
							target="_blank"
							class="w-max flex items-center gap-1 border-b border-b-gray-300 dark:border-light_gray hover:border-primary dark:hover:border-primary hover:text-primary"
						>
							Add a bio on Github!
							<Icon icon="tabler:external-link" width="19" class="-translate-y-0.5" />
						</a>
					{/if}
				</div>

				<div class="py-2 px-3 font-semibold text-dark_text">
					<span>Github user since:</span>
					<span use:tooltip={{ content: 'Format: "DD-MM-YYYY" ', position: 'top', animation: 'slide', arrow: true, action: 'hover' }}>
						{dayjs(service_info.created_at).format('DD-MM-YYYY')}
					</span>
				</div>
			</div>
		</article>
	</div>

	<article class="w-full flex flex-col">
		<Tabs tabs={TabsGithubPage} props={{ service_info }} />
	</article>
</section>
