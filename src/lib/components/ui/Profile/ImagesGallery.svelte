<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { LikesRepository } from '$lib/supabase/likes/LikesRepository'
	import type { TypeImage } from '$lib/types/image.types'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'

	export let imageList: TypeImage[] = []
	export let currentSection: string = ''
	export let supabase: SupabaseClient
	let btnLikeDisable = false

	const repository = new LikesRepository()

	const handleLike = async (image: TypeImage) => {
		btnLikeDisable = true
		const isLiked = await repository.setLike(supabase, image.post_id, $currentUser)

		if (isLiked) {
			imageList.map((imageLi: TypeImage) => {
				if (imageLi.post_id === image.post_id) {
					image.isLiked = { ...image.isLiked, like: true }
					image.totalLikes++
				}
			})

			imageList = [...imageList]
		}
		btnLikeDisable = false
	}

	const handleDislike = async (image: TypeImage) => {
		btnLikeDisable = true
		const isNotLiked = await repository.removeLike(supabase, image.post_id, $currentUser)

		if (isNotLiked) {
			imageList.map((imageLi) => {
				if (imageLi.post_id === image.post_id) {
					// @ts-ignore // Removing propierty
					imageLi.isLiked = undefined
					imageLi.totalLikes--
				}
			})

			imageList = [...imageList]
		}
		btnLikeDisable = false
	}
</script>

<!-- If la lista existe -->
{#if currentSection === 'images' && imageList && imageList.length > 0}
	<div class="w-full pb-5 h-max mb-5 rounded-xl mt-3">
		<div class="grid grid-cols-2 lg:grid-cols-4 w-full justify-between gap-5">
			<!-- Iterar la lista de imagenes -->
			{#each imageList as image}
				{#if image.image_url}
					<!-- component -->
					<div class="w-full h-full shadow-lg bg-white rounded-xl p-2">
						<a href="/space/posts/{image.id}?u={image.user.id}">
							<img
								class="w-full h-56 sm:h-72 object-cover rounded-xl"
								src={image.image_url}
								alt={image.text}
							/>
						</a>
						<p
							class="text-[15px] h-6 pl-2 pr-3 mt-2 text-ellipsis overflow-hidden whitespace-nowrap"
						>
							{@html image.text}
						</p>
						<ul class="mt-2 flex items-center justify-between px-2">
							<li class="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
								{#if image.isLiked}
									<button
										disabled={btnLikeDisable}
										on:click={() => handleDislike(image)}
										type="button"
										class="outline-none flex items-center gap-1 bg-light_gray hover:bg-light_gray transition-all duration-100 pr-4 p-1.5 rounded-md"
									>
										<Icon icon="solar:star-bold-duotone" width="24" color="var(--primary)" />
										<span class="translate-y-0.5 text-lg font-semibold">{image.totalLikes}</span>
									</button>
								{:else}
									<button
										disabled={btnLikeDisable}
										on:click={() => handleLike(image)}
										type="button"
										class="outline-none bg-light_gray flex items-center gap-1 active:bg-primary active:text-white transition-all duration-50 pr-4 p-1.5 rounded-md"
									>
										<Icon icon="solar:star-line-duotone" width="23" />
										<span class="translate-y-0.5 text-lg">{image.totalLikes}</span>
									</button>
								{/if}
							</li>
						</ul>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}
