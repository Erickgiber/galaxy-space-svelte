<script lang="ts">
	import { MENU_POST_OPTIONS } from '$lib/config/menus/menu-post-options'
	import { currentUser } from '$lib/store/currentUser'
	import { LikesRepository } from '$lib/supabase/likes/LikesRepository'
	import type { IPost } from '$lib/types/post.types'
	import { commentsShower } from '$lib/utils/commentsShower'
	import { likesShower } from '$lib/utils/likesShower'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import dayjs from 'dayjs'
	import { slide } from 'svelte/transition'
	import CommentPost from './CommentPost.svelte'
	import ModalEditPost from './ModalEditPost.svelte'
	import ModalRemovePost from './ModalRemovePost.svelte'
	import ModalShare from './ModalShare.svelte'
	import TooltipLikes from './TooltipLikes.svelte'
	import VerifiedIcon from './VerifiedIcon.svelte'
	import PlayerComponent from './Player/PlayerComponent.svelte'
	export let posts: IPost[]
	export let supabase: SupabaseClient
	let btnLikeDisable = false
	let isComment: number[] = []
	let isShare: number[] = []
	let isMenuOptions: number[] = []

	const likeRepository = new LikesRepository()

	const handleLike = async (post: IPost) => {
		btnLikeDisable = true
		const isLiked = await likeRepository.setLike(supabase, post.post_id, $currentUser)

		if (isLiked) {
			posts.map((item: IPost) => {
				if (item.post_id === post.post_id) {
					// @ts-ignore
					item.isLiked = true
					item.totalLikes++
				}
			})

			posts = [...posts]
		}

		btnLikeDisable = false
	}

	const handleDislike = async (post: IPost) => {
		btnLikeDisable = true
		const isLiked = await likeRepository.removeLike(supabase, post.post_id, $currentUser)

		if (isLiked) {
			posts.map((item: IPost) => {
				if (item.post_id === post.post_id) {
					// @ts-ignore
					item.isLiked = false
					item.totalLikes--
				}
			})

			posts = [...posts]
		}

		btnLikeDisable = false
	}

	function handleToggleComment(index: number) {
		if (isComment.includes(index)) {
			isComment = isComment.filter((id) => id !== index)
		} else {
			isComment = [index]
		}
	}

	function handleToggleShare(index: number) {
		if (isShare.includes(index)) {
			isShare = isShare.filter((id) => id !== index)
		} else {
			isShare = [index]
		}
	}

	function handleTogglePostMenu(index: number) {
		if (isMenuOptions.includes(index)) {
			isMenuOptions = isMenuOptions.filter((id) => id !== index)
		} else {
			isMenuOptions = [index]
		}
	}
</script>

<section class="my-2 flex flex-col gap-3">
	{#if posts && posts.length > 0}
		{#each posts as post, index}
			{#if post.text || post.image_url || post.video_url}
				<article class="relative flex flex-col gap-2 pb-2 bg-white dark:bg-dark_white dark:text-dark_text py-2 sm:rounded-lg shadow-sm">
					<div class="relative flex items-start justify-between">
						<a class="flex ml-2 max-w-max rounded-md gap-1.5 pl-0.5 py-1.5 transition-all" href="/space/u/{post.user?.username}">
							<img class="w-10 h-10 rounded-full object-cover" src={post.user.photo_url} alt={post.username} />
							<div class="flex flex-col leading-4">
								<p class="flex items-center gap-1">
									{post.user.public_name}
									<VerifiedIcon isStar={post.user.is_star} />
								</p>
								<p class="text-sm font-semibold text-gray-500 dark:text-dark">@{post.username}</p>
							</div>
						</a>

						<button on:click={() => handleTogglePostMenu(index)} class="mr-4 mt-1 hover:text-primary">
							<Icon icon="iconamoon:menu-kebab-horizontal-bold" width="22" />
						</button>

						{#if isMenuOptions.includes(index)}
							<article
								transition:slide={{ duration: 200 }}
								class="bg-white border dark:border-none dark:bg-dark_light_gray z-10 shadow-2xl rounded-xl rounded-tr-none w-32 h-max absolute top-5 right-11"
							>
								{#each MENU_POST_OPTIONS(post, $currentUser) as { name, width, icon, className, onClick }, index}
									<button
										style={index === 0
											? 'border-top-left-radius: 10px;'
											: index === Number(MENU_POST_OPTIONS(post, $currentUser).length - 1)
											? 'border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;'
											: null}
										class="w-full text-dark_text group transition-all hover:transition-none duration-300 active:transition-none active:text-black dark:active:text-white px-3 gap-2 py-2 flex items-center hover:bg-black hover:bg-opacity-10"
										type="button"
										on:click={onClick}
									>
										<Icon {icon} {width} class={className} />
										<span class={className}>{name}</span>
									</button>
								{/each}
							</article>
						{/if}
					</div>

					{#if post.text}
						<p class="px-3.5">
							{@html post.text}
						</p>
					{/if}

					{#if post.image_url}
						<a href="/space/posts/{post.id}?u={post.user.id}" class="w-full h-max mt-1">
							<div class="w-full h-max bg-opacity-10 dark:bg-opacity-40 bg-black">
								<img class="w-auto mx-auto h-full max-h-[450px]" src={post.image_url} alt={post.text ?? post.username} />
							</div>
						</a>
					{/if}

					{#if post.video_url}
						<div class="w-full h-max mt-1">
							<div class="w-full h-max backdrop-blur-md bg-black">
								<PlayerComponent src={post.video_url} />
							</div>
						</div>
					{/if}

					<!-- Stats -->
					<div class="mx-3 flex items gap-2 border-b dark:border-dark_light_gray">
						<button class="relative hover:text-black dark:hover:text-white group text-sm text-dark font-semibold">
							{likesShower(post.totalLikes)}
							<div class="hidden group-hover:flex text-dark">
								<TooltipLikes likes={post.likes} />
							</div>
						</button>

						<button
							on:click={() => handleToggleComment(index)}
							class="relative hover:text-black dark:hover:text-white group text-sm text-dark font-semibold
							"
						>
							{commentsShower(post.totalComments)}
						</button>
					</div>

					<div class="flex items-center gap-3 px-3">
						{#if post.isLiked}
							<button
								disabled={btnLikeDisable}
								on:click={() => handleDislike(post)}
								type="button"
								class="active:scale-95 active:duration-0 outline-none flex items-center gap-1 dark:bg-dark_bg dark:text-white bg-light_gray hover:bg-light_gray transition-all duration-100 p-2 pt-1.5 rounded-md"
							>
								<Icon icon="solar:star-bold-duotone" width="24" color="var(--primary)" />
							</button>
						{:else}
							<button
								disabled={btnLikeDisable}
								on:click={() => handleLike(post)}
								type="button"
								class="active:scale-95 active:duration-0 outline-none bg-light_gray dark:bg-dark_light_gray dark:text-white flex items-center gap-1 active:bg-primary active:text-white transition-all duration-50 p-2 pt-1.5 rounded-md"
							>
								<Icon icon="solar:star-line-duotone" width="23" />
							</button>
						{/if}

						<button
							class="w-10 h-10 bg-light_gray dark:bg-dark_light_gray dark:text-white pr-2 pl-2.5 pb-0.5 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
							active:scale-95 active:duration-0 active:bg-primary active:text-white
							{isComment.includes(index) ? 'bg-primary dark:bg-primary text-white dark:text-white' : ''}"
							on:click={() => handleToggleComment(index)}
						>
							<Icon class="text-inherit" icon="fluent:comment-note-20-regular" width="24" />
						</button>

						<a
							class="w-10 h-10 bg-light_gray dark:bg-dark_light_gray dark:text-white px-2 py-0.5 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
						active:scale-95 active:duration-0 active:bg-primary active:text-white"
							href="/space/posts/{post.id}?u={post.user.id}"
						>
							<Icon icon="carbon:scale" width={25} />
						</a>

						<div class="relative">
							<button
								class="w-10 h-10 bg-light_gray dark:bg-dark_light_gray dark:text-white pr-2 pl-2.5 pb-0.5 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
							active:scale-95 active:duration-0 active:bg-primary active:text-white
							{isShare.includes(index) ? 'bg-primary dark:bg-primary text-white dark:text-white' : ''}"
								on:click={() => handleToggleShare(index)}
							>
								<Icon class="text-inherit" icon="uil:share" width="23" />
							</button>
							<ModalShare closeModal={handleToggleShare} {index} isEnable={isShare.includes(index)} {post} />
						</div>

						<!-- Date Time -->
						<div class="absolute bg-white dark:bg-dark_white bottom-2 right-3 text-xs text-dark">
							{dayjs(post.created_at).format('DD-MM-YYYY h:mm A')}
						</div>
					</div>

					<!-- ? Comments -->
					<CommentPost isEnable={isComment.includes(index)} comments={post.comments} {supabase} post_id={post.post_id} />
				</article>
			{/if}
		{/each}

		<!-- Modals -->
		<ModalEditPost bind:posts {supabase} />
		<ModalRemovePost bind:posts {supabase} />
	{:else}
		<div class="mx-auto my-5 flex flex-col items-center">
			<lord-icon src="https://cdn.lordicon.com/nmipallp.json" trigger="loop" delay="2000" style="width:250px;height:250px" />
			<b class="text-xl dark:text-white">This is dead x.x</b>
		</div>
	{/if}
</section>
