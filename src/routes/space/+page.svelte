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
	let inputHTMLFile: HTMLInputElement
	let imgExists = {
		src: '',
		name: ''
	}
	$: postText.length < 1 ? ($btnPostDisabled = true) : ($btnPostDisabled = false)

	const handleSubmitPost = () => {
		return resolver(btnPostDisabled, {
			onSuccess: () => {
				const post: IPost = {
					text: postText,
					image_url: imgExists ? imgExists.src : '',
					// @ts-ignore
					user: $currentUser,
					username: $currentUser.username,
					email: $currentUser.email,
					uuid: $currentUser.uuid
				}
				postText = ''
				posts = [post, ...posts]
				// @ts-ignore
				imgExists = undefined
			}
		})
	}

	const handleLoadImg = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement
		const files = input.files
		const reader = new FileReader()

		if (files && files.length > 0) {
			reader.readAsDataURL(files![0])
			reader.addEventListener('loadend', () => {
				imgExists = {
					src: reader.result as string,
					name: files[0].name
				}
				btnPostDisabled.set(false)
			})
		} else {
			btnPostDisabled.set(false)
		}
	}

	const handleCleanFormPost = () => {
		// Reseting img variable
		imgExists = {
			src: '',
			name: ''
		}
		if (postText.length > 0) {
			postText = ''
		}

		// Reseting input file
		inputHTMLFile.files = null
		inputHTMLFile.value = ''
		btnPostDisabled.set(true)
	}

	const handleCleanImage = () => {
		imgExists = {
			src: '',
			name: ''
		}

		if (postText.length === 0) {
			btnPostDisabled.set(true)
		}
	}
</script>

<svelte:head>
	<title>Galaxy Space</title>
</svelte:head>

<main class="flex justify-between gap-8">
	<div id="feed_content" class="flex flex-col w-full">
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

			<input
				on:change={handleLoadImg}
				type="file"
				name="image_url"
				id="image"
				maxlength="1"
				accept="image/*"
				class="hidden"
				bind:this={inputHTMLFile}
			/>

			<textarea
				class="
			p-2 w-full h-16 bg-white border-b-2
			border-transparent outline-none transition-all duration-300 resize-none
			focus:h-24 focus:border-b-bg
			"
				name="text"
				id="text"
				placeholder="{username}, What's on your mind?"
				bind:value={postText}
			/>

			<article class="w-full flex items-center justify-between px-4 pb-2">
				<!-- ? Buttons left -->
				<div class="flex justify-end gap-3">
					<label for="image" class="cursor-pointer">
						<Icon class="text-4xl" icon="flat-color-icons:add-image" />
					</label>
				</div>

				<!-- ? Buttons right -->
				<div class="flex gap-3">
					<button
						on:click={!$btnPostDisabled ? handleCleanFormPost : null}
						disabled={$btnPostDisabled}
						class="{$btnPostDisabled
							? 'opacity-20 bg-dark'
							: 'bg-red-400'}  text-white px-2.5 py-1.5 rounded-md shadow-sm transition-all text-sm select-none"
						type="reset"
					>
						Clean
					</button>
					<button type="submit" disabled={$btnPostDisabled}>
						<p
							class="
					{$btnPostDisabled ? 'opacity-40 bg-gray-800' : 'bg_gradient'}
					text-white px-2.5 py-1.5 rounded-md shadow-lg transition-all text-sm select-none"
						>
							Posting
						</p>
					</button>
				</div>
			</article>
		</form>
		{#if imgExists?.src}
			<div
				class="relative w-full h-max mt-2 rounded-lg shadow-md"
				style="background-image: url({imgExists.src}); background-size: cover; background-position: center;"
			>
				<div class="w-full h-max backdrop-blur-md rounded-lg">
					<img class="w-auto mx-auto h-80" src={imgExists.src} alt="xd" />
				</div>

				<button
					on:click={handleCleanImage}
					class="absolute top-2 right-2 p-0.5 rounded-md bg-red-500 shadow-xl"
				>
					<Icon icon="solar:trash-bin-2-bold" width="20" height="20" color="white" />
				</button>
			</div>
		{/if}

		<!-- ? Posts -->
		<Posts bind:posts />
	</div>

	<section
		style="background-image: linear-gradient(180deg, #5700e4 0%, #3e00a5 100%); background-size: 100% 80px;"
		class="w-[250px] hidden md:flex md:flex-col bg-white rounded-lg shadow-sm h-full bg-no-repeat"
	>
		<div class="w-[250px] h-max flex flex-col items-center px-2 pt-7 pb-3">
			<a
				href="/space/u/{$currentUser.username}"
				class="rounded-full transition-all hover:duration-75 hover:scale-95 hover:shadow-xl"
			>
				<img
					class="w-28 h-28 rounded-full object-cover bg-light_gray shadow-md border-2 border-white"
					src={$currentUser.photo_url}
					alt={$currentUser.public_name}
				/>
			</a>

			<article class="leading-5 mt-1 flex flex-col items-center text-center">
				<p class="text-base flex items-center text-center gap-1 text-dark font-semibold">
					{$currentUser.public_name}
					{#if $currentUser.is_star}
						<Icon
							class="grid place-content-center text-xl"
							icon="material-symbols:verified-rounded"
							color="#5d23ce"
						/>
					{/if}
				</p>
				<span class="text-sm text font-semibold text-gray-500">@{$currentUser.username}</span>
			</article>
			<article class="mt-2 flex items-center">
				{#if $currentUser.is_star}
					<b>You are a star!</b>
				{:else}
					<b>You're common user</b>
				{/if}
			</article>
			<div />
		</div>
	</section>
</main>

<style lang="scss">
	#feed_content {
		width: calc(100% - 250px);

		@media (width < 768px) {
			width: 100%;
		}
	}

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
