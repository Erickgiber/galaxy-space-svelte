<script lang="ts">
	import PhotoLoader from '$lib/components/ui/PhotoLoader.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import type { IProfile } from '$lib/types/profile.types.js'
	import { handleChangePhoto } from '$lib/utils/profile/handleChangePhoto.js'
	import { handleChangePhotoCover } from '$lib/utils/profile/handleChangePhotoCover.js'
	import Icon from '@iconify/svelte'
	import { writable } from 'svelte/store'
	import { fade } from 'svelte/transition'

	export let data
	const optionsRight = ['photos', 'followers']

	let profile = writable(data.profile as IProfile)
	let isPhotoLoading = writable(false)
	let isPhotoCoverLoading = writable(false)
	let isEditableDescription = writable(false)
	let descriptionHTML: HTMLDivElement

	// Dynamic profile
	$: profile.set(data.profile as IProfile)

	const handleButtonsRight = (option: string) => {
		if (optionsRight.includes(option)) {
			console.log(option)
		}
	}

	const handleEditDescription = (cancel?: 'cancel') => {
		if (cancel === 'cancel') {
			descriptionHTML.innerHTML =
				$profile.description || '<p class="text-dark select-none">Not description</p>'
			$isEditableDescription = false
			return
		} else {
			$isEditableDescription = true
		}
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
			class="text-2xl flex items-center justify-center gap-1 font-semibold text-dark leading-tight"
		>
			{$profile.public_name}
			{#if $profile.is_star}
				<Icon
					class="grid place-content-center text-xl"
					icon="material-symbols:verified-rounded"
					color="#5d23ce"
				/>
			{/if}
		</p>
		<b class="text-lg capitalize text-dark opacity-80 leading-snug">@{$profile.username}</b>
	</div>

	<div class="flex flex-wrap justify-between mt-5">
		<!-- ? Content Left -->
		<article class="w-[39%]">
			<form
				action="/changeDescription"
				method="post"
				class="bg-white flex flex-col rounded-md shadow-sm p-2.5"
			>
				<h1 class="font-semibold px-2 border-b border-light_gray">Description</h1>
				<div
					bind:this={descriptionHTML}
					contenteditable={$isEditableDescription}
					class="p-2 mt-2 text-[15px] h-40 bg-bg rounded-md outline-primary"
				>
					{@html $profile.description || '<p class="text-dark select-none">Not description</p>'}
				</div>
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
								type="button"
								class="bg-primary w-max text-white rounded-md px-4 py-1.5 mt-2.5 transition-all duration-100 hover:bg-opacity-80"
							>
								Save
							</button>
						{/if}
					{/if}
				</div>
			</form>
		</article>
		<article class="w-[59%] flex flex-col">
			<!-- ? Buttons right -->
			<article class="">
				<button
					on:click={() => handleButtonsRight('photos')}
					type="button"
					class="border-b-2 border-transparent hover:border-dark transition-all"
				>
					<span class="text-dark">Photos</span>
				</button>
			</article>
		</article>
	</div>
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
