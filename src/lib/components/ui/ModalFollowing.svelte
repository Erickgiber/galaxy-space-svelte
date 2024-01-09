<script lang="ts">
	import type { IProfile } from '$lib/types/profile.types'
	import Icon from '@iconify/svelte'
	import { fade, slide } from 'svelte/transition'
	import VerifiedIcon from './VerifiedIcon.svelte'

	export let isModalFollowing: boolean
	export let followings: IProfile[]

	$: if (isModalFollowing && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'hidden'
	} else if (!isModalFollowing && typeof window !== 'undefined') {
		window.document.body.style.overflow = 'auto'
	}
</script>

<!-- ! Followings Modal -->
{#if isModalFollowing}
	<div
		transition:fade={{ duration: 150 }}
		class="grid place-content-center z-40 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50
backdrop-blur-sm p-2"
	>
		<article
			class="w-full sm:min-w-[320px] flex gap-2 flex-col max-w-xl h-96 overflow-x-hidden overflow-y-auto py-2 shadow-2xl rounded-xl bg-white"
		>
			<div class="pb-1 px-2 text-dark border-b-2 border-light_gray flex justify-between">
				<p class="text-lg flex items-center gap-1">
					<Icon icon="solar:users-group-rounded-bold" class="text-xl text-dark" />
					Following
				</p>
				<button
					class="bg-red-500 text-white active:scale-95 transition-all duration-100 grid place-content-center p-1 rounded-xl"
					on:click={() => (isModalFollowing = false)}
				>
					<Icon icon="carbon:close" class="text-xl" />
				</button>
			</div>

			{#each followings as following}
				<div class="px-4">
					<a
						on:click={() => (isModalFollowing = false)}
						href="/space/u/{following.username}"
						in:slide={{ duration: 100 }}
						class="w-full flex gap-1.5 py-2 px-3 border-light_gray hover:bg-light_gray rounded-md hover:shadow-sm transition-all duration-100"
					>
						<img
							class="w-12 h-12 object-cover rounded-full bg-light_gray"
							src={following.photo_url}
							alt={following.username}
						/>
						<span class="flex flex-col leading-5">
							<p class="flex items-center gap-1.5 font-bold text-dark">
								{following.public_name}
								<VerifiedIcon isStar={following.is_star} />
							</p>
							<p class="text-gray-400 font-semibold">@{following.username}</p>
						</span>
					</a>
				</div>
			{/each}
		</article>
	</div>
{/if}
