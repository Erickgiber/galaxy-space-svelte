<script lang="ts">
	import { enhance } from '$app/forms'
	import Posts from '$lib/components/ui/Posts.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import type { IPost } from '$lib/types/post.types.js'
	import { resolver } from '$lib/utils/resolver'
	import Icon from '@iconify/svelte'
	import { writable } from 'svelte/store'

	export let data
	let posts = data.posts as IPost[]

	const username = $currentUser.username.charAt(0).toUpperCase() + $currentUser.username.slice(1)
	let postText = ''
	let btnPostDisabled = writable(false)
	$: postText.length < 1 ? ($btnPostDisabled = true) : ($btnPostDisabled = false)

	const handleSubmitPost = () => {
		return resolver(btnPostDisabled, {
			onSuccess: () => {
				const post: IPost = {
					text: postText,
					image_url: '',
					// @ts-ignore
					user: $currentUser,
					username: $currentUser.username,
					email: $currentUser.email,
					uuid: $currentUser.uuid
				}
				postText = ''
				posts = [...posts, post]
			}
		})
	}
</script>

<svelte:head>
	<title>Galaxy Space</title>
</svelte:head>

<!-- ? Form for new post -->
<form
	use:enhance={handleSubmitPost}
	action="?/new_post"
	method="post"
	class="bg-white rounded-lg shadow-sm"
>
	<label for="text">
		<p class="px-3 py-1.5 border-b-2 border-bg flex items-center gap-1.5 text-gray-700">
			<Icon icon="ant-design:edit-outlined" />
			New post
		</p>
	</label>

	<textarea
		class="
		p-2 w-full h-20 bg-white border-b-2
		border-transparent outline-none transition-all duration-300 resize-none
		focus:h-32 focus:border-b-bg
		"
		name="text"
		id="text"
		placeholder="{username}, What's on your mind?"
		bind:value={postText}
	/>

	<div class="flex justify-end px-4 pb-3 gap-4">
		<button
			disabled={$btnPostDisabled}
			class="{$btnPostDisabled
				? 'opacity-20 bg-dark'
				: 'bg-red-400'}  text-white px-3 py-1.5 rounded-md shadow-sm transition-all"
			type="reset"
		>
			Clean
		</button>
		<button type="submit" disabled={$btnPostDisabled}>
			<p
				class="
			{$btnPostDisabled ? 'opacity-40 bg-gray-800' : 'bg_gradient'}
			text-white px-3 py-1.5 rounded-md shadow-lg transition-all
			"
			>
				Posting
			</p>
		</button>
	</div>
</form>

<!-- ? Posts -->
<Posts bind:posts />

<style lang="scss">
	#text:focus {
		background: rgb(93, 35, 206);
		background: linear-gradient(90deg, rgba(93, 35, 206, 0.05) 0%, rgba(255, 255, 255, 1) 24%);
	}

	.bg_gradient {
		background: var(--primary);
		background: -webkit-linear-gradient(180deg, #5700e4 0%, #3e00a5 100%);
		background: linear-gradient(180deg, #5700e4 0%, #3e00a5 100%);
	}
</style>
