<script lang="ts">
	import type { IProfile } from '$lib/types/profile.types'
	import Icon from '@iconify/svelte'
	import ButtonLoader from './ButtonLoader.svelte'
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
		class="grid place-content-center px-2 z-40 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50
backdrop-blur-sm p-2"
	>
		<div class="bg-white dark:bg-dark_white rounded-xl pt-2 shadow-2xl w-72">
			<div class="pb-1 px-2 text-dark dark:text-white dark:border-dark_light_gray border-b-2 border-light_gray flex justify-between">
				<p class="text-lg flex items-center gap-1">
					<Icon icon="solar:users-group-rounded-bold-duotone" class="text-xl text-primary" />
					Following
				</p>
				<button
					class="bg-red-500 text-white active:scale-95 transition-all duration-100 grid place-content-center p-1 rounded-xl"
					on:click={() => (isModalFollowing = false)}
				>
					<Icon icon="carbon:close" class="text-xl" />
				</button>
			</div>

			<article class="flex gap-2 flex-col h-96 overflow-x-hidden overflow-y-auto py-2">
				{#if followings.length > 0}
					{#each followings as following}
						<div class="px-2">
							<a
								on:click={() => (isModalFollowing = false)}
								href="/space/u/{following.username}"
								class="w-full flex gap-1.5 py-2 px-2 border-light_gray hover:bg-light_gray dark:hover:bg-dark_light_gray rounded-md hover:shadow-sm transition-all duration-100"
							>
								<img class="w-7 h-7 sm:w-12 sm:h-12 object-cover rounded-full bg-light_gray" src={following.photo_url} alt={following.username} />
								<span class="flex flex-col leading-5">
									<p class="flex items-center gap-1.5 font-bold text-dark dark:text-white">
										{following.public_name}
										<VerifiedIcon isStar={following.is_star} />
									</p>
									<p class="text-gray-400 text-xs font-semibold">@{following.username}</p>
								</span>
							</a>
						</div>
					{/each}
				{:else}
					<ButtonLoader />
				{/if}
			</article>
		</div>
	</div>
{/if}
