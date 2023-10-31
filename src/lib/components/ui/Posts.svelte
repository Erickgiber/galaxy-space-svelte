<script lang="ts">
	import dayjs from 'dayjs'
	import type { IPost } from '$lib/types/post.types'
	import Icon from '@iconify/svelte'
	export let posts: IPost[]
</script>

<section class="my-2 flex flex-col gap-3">
	{#if posts && posts.length > 0}
		{#each posts as post}
			<article class="relative flex flex-col gap-2 pb-10 bg-white py-2 rounded-lg shadow-sm">
				<a
					class="flex max-w-max rounded-md gap-1.5 px-2 pr-5 py-1.5 transition-all hover:bg-bg"
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
							{#if post.user.is_star}
								<Icon
									class="grid place-content-center text-base"
									icon="material-symbols:verified-rounded"
									color="#5d23ce"
								/>
							{/if}
						</p>
						<p class="text-sm font-semibold text-gray-500">@{post.username}</p>
					</div>
				</a>
				<p class="px-2 text-[15px]">
					{@html post.text}
				</p>

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
					{dayjs(post.created_at).format('DD-MM-YY h:mm A')}
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
