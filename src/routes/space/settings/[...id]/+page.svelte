<script lang="ts">
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
	import PhotoLoader from '$lib/components/ui/PhotoLoader.svelte'
	import { currentUser } from '$lib/store/currentUser.js'
	import { handleInputUsername } from '$lib/utils/handleInputUsername.js'
	import { loadTheme } from '$lib/utils/loadTheme.js'
	import { handleChangePhoto } from '$lib/utils/profile/handleChangePhoto.js'
	import { handleChangePhotoCover } from '$lib/utils/profile/handleChangePhotoCover.js'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { toast } from '@zerodevx/svelte-toast'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	export let data
	let mode: string = 'default'
	let iconMode = ''
	let public_name = $currentUser.public_name
	let username = $currentUser.username
	let isPhotoLoading = writable(false)

	async function handleChangeInfo(e: Event): Promise<void> {
		e.preventDefault()

		if (public_name !== $currentUser.public_name && public_name.length > 0) {
			const supabase = data.supabase
			const request = await supabase
				.from('register')
				.update({
					public_name: public_name
				})
				.eq('uuid', $currentUser.uuid)

			if (request.error) {
				toast.pop()
				toast.push('Error! Try again')
			} else {
				currentUser.set({ ...$currentUser, public_name })
				toast.pop()
				toast.push('Public name changed')
			}
		}
	}

	const toggleDarkMode = () => {
		const storage = localStorage.getItem('theme')
		mode = storage === 'dark' ? 'Light' : 'Dark'
		iconMode = storage === 'dark' ? 'fluent-emoji-flat:crescent-moon' : 'noto:sun'

		if (storage === 'dark') {
			localStorage.removeItem('theme')
		} else {
			localStorage.setItem('theme', 'dark')
		}

		loadTheme()
	}

	const resetField = (type: string) => {
		if (type === 'username' && username.length === 0) {
			username = $currentUser.username
		}

		if (type === 'public_name' && public_name.length === 0) {
			public_name = $currentUser.public_name
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			const storage = localStorage.getItem('theme')
			mode = storage === 'dark' ? 'Dark' : 'Light'
			iconMode = storage === 'dark' ? 'noto:sun' : 'fluent-emoji-flat:crescent-moon'
		}
	})
</script>

<BreadCrumb
	data={{
		module: { title: 'Settings', href: '/space/settings', icon: 'solar:settings-linear' },
		current: { title: data.title ?? '', icon: data.icon }
	}}
/>

<section class="sm:p-0 p-2">
	{#if data.id === 'app'}
		<ul class="flex flex-col gap-2 mt-2">
			<li class="flex flex-col gap-1">
				<p class="dark:text-white">Current: <b>{mode} Mode</b> on</p>

				<button
					on:click={toggleDarkMode}
					type="button"
					class="bg-white font-semibold active:text-white dark:text-white gap-2 dark:active:bg-primary dark:bg-dark_white flex items-center bg-text-white px-3 py-3 rounded-xl active:duration-0 active:bg-primary focus:outline-none shadow-md transition duration-50"
				>
					<Icon icon={iconMode} width="24" />
					{mode === 'Light' ? 'Dark' : 'Light'} Mode
				</button>
			</li>
		</ul>
	{/if}

	{#if data.id === 'profile'}
		<form on:submit={handleChangeInfo} class="flex flex-col items-center mt-3">
			<img class="h-40 w-40 object-cover rounded-full shadow-xl" src={$currentUser.photo_url} alt={$currentUser.username} />

			{#if !$isPhotoLoading}
				<button
					on:click={() => handleChangePhoto($currentUser, $currentUser, data.supabase, currentUser, isPhotoLoading)}
					class="border active:bg-primary dark:active:bg-primary active:scale-95 transition-all active:duration-0 border-light_gray dark:border-dark_light_gray dark:text-white py-1.5 px-3 rounded-lg mt-3"
					>Upload Photo</button
				>
			{:else}
				<div class="w-max mt-5">
					<PhotoLoader style="font-size: 25px;" />
				</div>
			{/if}

			<label class="w-full max-w-xs px-2 flex flex-col gap-0.5 mt-3" for="public_name">
				<span class="dark:text-white flex items-center gap-1">
					<Icon icon="icon-park-outline:edit-name" />
					<p class="font-semibold">Public name</p>
				</span>
				<input
					class="w-full shadow-sm transition-all dark:bg-dark_white rounded-md px-2 py-1 bg-white dark:text-white text-black outline-none border border-transparent focus:border-primary"
					type="text"
					name="public_name"
					id="public_name"
					placeholder={$currentUser.public_name}
					bind:value={public_name}
					on:blur={() => resetField('public_name')}
				/>
			</label>

			<label class="w-full max-w-xs px-2 flex flex-col gap-0.5 mt-3" for="username">
				<span class="dark:text-white flex items-center gap-1">
					<Icon icon="lucide:at-sign" />
					<p class="font-semibold">Username (Not editable)</p>
				</span>
				<input
					class="w-full select-none pointer-events-none disabled:opacity-50 shadow-sm transition-all dark:bg-dark_white rounded-md px-2 py-1 bg-white dark:text-white text-black outline-none border border-transparent focus:border-primary"
					type="text"
					name="username"
					id="username"
					placeholder={$currentUser.username}
					bind:value={username}
					disabled
				/>
			</label>

			<div class="flex items-center w-full max-w-xs gap-3 p-3">
				<button
					disabled={public_name === $currentUser.public_name || public_name.length === 0}
					class="w-20 h-7 bg-primary rounded disabled:opacity-50 text-white font-semibold"
					type="submit">Save</button
				>
				<button
					class="w-20 h-7 bg-red-500 rounded text-white font-semibold"
					type="button"
					on:click={() => {
						public_name = ''
					}}>Clean</button
				>
			</div>
		</form>
	{/if}

	{#if data.id === 'privacy'}
		<h1 class="font-semibold mt-2 text-xl dark:text-white">Building...</h1>
	{/if}

	{#if data.id === 'account'}
		<h1 class="font-semibold mt-2 text-xl dark:text-white">Building...</h1>
	{/if}
</section>
