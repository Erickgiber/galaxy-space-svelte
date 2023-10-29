<script lang="ts">
	import PhotoLoader from '$lib/components/ui/PhotoLoader.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import type { IProfile } from '$lib/types/profile.types.js'
	import { handleChangePhoto } from '$lib/utils/profile/handleChangePhoto.js'
	import Icon from '@iconify/svelte'
	import { writable } from 'svelte/store'
	import { fade } from 'svelte/transition'

	export let data

	let profile = writable(data.profile as IProfile)
	let isPhotoLoading = writable(false)

	// Dynamic profile
	$: profile.set(data.profile as IProfile)

	console.log($profile)
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
		class="w-full flex items-end justify-center h-full max-h-56 bg-white shadow-sm rounded-xl"
		style={$profile.cover_photo_url
			? `background-image: url(${$profile.cover_photo_url}); background-size: cover;`
			: null}
	>
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
					class="rounded-full w-full h-full object-cover"
					src={$profile.photo_url}
					alt=""
				/>
			{/if}

			<button
				class="
				absolute text-dark bottom-0 right-0 text-2xl rounded-full bg-white shadow-md p-2 transition-all duration-100 border-2 border-white
				{!$isPhotoLoading
					? 'hover:text-white hover:bg-primary hover:p-2.5 hover:duration-200'
					: 'opacity-80'}
				"
				on:click={() =>
					handleChangePhoto($profile, $currentUser, data.supabase, profile, isPhotoLoading)}
				disabled={$isPhotoLoading}
			>
				<Icon icon="tabler:photo-up" />
			</button>
		</div>
	</div>

	<div class="flex flex-col justify-center text-center mt-[73px]">
		<p class="text-2xl font-semibold text-dark leading-tight">{$profile.public_name}</p>
		<b class="text-lg capitalize text-dark opacity-80 leading-snug">@{$profile.username}</b>
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
