<script>
	import Icon from '@iconify/svelte'
	import LOGO from '$lib/assets/logos/logo.png'
	import { enhance } from '$app/forms'
	import { writable } from 'svelte/store'
	import { resolver } from '$lib/utils/resolver'
	import { page } from '$app/stores'
	import ButtonLoader from '$lib/components/ui/ButtonLoader.svelte'

	// Disable for btn
	const btnDisabled = writable(false)

	const handleSubmit = () => {
		return resolver(btnDisabled, {})
	}
</script>

<svelte:head>
	<title>Sign in | Galaxy Space</title>
</svelte:head>

<div
	class="w-full h-screen sm:w-[500px] py-10 sm:py-7 px-5 sm:px-10 sm:h-max sm:rounded-xl shadow-2xl max-w-3xl bg-white"
>
	<article class="flex items-center gap-2">
		<img class="w-14 h-14" src={LOGO} alt="Logo" />
		<div>
			<p class="text-xl">Galaxy Space</p>
			<p>Sign in</p>
		</div>
	</article>

	<p class="text-dark text-lg mt-5">Log in fast! there are new stars ✨</p>

	<form use:enhance={handleSubmit} method="POST" class="flex mt-5 flex-col gap-4">
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
					>Sign in</span
				>
			</button>
		{:else}
			<ButtonLoader />
		{/if}
	</form>

	<div class="h-0.5 my-5 w-full bg-light_gray" />

	<article class="flex flex-col items-center">
		<p>Have you not an account?</p>

		<a
			href="/signup"
			class="rounded-md mx-auto px-3.5 py-2 m-1 overflow-hidden relative group
            cursor-pointer border-2 font-medium border-indigo-600 text-white"
		>
			<span
				class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"
			/>
			<span class="relative text-indigo-600 transition duration-300 group-hover:text-white ease"
				>Sign up</span
			>
		</a>
	</article>
</div>
