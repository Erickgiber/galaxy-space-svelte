<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { LikesRepository } from '$lib/supabase/likes/LikesRepository'
	import type { TypeImage } from '$lib/types/image.types'
	import { likesShower } from '$lib/utils/likesShower'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import TooltipLikes from '../TooltipLikes.svelte'

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
					<div class="w-full h-full shadow-lg bg-white dark:bg-dark_white rounded-xl p-2">
						<a href="/space/posts/{image.id}?u={image.user.id}">
							<img class="w-full h-56 sm:h-72 object-cover rounded-xl" src={image.image_url} alt={image.text} />
						</a>
						<p class="text-[15px] dark:text-dark_text h-6 pl-2 pr-3 mt-2 text-ellipsis overflow-hidden whitespace-nowrap">
							{@html image.text}
						</p>

						<!-- Stats -->
						<div class="mx-2 flex items gap-2 border-b dark:border-dark_light_gray">
							<button class="relative hover:text-black group star-count-post-{image.id} text-sm text-dark font-semibold">
								{likesShower(image.totalLikes)}
								<div class="hidden group-hover:flex text-dark">
									<TooltipLikes likes={image.likes} />
								</div>
							</button>
						</div>

						<ul class="mt-2 flex items-center gap-2 px-2">
							<li class="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
								{#if image.isLiked}
									<button
										disabled={btnLikeDisable}
										on:click={() => handleDislike(image)}
										type="button"
										class="outline-none flex items-center gap-1 bg-light_gray dark:bg-dark_bg dark:text-white hover:bg-light_gray transition-all duration-100 pr-4 p-1.5 rounded-md"
									>
										<Icon icon="solar:star-bold-duotone" width="24" color="var(--primary)" />
										<span class="translate-y-0.5 text-lg font-semibold">{image.totalLikes}</span>
									</button>
								{:else}
									<button
										disabled={btnLikeDisable}
										on:click={() => handleLike(image)}
										type="button"
										class="outline-none bg-light_gray dark:bg-dark_light_gray dark:text-white flex items-center gap-1 active:bg-primary active:text-white transition-all duration-50 pr-4 p-1.5 rounded-md"
									>
										<Icon icon="solar:star-line-duotone" width="23" />
										<span class="translate-y-0.5 text-lg">{image.totalLikes}</span>
									</button>
								{/if}
							</li>

							<li>
								<a
									href="/space/posts/{image.id}?u={image.user.id}"
									class="w-10 h-10 bg-light_gray dark:bg-dark_light_gray dark:text-white pr-2 pl-2.5 pb-0.5 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
							active:scale-95 active:duration-0 active:bg-primary active:text-white"
								>
									<Icon class="text-inherit" icon="fluent:comment-note-20-regular" width="24" />
								</a>
							</li>
						</ul>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{:else if currentSection === 'images' && imageList.length === 0}
	<div class="mx-auto my-5 flex flex-col items-center">
		<lord-icon src="https://cdn.lordicon.com/nmipallp.json" trigger="loop" delay="2000" style="width:250px;height:250px" />
		<b class="text-xl dark:text-white">This is dead x.x</b>
	</div>
	<br />
{/if}
