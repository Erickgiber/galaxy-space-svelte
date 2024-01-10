<script lang="ts">
	import { enhance } from '$app/forms'
	import LOGO from '$lib/assets/logos/logo.png'
	import ButtonLoader from '$lib/components/ui/ButtonLoader.svelte'
	import { currentUser } from '$lib/store/currentUser'
	import { resolver } from '$lib/utils/resolver'
	import Icon from '@iconify/svelte'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	// Disable for btn
	const btnDisabled = writable(false)

	const handleInputUsername = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement
		const { value } = input
		input.value = value.replace(/[^A-Za-z0-9\-]/g, '')
	}

	const handleSubmit = () => {
		return resolver(btnDisabled, {})
	}

	onMount(() => {
		if ($currentUser) {
			// @ts-ignore
			currentUser.set(undefined)
		}
	})
</script>

<svelte:head>
	<title>Sign up | Galaxy Space</title>
</svelte:head>

<div
	class="w-full h-screen sm:w-[500px] py-10 sm:py-7 px-5 sm:px-10 sm:h-max sm:rounded-xl shadow-2xl max-w-3xl bg-white"
>
	<article class="flex items-center gap-2">
		<img class="w-14 h-14" src={LOGO} alt="Logo" />
		<div>
			<p class="text-xl">Galaxy Space</p>
			<p>Sign up</p>
		</div>
	</article>

	<p class="text-dark text-lg mt-5">🚀 Be a member of the space</p>

	<form use:enhance={handleSubmit} method="POST" class="flex mt-5 flex-col gap-4">
		<!-- ? Name -->
		<label for="name" class="flex flex-col">
			<span>Public name</span>
			<div
				class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary"
			>
				<Icon icon="icon-park-outline:edit-name" />
				<input
					class="w-60 px-2 py-2 bg-transparent outline-none"
					id="name"
					type="text"
					name="public_name"
					placeholder="What do you want to be called?"
				/>
			</div>
		</label>

		<!-- ? Username -->
		<label for="username" class="flex flex-col">
			<span>Username</span>
			<div
				class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary"
			>
				<Icon icon="lucide:at-sign" />
				<input
					class="w-60 px-2 py-2 bg-transparent outline-none"
					name="username"
					id="username"
					type="text"
					placeholder="It should be unique and fun."
					on:input={handleInputUsername}
				/>
			</div>
		</label>

		<!-- ? Email -->
		<label for="email" class="flex flex-col">
			<span>Email</span>
			<div
				class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary"
			>
				<Icon icon="clarity:email-line" />
				<input
					class="w-60 px-2 py-2 bg-transparent outline-none"
					id="email"
					name="email"
					type="text"
					placeholder="example@example.com"
				/>
			</div>
		</label>

		<!-- ? Password -->
		<label for="password" class="flex flex-col">
			<span>Password</span>
			<div
				class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary"
			>
				<Icon icon="carbon:password" />
				<input
					class="w-60 px-2 py-2 bg-transparent outline-none"
					id="password"
					name="password"
					type="password"
					placeholder="********"
					required
				/>
			</div>
		</label>

		<!-- ? Password -->
		<label for="confirm_password" class="flex flex-col">
			<span>Confirm Password</span>
			<div
				class="flex items-center bg-light_gray px-2 rounded-lg border border-transparent focus-within:border-primary"
			>
				<Icon icon="carbon:password" />
				<input
					class="w-60 px-2 py-2 bg-transparent outline-none"
					id="confirm_password"
					name="confirm_password"
					type="password"
					placeholder="********"
					required
				/>
			</div>
		</label>

		{#if !$btnDisabled}
			<button
				disabled={$btnDisabled}
				type="submit"
				class="rounded-md w-36 mx-auto px-3.5 py-2 m-1 overflow-hidden relative group
            cursor-pointer border-2 font-medium border-indigo-600 text-white"
			>
				<span
					class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"
				/>
				<span class="relative text-indigo-600 transition duration-300 group-hover:text-white ease"
					>Sign up</span
				>
			</button>
		{:else}
			<ButtonLoader />
		{/if}
	</form>

	<div class="h-0.5 my-5 w-full bg-light_gray" />

	<article class="flex flex-col items-center">
		<p>Have you an account?</p>

		<a
			href="/login"
			class="rounded-md mx-auto px-3.5 py-2 m-1 overflow-hidden relative group
            cursor-pointer border-2 font-medium border-indigo-600 text-white"
		>
			<span
				class="absolute w-64 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 h-64 -translate-y-32 ease"
			/>
			<span class="relative transition duration-300 text-white ease">Sign in</span>
		</a>
	</article>
</div>
