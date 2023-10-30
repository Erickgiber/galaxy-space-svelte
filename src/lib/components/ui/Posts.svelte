<script lang="ts">
	import dayjs from 'dayjs'
	import type { IPost } from '$lib/types/post.types'
	export let posts: IPost[]

	const date = dayjs(posts[0].created_at).format('h:mm')
	console.log(date)
</script>

<section class="my-2 flex flex-col gap-3">
	{#if posts && posts.length > 0}
		{#each posts as post}
			<article class="relative flex flex-col gap-2 bg-white py-2 px-1 rounded-lg shadow-sm">
				<a
					class="flex max-w-max rounded-md gap-1.5 px-2 py-1.5 transition-all hover:bg-bg"
					href="/space/u/{post.user?.username}"
				>
					<img
						class="w-10 h-10 rounded-full object-cover"
						src={post.user.photo_url}
						alt={post.username}
					/>
					<div class="flex flex-col leading-4">
						<p>{post.user.public_name}</p>
						<p class="text-sm font-semibold text-gray-500">@{post.username}</p>
					</div>
				</a>
				<p class="px-2 pb-7">
					{@html post.text}
				</p>

				<div class="absolute bottom-1 left-3 text-sm text-dark">
					{dayjs(post.created_at).format('DD-MM-YY h:mm A')}
				</div>
			</article>
		{/each}
	{:else}
		<p>No posts</p>
	{/if}
</section>
