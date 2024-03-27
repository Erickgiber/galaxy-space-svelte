<script>
	import { enhance } from '$app/forms'
	import LOGO from '$lib/assets/logos/logo.png'
	import ButtonLoader from '$lib/components/ui/ButtonLoader.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { loadTheme } from '$lib/utils/loadTheme'
	import { resolver } from '$lib/utils/resolver'
	import Icon from '@iconify/svelte'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	// Disable for btn
	const btnDisabled = writable(false)
	let newPassword = ''
	let repeatPassword = ''
	let isValidFields = false

	$: isValidFields = newPassword.length > 3 && newPassword === repeatPassword

	const handleSubmit = () => {
		return resolver(btnDisabled, {})
	}

	const removeDarkMode = () => {
		const storage = localStorage.getItem('theme')
		if (storage === 'dark') {
			localStorage.removeItem('theme')
		}

		loadTheme()
	}

	onMount(() => {
		if ($currentUser) {
			// @ts-ignore
			currentUser.set(undefined)
		}

		removeDarkMode()
	})
</script>

<svelte:head>
	<title>Sign in | Galaxy Space</title>
</svelte:head>

<div class="w-full h-screen sm:w-[500px] py-10 sm:py-7 px-5 sm:px-10 sm:h-max sm:rounded-xl shadow-2xl max-w-3xl bg-white">
	<article class="flex items-center gap-2">
		<img class="w-14 h-14" src={LOGO} alt="Logo" />
		<div>
			<p class="text-xl">Galaxy Space</p>
			<p>Password recovery</p>
		</div>
	</article>

	<p class="text-dark text-lg mt-5">Recovery your password! 🔑</p>

	<form use:enhance={handleSubmit} method="POST" class="flex mt-5 flex-col gap-4">
		<!-- ? Password -->
		<label for="password" class="flex flex-col">
			<span>New Password</span>
			<div class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary">
				<Icon icon="carbon:password" />
				<input
					autocomplete="off"
					class="w-full border-none focus:ring-0 px-2 py-2 bg-transparent outline-none"
					id="password"
					name="password"
					type="password"
					placeholder="********"
					bind:value={newPassword}
				/>
			</div>
		</label>

		<!-- ? Password -->
		<label for="confirm_password" class="flex flex-col">
			<span>Repeat Password</span>
			<div class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary">
				<Icon icon="carbon:password" />
				<input
					autocomplete="off"
					class="w-full border-none focus:ring-0 px-2 py-2 bg-transparent outline-none"
					id="confirm_password"
					name="confirm_password"
					type="confirm_password"
					placeholder="********"
					bind:value={repeatPassword}
				/>
			</div>
		</label>

		{#if !$btnDisabled}
			<button
				disabled={$btnDisabled || !isValidFields}
				type="submit"
				class="rounded-md w-36 mx-auto px-3.5 py-2 m-1 overflow-hidden relative group
            cursor-pointer border-2 font-medium border-indigo-600 text-white disabled:opacity-50 disabled:pointer-events-none select-none"
			>
				<span
					class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"
				/>
				<span class="relative text-indigo-600 transition duration-300 group-hover:text-white ease">Sign in</span>
			</button>
		{:else}
			<ButtonLoader />
		{/if}
	</form>

	<div class="h-0.5 my-5 w-full bg-light_gray" />

	<article class="flex flex-col items-center">
		<p>Do you remember your password?</p>

		<a
			href="/login"
			class="rounded-md mx-auto px-3.5 py-2 m-1 overflow-hidden relative group
            cursor-pointer border-2 font-medium border-indigo-600 text-white"
		>
			<span
				class="absolute w-64 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 h-64 -translate-y-32 ease"
			/>
			<span class="relative transition duration-300 text-white ease">Login</span>
		</a>
	</article>
</div>
