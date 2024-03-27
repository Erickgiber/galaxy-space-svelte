<script lang="ts">
	import { browser } from '$app/environment'
	import { enhance } from '$app/forms'
	import { preloadCode, preloadData } from '$app/navigation'
	import Posts from '$lib/components/ui/Posts.svelte'
	import PlayerComponent from '$lib/components/ui/Player/PlayerComponent.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import type { IPost } from '$lib/types/post.types.js'
	import { resolver } from '$lib/utils/resolver'
	import { bytesToMB } from '$lib/utils/bytesToMb'
	import Icon from '@iconify/svelte'
	import { writable } from 'svelte/store'
	import { toast } from '@zerodevx/svelte-toast'

	export let data
	let posts = data.posts as IPost[]

	const username = $currentUser.username.charAt(0).toUpperCase() + $currentUser.username.slice(1)
	let postText = ''
	let btnPostDisabled = writable(false)
	let inputHTMLFileImage: HTMLInputElement
	let inputHTMLFileVideo: HTMLInputElement
	let imgExists = {
		src: '',
		name: ''
	}
	let videoExists = {
		src: '',
		name: ''
	}

	$: postText.length < 1 ? ($btnPostDisabled = true) : ($btnPostDisabled = false)

	const handleSubmitPost = () => {
		return resolver(btnPostDisabled, {
			onSuccess: (new_posts?: IPost[]) => {
				postText = ''
				// @ts-ignore
				imgExists = undefined
				// @ts-ignore
				videoExists = undefined
				if (new_posts) {
					posts = new_posts
				}
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

	const handleLoadVideo = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement
		const files = input.files
		const reader = new FileReader()
		const sizeFile = inputHTMLFileVideo && inputHTMLFileVideo.files ? inputHTMLFileVideo.files[0]?.size : false
		if (sizeFile) {
			const mbSize = bytesToMB(sizeFile)
			if (mbSize > 20) {
				toast.pop()
				toast.push('The video must be equal to or less than 20 mb in size')
				return
			}
		}

		if (files && files.length > 0) {
			reader.readAsDataURL(files![0])
			reader.addEventListener('loadend', () => {
				videoExists = {
					src: reader.result as string,
					name: files[0]?.name
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
		inputHTMLFileImage.files = null
		inputHTMLFileImage.value = ''
		inputHTMLFileVideo.files = null
		inputHTMLFileVideo.value = ''
		btnPostDisabled.set(true)
	}

	const handleCleanMedia = (type: 'image' | 'video') => {
		if (type === 'image') {
			imgExists = {
				src: '',
				name: ''
			}
			inputHTMLFileImage.files = null
			inputHTMLFileImage.value = ''
		} else if (type === 'video') {
			videoExists = {
				src: '',
				name: ''
			}
			inputHTMLFileVideo.files = null
			inputHTMLFileVideo.value = ''
		}

		if (postText.length === 0) {
			btnPostDisabled.set(true)
		}
	}

	$: if ($currentUser && browser) {
		preloadData('/space/statistics')
		preloadData('/space/learning')
		preloadData('/space/services')
		preloadData('/space/contacts')

		preloadData(`/space/u/${$currentUser.username}`)
		preloadCode(`/space/u/${$currentUser.username}`)
	}
</script>

<svelte:head>
	<title>Galaxy Space</title>

	<meta name="title" content="Galaxy Space" />
	<meta name="description" content="Welcome to Galaxy Space the programmer universe!" />
	<meta name="keywords" content="programming, social, network, spaces, universal, erickgiber, chat, group, post, posts, posting" />
	<meta name="robots" content="index, follow" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="1 days" />
	<meta name="author" content="Erick Ramirez" />
</svelte:head>

<!-- <svelte:window
	on:scroll={() => onScrollLoadPosts(data.supabase, posts?.length ?? 0, loadNewPosts, $currentUser)}
/> -->

<main class="flex justify-between gap-8">
	<div id="feed_content" class="flex flex-col w-full">
		<!-- ? Form for new post -->
		<form
			use:enhance={handleSubmitPost}
			action="?/new_post"
			method="post"
			class="bg-white dark:bg-dark_white dark:text-dark_text sm:rounded-lg shadow-sm"
		>
			<label for="text">
				<p
					class="px-3 py-1.5 border-b-2 dark:border-b border-bg dark:border-dark_light_gray dark:text-dark_text flex items-center gap-1.5 text-gray-700"
				>
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
				bind:this={inputHTMLFileImage}
			/>

			<input
				on:change={handleLoadVideo}
				type="file"
				name="video_url"
				id="video"
				maxlength="1"
				accept="video/*"
				class="hidden"
				bind:this={inputHTMLFileVideo}
			/>

			<textarea
				class="
			p-2 w-full h-24 sm::h-16 bg-white dark:bg-dark_white border-b-2 dark:border-b dark:border-dark_light_gray
			border-transparent outline-none transition-all duration-300 resize-none
			focus:h-24 border-b-bg focus:ring-0 ring-0 border-l-0 border-r-0 border-t-0"
				name="text"
				id="text"
				placeholder="{username}, What's on your mind?"
				bind:value={postText}
			/>

			<article class="w-full flex items-center justify-between px-4 pb-2">
				<!-- ? Buttons left -->
				<div class="flex justify-end gap-3">
					<label for="image" class="cursor-pointer active:scale-95">
						<Icon class="text-4xl" icon="flat-color-icons:add-image" />
					</label>
					<label for="video" class="cursor-pointer translate-y-0.5 active:scale-95">
						<Icon class="text-3xl" icon="flat-color-icons:video-file" />
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

				<button on:click={() => handleCleanMedia('image')} class="absolute top-2 right-2 p-0.5 rounded-md bg-red-500 shadow-xl">
					<Icon icon="solar:trash-bin-2-bold" width="20" height="20" color="white" />
				</button>
			</div>
		{/if}

		{#if videoExists?.src}
			<div class="relative w-full h-max mt-2 rounded-lg shadow-md">
				<PlayerComponent src={videoExists.src} className="rounded-lg shadow-md" />

				<button on:click={() => handleCleanMedia('video')} class="absolute top-2 right-2 p-0.5 rounded-md bg-red-500 shadow-xl">
					<Icon icon="solar:trash-bin-2-bold" width="20" height="20" color="white" />
				</button>
			</div>
		{/if}

		<!-- ? Posts -->
		<Posts bind:posts supabase={data.supabase} />
	</div>

	<section
		style="background-image: linear-gradient(180deg, #5700e4 0%, #3e00a5 100%); background-size: 100% 80px;"
		class="w-[250px] sticky top-24 hidden md:flex md:flex-col bg-white dark:bg-dark_white dark:text-dark_text rounded-lg shadow-sm h-full bg-no-repeat"
	>
		<div class="w-[250px] h-max flex flex-col items-center px-2 pt-7 pb-3">
			<a href="/space/u/{$currentUser.username}" class="rounded-full transition-all hover:duration-75 hover:scale-95 hover:shadow-xl">
				<img
					class="w-28 h-28 rounded-full object-cover bg-light_gray shadow-md border-2 border-white"
					src={$currentUser.photo_url}
					alt={$currentUser.public_name}
				/>
			</a>

			<article class="leading-5 mt-1 flex flex-col items-center text-center">
				<p class="text-base flex items-center text-center gap-1 text-dark dark:text-dark_text font-semibold">
					{$currentUser.public_name}
					{#if $currentUser.is_star}
						<Icon class="grid place-content-center text-xl" icon="material-symbols:verified-rounded" color="#5d23ce" />
					{/if}
				</p>
				<span class="text-sm text font-semibold text-gray-500 dark:text-dark">@{$currentUser.username}</span>
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

	.bg_gradient {
		background: var(--primary);
		background: -webkit-linear-gradient(180deg, #5700e4 0%, #3e00a5 100%);
		background: linear-gradient(180deg, #5700e4 0%, #3e00a5 100%);
	}
</style>
