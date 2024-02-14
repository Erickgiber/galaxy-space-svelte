<script lang="ts">
	import { postForEdit } from '$lib/store/postForEdit'
	import { PostsRepository } from '$lib/supabase/posts/PostsRepository'
	import type { IPost } from '$lib/types/post.types'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { fade } from 'svelte/transition'

	let postText: string
	let newValueText: string
	let isBtnDisabled: boolean = false
	export let supabase: SupabaseClient
	export let posts: IPost[]
	const cleanStore = () => postForEdit.set({ enable: false, post: undefined, remove: false, edit: false })

	$: if (typeof window !== 'undefined' && $postForEdit.enable) {
		document.body.style.overflowY = 'hidden'
		postText = $postForEdit?.post?.text ?? ''
	} else if (typeof window !== 'undefined' && !$postForEdit.enable) {
		window.document.body.style.overflowY = 'auto'
		postText = ''
	}

	async function handleRemovePost(post?: IPost): Promise<void> {
		if (post && newValueText !== post?.text) {
			isBtnDisabled = true
			const { remove } = new PostsRepository()
			const isRemoved = await remove(supabase, post)
			isBtnDisabled = false

			if (isRemoved) {
				posts = posts.filter((item) => item.post_id !== post.post_id)
				if (posts.length === 0) {
					history.back()
				}
				cleanStore()
			}
		}
	}
</script>

{#if $postForEdit.enable && $postForEdit.post && $postForEdit.remove}
	<button on:click={cleanStore} class="fixed top-0 left-0 w-full h-full bg-opacity-40 bg-black z-[100]" />

	<div
		in:fade={{ duration: 150 }}
		class="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-[95%] max-w-xl h-max bg-white dark:bg-dark_light_gray text-dark dark:text-white rounded-xl shadow-2xl z-[200]"
	>
		<div class="flex px-3 mx-auto items-center justify-between w-full py-2">
			<div />
			<h1 class="text-xl">Remove Post</h1>
			<button class="" on:click={cleanStore}>
				<Icon icon="mingcute:close-circle-fill" width="30" class="text-dark hover:text-black dark:hover:text-white" />
			</button>
		</div>

		<div class="px-3 flex justify-center my-3">
			<b class="flex items-center gap-2 bg-black rounded-lg bg-opacity-10 w-full p-2">
				<Icon icon="clarity:alert-line" width={20} class="text-red-500" />
				Are you sure you want to delete the post?
			</b>
		</div>

		<div class="p-3 pt-1 flex items-center justify-end gap-2">
			<button
				on:click={cleanStore}
				class="bg-red-400 active:scale-95 active:duration-0 text-white px-2.5 py-1.5 rounded-md shadow-sm transition-all text-sm select-none"
				type="reset"
			>
				Cancel
			</button>

			<button
				on:click={() => handleRemovePost($postForEdit.post)}
				type="submit"
				disabled={isBtnDisabled}
				class="
				{isBtnDisabled ? 'opacity-40 bg-gray-800' : 'bg_gradient'}
				text-black dark:text-white px-2.5 font-semibold py-1.5 rounded-md shadow-lg transition-all text-sm select-none bg-white dark:bg-dark_white"
			>
				<p>Yes</p>
			</button>
		</div>
	</div>
{/if}
