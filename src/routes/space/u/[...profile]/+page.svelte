<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import ButtonFollowingLoader from '$lib/components/ui/ButtonFollowingLoader.svelte'
	import ModalFollower from '$lib/components/ui/ModalFollower.svelte'
	import ModalFollowing from '$lib/components/ui/ModalFollowing.svelte'
	import PhotoLoader from '$lib/components/ui/PhotoLoader.svelte'
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
	import dayjs from 'dayjs'
	import { onDestroy, onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { fade } from 'svelte/transition'

	export let data
	let currentSection = ''
	$: currentSection = $page.url.searchParams.get('section') ?? 'images'
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
		isFollowed = request

		if (isFollowed) {
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
		btnFollowLoading = false
	}

	const handleUnFollow = async () => {
		btnFollowLoading = true
		const request = await repository.follow.remove($currentUser, $profile, data.supabase)
		isFollowed = request
		const updateFollowers = data.followers?.filter(
			(follower: IFollower) => follower.uuid !== $currentUser.uuid
		)
		data.followers = updateFollowers
		btnFollowLoading = false
	}

	const HandleShowFollowers = async () => {
		isModalFollowers = true
		followers = []
		for (const follower of data.followers as IProfile[]) {
			const getFollowers = await handleGetFollowers(data.supabase, follower.uuid)
			if (getFollowers && getFollowers.uuid === follower.uuid) {
				follower.photo_url = getFollowers.photo_url
				follower.public_name = getFollowers.public_name
				follower.username = getFollowers.username
				follower.is_star = getFollowers.is_star

				followers = [...followers, follower]
			}
		}
	}

	const HandleShowFollowings = async () => {
		isModalFollowing = true
		followings = []
		for (const following of data.followings as IProfile[]) {
			const getFollowings = await handleGetFollowings(data.supabase, following.uuid)
			if (getFollowings && getFollowings.uuid === following.uuid) {
				following.photo_url = getFollowings.photo_url
				following.public_name = getFollowings.public_name
				following.username = getFollowings.username
				following.is_star = getFollowings.is_star

				followings = [...followings, following]
			}
		}
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
</script>

<svelte:head>
	{#if $profile}
		<title>{$profile.public_name} | Galaxy Space</title>
	{:else}
		<title>{data.msg} | Galaxy Space</title>
	{/if}
</svelte:head>

{#if $profile}
	<div
		id="cover_photo"
		class="w-full relative flex items-end justify-center h-full max-h-56 bg-white shadow-sm rounded-xl"
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
			absolute text-dark bottom-3 right-3 text-2xl rounded-full bg-white shadow-md p-2 transition-all duration-100 border-2 border-white
			{!$isPhotoLoading
						? 'hover:text-white hover:bg-primary hover:p-2.5 hover:duration-200'
						: 'opacity-0'}
			"
					on:click={() =>
						handleChangePhotoCover(
							$profile,
							$currentUser,
							data.supabase,
							profile,
							isPhotoCoverLoading
						)}
					disabled={$isPhotoLoading}
				>
					<Icon icon="line-md:image" />
				</button>
			{/if}
		{/if}

		<!-- ? Photo container -->
		<div
			class="w-36 h-36 select-none relative top-16 rounded-full bg-light_gray border-4 border-white shadow-sm"
		>
			{#if $isPhotoLoading}
				<div in:fade class="w-full h-full">
					<PhotoLoader />
				</div>
			{:else}
				<img
					in:fade
					class="rounded-full bg-white w-full h-full object-cover"
					src={$profile.photo_url}
					alt=""
				/>
			{/if}

			{#if data.isUserAuth}
				<button
					class="
				absolute text-dark bottom-0 right-0 text-2xl rounded-full bg-white shadow-md p-2 transition-all duration-100 border-2 border-white
				{!$isPhotoLoading
						? 'hover:text-white hover:bg-primary hover:p-2.5 hover:duration-200'
						: 'opacity-0'}
				"
					on:click={() =>
						handleChangePhoto($profile, $currentUser, data.supabase, profile, isPhotoLoading)}
					disabled={$isPhotoLoading}
				>
					<Icon icon="tabler:photo-up" />
				</button>
			{/if}
		</div>
	</div>

	<div class="flex flex-col justify-center text-center mt-[73px]">
		<p
			class="text-2xl left-1 relative inline-flex w-max mx-auto items-center justify-center gap-1 font-semibold text-dark leading-tight"
		>
			{$profile.public_name}
			<VerifiedIcon isStar={$profile.is_star} />
		</p>
		<b class="text-lg capitalize text-dark opacity-80 leading-snug">@{$profile.username}</b>

		{#if !data.isUserAuth}
			<article class="mt-1.5 w-max flex mx-auto items-center gap-2">
				{#if !isFollowed && !btnFollowLoading}
					<button
						on:click={handleFollow}
						class="text-base h-9 bg-primary border flex items-center gap-1 text-white px-3 py-1 rounded-lg shadow-md
				hover:bg-opacity-80 transition-all duration-100
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
				hover:bg-opacity-80 transition-all duration-100
				"
					type="button"
				>
					<Icon icon="simple-line-icons:options" />
				</button>
			</article>
		{/if}
	</div>

	<div class="flex flex-col gap-2 sm:flex-row sm:gap-0 justify-between mt-5">
		<!-- ? Content Left -->
		<article class="w-full">
			<!-- ? Followers -->
			<div class="flex gap-3 mb-2 overflow-x-auto pb-1">
				<!-- ? Buttons right -->
				<button
					on:click={HandleShowFollowers}
					class="bg-white h-max w-max flex flex-col rounded-md shadow-sm p-2.5 outline-primary"
				>
					<!-- Followers -->
					<h1 class="font-semibold text-lg px-2">Followers</h1>
					<p class="px-2 w-max flex items-center gap-1 text-lg">
						<Icon icon="solar:users-group-rounded-bold-duotone" class="text-xl text-primary" />
						{data?.followers?.length}
					</p>
				</button>

				<!-- ? Buttons right -->
				<button
					on:click={HandleShowFollowings}
					class="bg-white h-max w-max flex flex-col rounded-md shadow-sm p-2.5 outline-primary"
				>
					<!-- Following -->
					<h1 class="font-semibold text-lg px-2">Following</h1>
					<p class="px-2 w-max flex items-center gap-1 text-lg">
						<Icon icon="solar:users-group-rounded-bold" class="text-xl text-dark" />
						{data?.followings?.length}
					</p>
				</button>

				<a
					href="/space/u/{$profile.username}?section=images"
					class="bg-white h-max w-max flex flex-col rounded-md shadow-sm p-2.5 outline-primary"
					style={currentSection === 'images'
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<!-- Images -->
					<h1 class="font-semibold text-lg px-2">Images</h1>
					<p class="px-2 w-max flex items-center gap-1 text-lg">
						<Icon
							icon="ph:image-duotone"
							class="text-xl {currentSection === 'images' ? 'text-white' : 'text-primary'}"
						/>
						{data?.images?.length}
					</p>
				</a>

				<!-- ? Buttons right -->
				<a
					href="/space/u/{$profile.username}?section=videos"
					class="bg-white h-max w-max flex flex-col rounded-md shadow-sm p-2.5 outline-primary"
					style={currentSection === 'videos'
						? 'background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);'
						: null}
				>
					<!-- Images -->
					<h1 class="font-semibold text-lg px-2">Videos</h1>
					<p class="px-2 w-max flex items-center gap-1 text-lg">
						<Icon
							icon="bxs:videos"
							class="text-xl {currentSection === 'videos' ? 'text-white' : 'text-primary'}"
						/>
						{0}
					</p>
				</a>
			</div>

			<form
				use:enhance={handleSubmitChangeDescription}
				action="?/changeDescription"
				method="post"
				class="bg-white flex flex-col rounded-md shadow-sm p-2.5"
			>
				<h1 class="font-semibold px-2 border-b border-light_gray">Description</h1>

				{#if $isEditableDescription}
					<textarea
						bind:this={descriptionHTML}
						name="description"
						class="px-2 py-1 mt-1 resize-none bg-bg text-dark h-40 rounded-md outline-primary"
						>{$profile.description.replaceAll('<br>', '\n') || 'Not description'}</textarea
					>
				{:else}
					<div
						class="px-2 py-1 mt-1 text-dark h-40 overflow-y-auto overflow-x-hidden rounded-md outline-primary"
					>
						{@html $profile.description || '<p class="text-dark select-none">Not description</p>'}
					</div>
				{/if}
				<div class="flex items-center justify-between gap-2">
					{#if data.isUserAuth}
						<button
							on:click={!$isEditableDescription
								? () => handleEditDescription()
								: () => handleEditDescription('cancel')}
							type="button"
							class="{$isEditableDescription
								? 'bg-red-600'
								: 'bg-primary'} w-max text-white rounded-md px-4 py-1.5 mt-2.5 transition-all duration-100 hover:bg-opacity-80"
						>
							{!$isEditableDescription ? 'Edit' : 'Cancel'}
						</button>

						{#if $isEditableDescription}
							<button
								type="submit"
								class="bg-primary w-max text-white rounded-md px-4 py-1.5 mt-2.5 transition-all duration-100 hover:bg-opacity-80"
							>
								Save
							</button>
						{/if}
					{/if}
				</div>
			</form>
		</article>
	</div>

	<ImagesGallery {supabase} imageList={data.images} bind:currentSection />

	{#if currentSection === 'videos'}
		<div class="w-full h-max mb-5 rounded-xl mt-3">
			<h1>No videos found</h1>
		</div>
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
