<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { postForEdit } from '$lib/store/postForEdit'
	import { PostsRepository } from '$lib/supabase/posts/PostsRepository'
	import type { IPost } from '$lib/types/post.types'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { fade } from 'svelte/transition'

	let postText: string
	let newValueText: string
	let isBtnDisabled: boolean = true
	let textareaHTML: HTMLTextAreaElement
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

	async function handleUpdatePost(post?: IPost): Promise<void> {
		if (post && newValueText !== post?.text) {
			const index = posts.indexOf(post)
			isBtnDisabled = true
			const { edit } = new PostsRepository()
			const isEdited = await edit(supabase, post, newValueText)
			isBtnDisabled = false

			if (isEdited) {
				posts[index].text = newValueText
				posts = [...posts]
				cleanStore()
			}
		}
	}

	function handleInputTextarea(event: Event, post?: IPost): void {
		const textarea = event.currentTarget as HTMLTextAreaElement
		const { value } = textarea

		!value ? (isBtnDisabled = true) : (isBtnDisabled = false)
		post?.text === value ? (isBtnDisabled = true) : (isBtnDisabled = false)

		newValueText = value
	}

	function handleCleanFormPost(): void {
		if (textareaHTML) {
			textareaHTML.value = ''
			isBtnDisabled = true
		}
	}

	function handleRollBack(post?: IPost): void {
		if (textareaHTML && post) {
			textareaHTML.value = post.text
			isBtnDisabled = true
		}
	}
</script>

{#if $postForEdit.enable && $postForEdit.post && $postForEdit.edit}
	<button on:click={cleanStore} class="fixed top-0 left-0 w-full h-full bg-opacity-40 bg-black z-[100]" />

	<div
		in:fade={{ duration: 150 }}
		class="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-[95%] max-w-xl h-max bg-white dark:bg-dark_light_gray text-dark dark:text-white rounded-xl shadow-2xl z-[200]"
	>
		<div class="flex px-3 mx-auto items-center justify-between w-full py-2">
			<div />
			<h1 class="text-xl">Edit Post</h1>
			<button class="" on:click={cleanStore}>
				<Icon icon="mingcute:close-circle-fill" width="30" class="text-gray-300 hover:text-gray-500 dark:hover:text-white" />
			</button>
		</div>

		<div class="px-3">
			<textarea
				class="
			p-2 w-full h-24 sm::h-16 bg-light_gray dark:bg-dark_white border-b-2 dark:border-b dark:border-dark_light_gray
			border-transparent rounded-lg outline-none transition-all duration-300 resize-none
			focus:h-24 focus:border-b-bg"
				name="text"
				id="text"
				placeholder="{$currentUser.username}, What's on your mind?"
				value={postText}
				on:input={(e) => handleInputTextarea(e, $postForEdit.post)}
				bind:this={textareaHTML}
			/>
		</div>

		<div class="p-3 pt-1 flex items-center justify-end gap-2">
			<button
				on:click={() => handleRollBack($postForEdit.post)}
				class="bg-black active:scale-95 active:duration-0 dark:bg-dark_white text-white px-2.5 py-1.5 rounded-md shadow-sm transition-all text-sm select-none"
				type="reset"
			>
				Rollback
			</button>

			<button
				on:click={handleCleanFormPost}
				class="bg-red-400 active:scale-95 active:duration-0 text-white px-2.5 py-1.5 rounded-md shadow-sm transition-all text-sm select-none"
				type="reset"
			>
				Clean
			</button>

			<button
				on:click={() => handleUpdatePost($postForEdit.post)}
				type="submit"
				disabled={isBtnDisabled}
				class="
				{isBtnDisabled ? 'opacity-40 bg-gray-800' : 'bg_gradient'}
				text-white px-2.5 py-1.5 rounded-md shadow-lg transition-all text-sm select-none bg-primary"
			>
				<p>Update</p>
			</button>
		</div>
	</div>
{/if}
