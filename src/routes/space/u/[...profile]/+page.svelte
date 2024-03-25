<script lang="ts">
	import { browser } from '$app/environment'
	import { enhance } from '$app/forms'
	import { preloadCode, preloadData } from '$app/navigation'
	import { page } from '$app/stores'
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import ButtonFollowingLoader from '$lib/components/ui/ButtonFollowingLoader.svelte'
	import ModalFollower from '$lib/components/ui/ModalFollower.svelte'
	import ModalFollowing from '$lib/components/ui/ModalFollowing.svelte'
	import PhotoLoader from '$lib/components/ui/PhotoLoader.svelte'
	import Posts from '$lib/components/ui/Posts.svelte'
	import ImagesGallery from '$lib/components/ui/Profile/ImagesGallery.svelte'
	import VerifiedIcon from '$lib/components/ui/VerifiedIcon.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { ProfileRepository } from '$lib/supabase/profile/ProfileRepository.js'
	import type { IFollower } from '$lib/types/follower.types.js'
	import type { IProfile } from '$lib/types/profile.types.js'
	import { handleChangePhoto } from '$lib/utils/profile/handleChangePhoto.js'
	import { handleChangePhotoCover } from '$lib/utils/profile/handleChangePhotoCover.js'
	import { handleGetFollowers } from '$lib/utils/profile/handleGetFollowers.js'
	import { handleGetFollowings } from '$lib/utils/profile/handleGetFollowings.js'
	import { resolver } from '$lib/utils/resolver.js'
	import Icon from '@iconify/svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import dayjs from 'dayjs'
	import { onDestroy, onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { fade } from 'svelte/transition'

	export let data
	let currentSection = ''
	$: currentSection = $page.url.searchParams.get('section') ?? ''
	let profile = writable(data.profile as IProfile)
	let isPhotoLoading = writable(false)
	let isPhotoCoverLoading = writable(false)
	let isEditableDescription = writable(false)
	let descriptionHTML: HTMLTextAreaElement
	let btnFollowLoading = false
	let isFollowed = data.isFollowing as boolean
	let isModalFollowers = false
	let isModalFollowing = false
	let followers = [] as IProfile[]
	let followings = [] as IProfile[]
	$: isFollowed = data.isFollowing as boolean

	const repository = new ProfileRepository()
	const supabase = data.supabase

	// Dynamic profile
	$: profile.set(data.profile as IProfile)

	const handleEditDescription = (cancel?: 'cancel') => {
		if (cancel === 'cancel') {
			descriptionHTML.innerHTML = $profile.description || 'Not description'
			$isEditableDescription = false
			return
		} else {
			$isEditableDescription = true
		}
	}

	const handleSubmitChangeDescription = () => {
		return resolver(isEditableDescription, {
			onSuccess: async () => {
				$profile = { ...$profile, description: descriptionHTML.value }
			}
		})
	}

	const handleFollow = async () => {
		btnFollowLoading = true
		const request = await repository.follow.add($currentUser, $profile, data.supabase)

		if (request) {
			const updateFollowers = [
				...(data.followers as IFollower[]),
				{
					created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss'),
					username: $currentUser.username,
					uuid: $currentUser.uuid
				} as IFollower
			]
			data.followers = updateFollowers
		}

		isFollowed = request
		data.isFollowing = isFollowed
		btnFollowLoading = false
	}

	const handleUnFollow = async () => {
		btnFollowLoading = true
		const request = await repository.follow.remove($currentUser, $profile, data.supabase)
		isFollowed = request
		const updateFollowers = data.followers?.filter((follower: IFollower) => follower.uuid !== $currentUser.uuid)
		data.followers = updateFollowers
		data.isFollowing = request
		btnFollowLoading = false
	}

	const HandleShowFollowers = async () => {
		isModalFollowers = true
		followers = []
		let followersGetted: IProfile[] = []

		for (const follower of data.followers as IProfile[]) {
			const getFollowers = await handleGetFollowers(data.supabase, follower.uuid)
			if (getFollowers && getFollowers.uuid === follower.uuid) {
				follower.photo_url = getFollowers.photo_url
				follower.public_name = getFollowers.public_name
				follower.username = getFollowers.username
				follower.is_star = getFollowers.is_star

				followersGetted.push(follower)
			} else if (!getFollowers) {
				isModalFollowers = false
				followersGetted = []
				toast.pop()
				toast.push('A error ocurred finding followers! try again')
				followers = data.followers as IProfile[]
				return
			}
		}

		followers = followersGetted
	}

	const HandleShowFollowings = async () => {
		isModalFollowing = true
		followings = []
		let followingsGetted: IProfile[] = []

		for (const following of data.followings as IProfile[]) {
			const getFollowings = await handleGetFollowings(data.supabase, following.uuid)
			if (getFollowings && getFollowings.uuid === following.uuid) {
				following.photo_url = getFollowings.photo_url
				following.public_name = getFollowings.public_name
				following.username = getFollowings.username
				following.is_star = getFollowings.is_star

				followingsGetted.push(following)
			} else if (!getFollowings) {
				followingsGetted = []
				toast.pop()
				toast.push('A error ocurred finding followings! try again')
				followings = data.followings as IProfile[]
				return
			}
		}

		followings = followingsGetted
	}

	const handleCloseModalFollowers = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isModalFollowers) {
			isModalFollowers = false
		}

		if (event.key === 'Escape' && isModalFollowing) {
			isModalFollowing = false
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keyup', handleCloseModalFollowers)
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keyup', handleCloseModalFollowers)
		}
	})

	$: if ($profile.description) {
		let regex = /\n/g
		let textoConSaltosDeLinea = $profile.description.replace(regex, '<br>')

		$profile.description = textoConSaltosDeLinea
	}

	$: if ($currentUser && browser) {
		preloadData('/space/statistics')
		preloadData('/space/learning')
		preloadData('/space/services')
		preloadData('/space/contacts')
		preloadData('/space')
		preloadCode('/space')
	}
</script>

<svelte:head>
	{#if $profile}
		<title>{$profile.public_name} | Galaxy Space</title>

		<meta name="keywords" content={$profile.public_name?.replaceAll(' ', ',')} />
		<meta name="title" content={$profile.public_name} />
		<meta name="description" content={$profile.description} />
	{:else}
		<title>{data.msg} | Galaxy Space</title>
	{/if}
</svelte:head>

{#if $profile}
	<div
		id="cover_photo"
		class="w-full relative flex items-end justify-center h-full max-h-56 bg-white shadow-sm sm:rounded-xl"
		style={$profile.cover_photo_url
			? `background-image: url(${$profile.cover_photo_url}); background-size: cover; background-position: center;`
			: null}
	>
		<!-- ? button change cover photo -->
		{#if data.isUserAuth}
			{#if $isPhotoCoverLoading}
				<div in:fade class="w-10 h-10 absolute bottom-3 right-3">
					<PhotoLoader style="font-size: 15px;" />
				</div>
			{:else}
				<button
					class="
			absolute text-dark bottom-3 right-3 text-2xl rounded-full bg-white dark:bg-dark_bg shadow-md p-2 transition-all duration-100 border-2 border-white dark:border-dark_light_gray dark:shadow-2xl
			{!$isPhotoLoading ? 'hover:text-white  hover:bg-primary hover:p-2.5 hover:duration-200' : 'opacity-0'}
			"
					on:click={() => handleChangePhotoCover($profile, $currentUser, data.supabase, profile, isPhotoCoverLoading)}
					disabled={$isPhotoLoading}
				>
					<Icon icon="line-md:image" />
				</button>
			{/if}
		{/if}

		<!-- ? Photo container -->
		<div
			class="w-36 h-36 select-none relative top-16 rounded-full bg-light_gray dark:bg-dark_bg dark:border-dark_light_gray dark:shadow-2xl shadow-md border-4 border-white"
		>
			{#if $isPhotoLoading}
				<div in:fade class="w-full h-full">
					<PhotoLoader />
				</div>
			{:else}
				<img in:fade class="rounded-full bg-white dark:bg-dark_bg w-full h-full object-cover" src={$profile.photo_url} alt={$profile.username} />
			{/if}

			{#if data.isUserAuth}
				<button
					class="
				absolute text-dark bottom-0 right-0 text-2xl rounded-full bg-white dark:bg-dark_bg dark:border-dark_light_gray dark:shadow-2xl shadow-md p-2 transition-all duration-100 border-2 border-white
				{!$isPhotoLoading ? 'hover:text-white hover:bg-primary hover:p-2.5 hover:duration-200' : 'opacity-0'}
				"
					on:click={() => handleChangePhoto($profile, $currentUser, data.supabase, profile, isPhotoLoading)}
					disabled={$isPhotoLoading}
				>
					<Icon icon="tabler:photo-up" />
				</button>
			{/if}
		</div>
	</div>

	<div class="flex flex-col justify-center text-center mt-[73px]">
		<article
			class="text-xl max-w-[165px] sm:max-w-max break-words sm:text-2xl left-1 relative inline-flex w-max mx-auto items-center justify-center gap-1 font-semibold text-dark dark:text-dark_text leading-tight"
		>
			{$profile.public_name}
			<VerifiedIcon isStar={$profile.is_star} />
		</article>

		<b class="text-base sm:text-lg capitalize text-dark opacity-80 leading-snug">@{$profile.username}</b>

		{#if !data.isUserAuth}
			<article class="mt-1.5 w-max flex mx-auto items-center gap-2">
				{#if !isFollowed && !btnFollowLoading}
					<button
						on:click={handleFollow}
						class="text-base h-9 bg-primary border flex items-center gap-1 text-white px-3 py-1 rounded-lg shadow-md
				hover:bg-opacity-80 transition-all duration-100 dark:border-dark_white
				"
						type="button"
					>
						Follow
						<Icon icon="mingcute:user-add-2-line" />
					</button>
				{:else if isFollowed && !btnFollowLoading}
					<button
						on:click={handleUnFollow}
						class="text-base h-9 bg-black text-white flex font-semibold items-center gap-1 px-3 py-1 rounded-lg
				hover:bg-red-500 hover:text-white transition-all duration-100
				"
						type="button"
					>
						Following
					</button>
				{:else if btnFollowLoading}
					<div class="h-9">
						<ButtonFollowingLoader width="75px" height="100%" />
					</div>
				{/if}

				<button
					class="flex h-9 items-center gap-1 text-base bg-dark border text-white px-3 py-1 rounded-lg shadow-md
				hover:bg-opacity-80 transition-all duration-100 dark:border-dark_white
				"
					type="button"
				>
					<Icon icon="simple-line-icons:options" />
				</button>
			</article>
		{/if}
	</div>

	<div class="flex flex-col gap-2 sm:flex-row sm:gap-0 justify-between mt-1">
		<article class="w-full">
			<div class="flex items-center justify-center gap-2 mb-2">
				<button
					on:click={data?.followers?.length !== 0 ? HandleShowFollowers : null}
					class="active:scale-95 active:transition-none transition-all w-16 hover:bg-white hover:dark:bg-dark_white dark:text-white h-max flex flex-col rounded-md p-2.5 outline-primary"
				>
					<!-- Followers -->
					<p class="w-max flex items-center gap-1 text-lg">
						<Icon icon="solar:users-group-rounded-bold-duotone" class="text-xl text-primary" />
						{data?.followers?.length}
					</p>
				</button>

				<button
					on:click={data?.followings?.length !== 0 ? HandleShowFollowings : null}
					class="active:scale-95 active:transition-none transition-all w-16 hover:bg-white hover:dark:bg-dark_white dark:text-white h-max flex flex-col rounded-md p-2.5 outline-primary"
				>
					<!-- Following -->
					<p class="w-max flex items-center gap-1 text-lg">
						<Icon icon="solar:users-group-rounded-bold" class="text-xl text-dark" />
						{data?.followings?.length}
					</p>
				</button>
			</div>

			<div class="flex px-2 sm:px-0 md:flex-nowrap gap-3 mb-1 overflow-x-auto pb-1.5">
				<a
					href="/space/u/{$profile.username}"
					class="bg-white dark:bg-dark_white dark:text-white w-14 h-11 grid place-content-center rounded-md shadow-sm p-1.5 outline-primary"
					style={currentSection === ''
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<p class="flex items-center gap-1 text-xl">
						<Icon icon="material-symbols:feed-outline" class={currentSection === '' ? 'text-white' : 'text-primary'} />
					</p>
				</a>

				<a
					href="/space/u/{$profile.username}?section=words"
					class="bg-white dark:bg-dark_white dark:text-white w-14 h-11 grid place-content-center rounded-md shadow-sm p-1.5 outline-primary"
					style={currentSection === 'words'
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<p class="flex items-center gap-1 text-xl">
						<Icon icon="simple-line-icons:speech" class={currentSection === 'words' ? 'text-white' : 'text-primary'} />
					</p>
				</a>

				<a
					href="/space/u/{$profile.username}?section=images"
					class="bg-white dark:bg-dark_white dark:text-white w-14 h-11 grid place-content-center rounded-md shadow-sm p-1.5 outline-primary"
					style={currentSection === 'images'
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<p class="flex items-center gap-1 text-xl">
						<Icon icon="ph:image-duotone" class={currentSection === 'images' ? 'text-white' : 'text-primary'} />
					</p>
				</a>

				<a
					href="/space/u/{$profile.username}?section=videos"
					class="bg-white dark:bg-dark_white dark:text-white w-14 h-11 grid place-content-center rounded-md shadow-sm p-1.5 outline-primary"
					style={currentSection === 'videos'
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<p class="flex items-center gap-1 text-xl">
						<Icon icon="bxs:videos" class={currentSection === 'videos' ? 'text-white' : 'text-primary'} />
					</p>
				</a>
			</div>

			<form
				use:enhance={handleSubmitChangeDescription}
				action="?/changeDescription"
				method="post"
				class="bg-white mt-1 sm:mt-0 dark:bg-dark_white dark:text-white flex flex-col sm:rounded-md shadow-sm p-2.5 sm:h-auto"
			>
				<h1 class="font-semibold px-1 border-b dark:border-dark_light_gray border-light_gray">Description</h1>

				{#if $isEditableDescription}
					<textarea
						bind:this={descriptionHTML}
						name="description"
						class="px-2 py-1 mt-1 resize-none bg-bg text-dark dark:bg-dark_light_gray dark:text-white h-40 rounded-md outline-primary"
						>{$profile.description.replaceAll('<br>', '\n') || 'Not description'}</textarea
					>
				{:else}
					<div
						class="px-1 py-1 mt-1 text-dark dark:text-dark_text h-40 sm:h-auto text-sm sm:text-base overflow-y-auto overflow-x-hidden rounded-md outline-primary"
					>
						{@html $profile.description || '<p class="text-dark dark:text-white select-none">Not description</p>'}
					</div>
				{/if}
				<div class="flex items-center justify-between gap-2">
					{#if data.isUserAuth}
						<button
							on:click={!$isEditableDescription ? () => handleEditDescription() : () => handleEditDescription('cancel')}
							type="button"
							class="{$isEditableDescription
								? 'bg-red-600'
								: 'bg-primary'} w-max text-white rounded-md px-3 text-sm sm:text-base py-1 mt-2.5 transition-all duration-100 hover:bg-opacity-80"
						>
							{!$isEditableDescription ? 'Edit' : 'Cancel'}
						</button>

						{#if $isEditableDescription}
							<button type="submit" class="bg-primary w-max text-white rounded-md px-4 py-1.5 mt-2.5 transition-all duration-100 hover:bg-opacity-80">
								Save
							</button>
						{/if}
					{/if}
				</div>
			</form>
		</article>
	</div>

	<ImagesGallery {supabase} imageList={data.images} bind:currentSection />

	{#if data.posts && currentSection === ''}
		<Posts posts={data.posts} {supabase} />
		<br />
	{/if}

	{#if data.wordsPosts && currentSection === 'words'}
		<Posts posts={data.wordsPosts.filter((post) => !post.video_url)} {supabase} />
		<br />
	{/if}

	{#if data.posts && currentSection === 'videos'}
		<Posts posts={data.posts.filter((post) => post.video_url)} {supabase} />
		<br />
	{/if}

	<!-- ! Followers Modal -->
	<ModalFollower bind:followers bind:isModalFollowers />

	<ModalFollowing bind:followings bind:isModalFollowing />
{:else}
	<h1>{data.msg}</h1>
{/if}

<style lang="scss">
	#cover_photo {
		background: var(--primary);
		background: -webkit-linear-gradient(to right, #1cb5e0, var(--primary));
		background: linear-gradient(to right, #1cb5e0, var(--primary));
	}
</style>
