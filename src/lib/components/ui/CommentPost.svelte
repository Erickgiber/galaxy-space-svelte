<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { PostsRepository } from '$lib/supabase/posts/PostsRepository'
	import type { IComment } from '$lib/types/post.types'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { writable } from 'svelte/store'

	export let supabase: SupabaseClient
	export let post_id: number | string
	export let comments: IComment[]
	let commentsStore = writable<IComment[]>(comments)
	let comment = writable('')
	let postRepository: PostsRepository

	$: if (typeof window !== 'undefined') {
		postRepository = new PostsRepository()
	}
</script>

<div class="w-full hidden flex-col h-60 overflow-auto mt-2 comment-box-post-{post_id}">
	<h1 class="dark:text-white py-2 px-3 border-b dark:border-dark_light_gray font-medium">New Comment</h1>

	<article class="flex flex-col gap-2 w-full p-3">
		<a href="/space/u/{$currentUser.username}" class="w-max flex gap-2 items-center pb-0">
			<img class="w-10 h-10 rounded-full" src={$currentUser.photo_url} alt={$currentUser.public_name} />

			<p class="flex flex-col leading-none">
				<span>{$currentUser.public_name}</span>
				<span>@{$currentUser.username}</span>
			</p>
		</a>

		<label class="flex gap-1 rounded-md dark:text-white" for="comment-post-{post_id}">
			<textarea
				class="w-full bg-light_gray p-2 pb-1 text-sm resize-none h-10 rounded-lg outline-none border border-transparent
            focus:border-primary focus:text-base transition-all"
				name="comment-post-{post_id}"
				id="comment-post-{post_id}"
				placeholder="I think that..."
				bind:value={$comment}
			/>
			<button
				on:click={() => postRepository.newComment(supabase, post_id, $currentUser, comment, $comment, '', commentsStore, $commentsStore)}
				class="w-11 h-10 rounded-lg grid place-content-center text-white bg-primary"
				type="button"
				on:click={() => console.log('waos')}
			>
				<Icon icon="lucide:send" />
			</button>
		</label>
	</article>

	<h1 class="dark:text-white py-2 px-3 border-b dark:border-dark_light_gray font-medium">Comments</h1>

	{#each $commentsStore.reverse() as { profile, text }}
		<article class="flex flex-col mb-2 gap-2 w-full p-3 border-l-2 border-primary">
			<a href="/space/u/{profile.username}" class="w-max flex gap-2 items-center pb-0">
				<img class="w-10 h-10 rounded-full" src={profile.photo_url} alt={profile.public_name} />

				<p class="flex flex-col leading-none">
					<span>{profile.public_name}</span>
					<span>@{profile.username}</span>
				</p>
			</a>

			<p>
				{text}
			</p>
		</article>
	{/each}
</div>
