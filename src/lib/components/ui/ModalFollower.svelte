<script lang="ts">
	import type { IProfile } from '$lib/types/profile.types'
	import Icon from '@iconify/svelte'
	import { fade } from 'svelte/transition'
	import VerifiedIcon from './VerifiedIcon.svelte'

	export let isModalFollowers: boolean
	export let followers: IProfile[]

	$: if (isModalFollowers && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'hidden'
	} else if (!isModalFollowers && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'auto'
	}
</script>

<!-- ! Followers Modal -->
{#if isModalFollowers}
	<div
		transition:fade={{ duration: 150 }}
		class="grid place-content-center z-40 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50
backdrop-blur-sm p-2"
	>
		<div class="bg-white rounded-xl pt-2 shadow-2xl w-72">
			<div class="pb-1 px-2 text-dark border-b-2 border-light_gray flex justify-between">
				<p class="text-lg flex items-center gap-1">
					<Icon icon="solar:users-group-rounded-bold-duotone" class="text-xl text-primary" />
					Followers
				</p>
				<button
					class="bg-red-500 text-white active:scale-95 transition-all duration-100 grid place-content-center p-1 rounded-xl"
					on:click={() => (isModalFollowers = false)}
				>
					<Icon icon="carbon:close" class="text-xl" />
				</button>
			</div>

			<article class="flex gap-2 flex-col h-96 overflow-x-hidden overflow-y-auto py-2">
				{#each followers as follower}
					<div class="px-2">
						<a
							on:click={() => (isModalFollowers = false)}
							href="/space/u/{follower.username}"
							class="w-full flex gap-1.5 py-2 px-2 border-light_gray hover:bg-light_gray rounded-md hover:shadow-sm transition-all duration-100"
						>
							<img
								class="w-7 h-7 sm:w-12 sm:h-12 object-cover rounded-full bg-light_gray"
								src={follower.photo_url}
								alt={follower.username}
							/>
							<span class="flex flex-col leading-5">
								<p class="flex items-center gap-1.5 font-bold text-dark">
									{follower.public_name}
									<VerifiedIcon isStar={follower.is_star} />
								</p>
								<p class="text-gray-400 text-xs font-semibold">@{follower.username}</p>
							</span>
						</a>
					</div>
				{/each}
			</article>
		</div>
	</div>
{/if}
