<script lang="ts">
	import dayjs from 'dayjs'
	import type { IPost } from '$lib/types/post.types'
	import Icon from '@iconify/svelte'
	import VerifiedIcon from './VerifiedIcon.svelte'
	import { currentUser, type ICurrentUser } from '$lib/store/currentUser'
	import { page } from '$app/stores'
	import { handleLikeNotifications } from '$lib/utils/notifications/handleLikeNotifications'
	export let posts: IPost[]

	const handleLike = async (
		post_id: string,
		uuid_profile: string,
		username_profile: string,
		currentUser: ICurrentUser,
		image_url: string | null
	) => {
		const { data, error } = await $page.data.supabase.from('likes').insert({
			post_id,
			like: true,
			username: currentUser.username,
			uuid: currentUser.uuid,
			type: 'post'
		})

		await handleLikeNotifications(
			$currentUser,
			uuid_profile,
			username_profile,
			$page.data.supabase,
			{
				title: 'Liked your post',
				description: `<b class="text-primary">${$currentUser.public_name}</b> liked your post`,
				type: 'post',
				from_username: currentUser.username,
				from_uuid: currentUser.uuid,
				image_url: image_url ? image_url : '',
				url: `/space/post/${post_id}`
			}
		)

		posts.map((post) => {
			if (post.post_id === post_id) {
				post.isLiked = true
				post.totalLikes++
			}
		})
		posts = [...posts]
	}

	const handleDislike = async (post_id: string, currentUser: ICurrentUser) => {
		const { data, error } = await $page.data.supabase
			.from('likes')
			.delete()
			.match({ post_id, uuid: currentUser.uuid })

		posts.map((post) => {
			if (post.post_id === post_id) {
				post.isLiked = false
				post.totalLikes--
			}
		})

		posts = [...posts]
	}
</script>

<section class="my-2 flex flex-col gap-3">
	{#if posts && posts.length > 0}
		{#each posts as post}
			<article class="relative flex flex-col gap-2 pb-10 bg-white py-2 rounded-lg shadow-sm">
				<a
					class="flex ml-2 max-w-max rounded-md gap-1.5 pl-0.5 py-1.5 transition-all"
					href="/space/u/{post.user?.username}"
				>
					<img
						class="w-10 h-10 rounded-full object-cover"
						src={post.user.photo_url}
						alt={post.username}
					/>
					<div class="flex flex-col leading-4">
						<p class="flex items-center gap-1">
							{post.user.public_name}
							<VerifiedIcon isStar={post.user.is_star} />
						</p>
						<p class="text-sm font-semibold text-gray-500">@{post.username}</p>
					</div>
				</a>
				{#if post.text}
					<p class="px-3.5 text-[15px]">
						{@html post.text}
					</p>
				{/if}

				{#if post.image_url}
					<div
						class="w-full h-max mt-1"
						style="background-image: url({post.image_url}); background-size: cover; background-position: center;"
					>
						<div class="w-full h-max backdrop-blur-md">
							<img class="w-auto mx-auto h-full max-h-[450px]" src={post.image_url} alt="xd" />
						</div>
					</div>
				{/if}

				<div class="absolute bottom-2 left-3 text-sm text-dark">
					{dayjs(post.created_at).format('DD/MM/YYYY h:mm A')}
				</div>

				<div class="flex items-center px-2 py-1 border-b-2 border-light_gray">
					{#if post.isLiked}
						<button
							on:click={() => handleDislike(post.post_id, $currentUser)}
							type="button"
							class="outline-none flex items-center gap-1 hover:bg-light_gray transition-all duration-100 pr-4 p-1.5 rounded-md"
						>
							<Icon icon="fluent:thumb-like-16-filled" width="25" color="var(--primary)" />
							{post.totalLikes}
							<span class="text-sm">
								{post.totalLikes > 1 ? 'Likes' : 'Like'}
							</span>
						</button>
					{:else}
						<button
							on:click={() =>
								handleLike(post.post_id, post.uuid, post.username, $currentUser, post.image_url)}
							type="button"
							class="outline-none flex items-center gap-1 hover:bg-light_gray transition-all duration-100 pr-4 p-1.5 rounded-md"
						>
							<Icon icon="fluent:thumb-like-16-regular" width="25" />
							{post.totalLikes}
							<span class="text-sm">
								{post.totalLikes > 1 ? 'Likes' : 'Like'}
							</span>
						</button>
					{/if}
				</div>
			</article>
		{/each}
	{:else}
		<div class="mx-auto my-5 flex flex-col items-center">
			<lord-icon
				src="https://cdn.lordicon.com/nmipallp.json"
				trigger="loop"
				delay="2000"
				style="width:250px;height:250px"
			/>
			<b class="text-xl">This is dead x.x</b>
		</div>
	{/if}
</section>
