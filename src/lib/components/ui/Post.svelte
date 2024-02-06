<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { LikesRepository } from '$lib/supabase/likes/LikesRepository'
	import type { IPost } from '$lib/types/post.types'
	import { commentsShower } from '$lib/utils/commentsShower'
	import { likesShower } from '$lib/utils/likesShower'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import dayjs from 'dayjs'
	import CommentPost from './CommentPost.svelte'
	import ModalShare from './ModalShare.svelte'
	import TooltipLikes from './TooltipLikes.svelte'
	import VerifiedIcon from './VerifiedIcon.svelte'

	export let supabase: SupabaseClient
	export let post: IPost
	let btnLikeDisable = false
	let index = 0
	let isShare: number[] = []
	let isComment: number[] = [index]

	const likeRepository = new LikesRepository()

	const handleLike = async (post: IPost) => {
		btnLikeDisable = true
		const isLiked = await likeRepository.setLike(supabase, post.post_id, $currentUser)
		if (isLiked) {
			// @ts-ignore
			post.isLiked = true
			post.totalLikes++
		}
		btnLikeDisable = false
	}

	const handleDislike = async (post: IPost) => {
		btnLikeDisable = true
		const isNotLiked = await likeRepository.removeLike(supabase, post.post_id, $currentUser)
		if (isNotLiked) {
			// @ts-ignore
			post.isLiked = false
			post.totalLikes--
		}
		btnLikeDisable = false
	}

	function handleToggleComment(index: number) {
		if (isComment.includes(index)) {
			isComment = isComment.filter((id) => id !== index)
		} else {
			isComment = [...isComment, index]
		}
	}

	function handleToggleShare(index: number) {
		if (isShare.includes(index)) {
			isShare = isShare.filter((id) => id !== index)
		} else {
			isShare = [index]
		}
	}
</script>

<svelte:head>
	<title>{post.text ? `${post.text} | ` : ''} Galaxy Space</title>

	<meta name="keywords" content={post.text?.replaceAll(' ', ',')} />
	<meta name="title" content={post.text} />
	<meta name="description" content={post.text ?? ''} />
</svelte:head>

<section class="my-2 flex flex-col gap-3">
	{#if post.text || post.image_url}
		<article class="relative flex flex-col gap-2 pb-10 bg-white dark:bg-dark_white py-2 sm:rounded-lg shadow-sm">
			<a class="flex ml-2 max-w-max rounded-md gap-1.5 pl-0.5 py-1.5 transition-all" href="/space/u/{post.user?.username}">
				<img class="w-10 h-10 rounded-full object-cover" src={post.user.photo_url} alt={post.username} />
				<div class="flex flex-col leading-4">
					<p class="flex items-center gap-1 dark:text-dark_text">
						{post.user.public_name}
						<VerifiedIcon isStar={post.user.is_star} />
					</p>
					<p class="text-sm font-semibold text-gray-500 dark:text-dark">@{post.username}</p>
				</div>
			</a>
			{#if post.text}
				<p class="px-3.5 text-[15px] dark:text-dark_text">
					{@html post.text}
				</p>
			{/if}

			{#if post.image_url}
				<div class="w-full h-max mt-1" style="background-image: url({post.image_url}); background-size: cover; background-position: center;">
					<div class="w-full h-max backdrop-blur-md">
						<img class="w-auto mx-auto h-full max-h-[450px]" src={post.image_url} alt="xd" />
					</div>
				</div>
			{/if}

			<!-- Stats -->
			<div class="mx-3 flex items gap-2 border-b dark:border-dark_light_gray">
				<button class="relative hover:text-black group dark:hover:text-white text-sm text-dark font-semibold">
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

			<div class="flex gap-3 items-center px-3 py-1 dark:border-dark_light_gray border-light_gray">
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

				<button
					on:click={() => history.back()}
					class="w-10 h-10 bg-primary dark:bg-primary dark:text-white text-white px-2 py-0.5 grid place-content-center outline-none transition-all duration-50 rounded-md
						active:scale-95 active:duration-0 active:bg-primary active:text-white"
				>
					<Icon icon="carbon:scale" width={25} />
				</button>

				<div class="relative">
					<button
						class="bg-light_gray dark:bg-dark_light_gray dark:text-white pr-2 pl-2.5 pb-0.5 h-10 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
							active:scale-95 active:duration-0 active:bg-primary active:text-white {isShare.includes(index)
							? 'bg-primary dark:bg-primary text-white dark:text-white shadow-md '
							: ''} "
						on:click={() => handleToggleShare(index)}
					>
						<Icon class="text-inherit" icon="carbon:copy-link" width="23" />
					</button>
					<ModalShare closeModal={handleToggleShare} {index} isEnable={isShare.includes(index)} {post} />
				</div>

				<!-- Date Time -->
				<div class="absolute bg-white dark:bg-dark_white bottom-2 left-3 text-sm text-dark">
					{dayjs(post.created_at).format('DD-MM-YYYY h:mm A')}
				</div>
			</div>

			<!-- ? Comments -->
			<CommentPost isEnable={isComment.includes(index)} fullHeight comments={post.comments} {supabase} post_id={post.post_id} />
		</article>
	{/if}
</section>
