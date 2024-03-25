<script lang="ts">
	import type { TypeSelectService } from '$lib/types/select-service.types'
	import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
	import axios, { type AxiosResponse } from 'axios'
	import { stringify } from 'postcss'
	import { fade } from 'svelte/transition'
	import ButtonLoader from '../ButtonLoader.svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import type { TypeMessageResponse } from '$lib/types/services/response-api.types'
	import { goto } from '$app/navigation'

	export let selectServiceOpened: TypeSelectService
	export let authWithAnyApp: boolean
	let buttonSaveEnable = false
	let basicData = { avatar_url: '', name: '' }
	let isLoadingAccount = false
	let username = ''

	$: buttonSaveEnable = username.length > 2

	const setServiceOpened = (enable: boolean, service: TypeSelectService['service']) => {
		selectServiceOpened = { enable, service }
	}

	const handleSubmit = async (event: Event) => {
		event.preventDefault()
		if (!buttonSaveEnable) return
		resetDataBasic()
		isLoadingAccount = true
		const { data, status } = await axios.get(`/auth/github/basic-info?username=${username}`)

		if (status !== 200) {
			toast.pop()
			toast.push('Error on fetch user! Try again')
			return
		}

		if (data) {
			const { avatar_url, name } = data as TypeGithubUserResponse
			basicData = { avatar_url, name }
			selectServiceOpened = { enable: true, service: 'github' }
		}

		isLoadingAccount = false
	}

	const resetDataBasic = () => {
		basicData = { avatar_url: '', name: '' }
	}

	const saveGithubUserData = async () => {
		const {
			data: { status, message }
		} = await axios.post<TypeMessageResponse>(`/auth/github/save-info`, { username })
		if (status) {
			toast.pop()
			toast.push(message)
			resetDataBasic()
			selectServiceOpened = { enable: false, service: '' }
			authWithAnyApp = true
			goto('/space/services/github')
		}
	}
</script>

<main class="flex flex-col items-center w-full">
	<form on:submit={handleSubmit} class="flex gap-2">
		<input
			bind:value={username}
			type="text"
			placeholder="Github username"
			class="bg-white focus:ring-0 dark:bg-dark_light_gray placeholder:text-dark_text dark:text-white placeholder:font-semibold shadow-sm border-none font-bold py-2 pl-2 pr-4 outline-none
        transition-all hover:bg-opacity-80 text-black focus:border-primary active:transition-none disabled:cursor-not-allowed rounded-md"
			disabled={Boolean(basicData.name || basicData.avatar_url)}
		/>

		{#if buttonSaveEnable && !isLoadingAccount}
			<button
				type="submit"
				in:fade={{ duration: 100 }}
				disabled={Boolean(basicData.name || basicData.avatar_url)}
				class="bg-white text-dark dark:bg-dark_light_gray shadow-sm dark:border dark:border-[#30363D] dark:text-white font-bold px-4 rounded
    transition-all hover:bg-opacity-80 active:scale-95 active:transition-none disabled:cursor-not-allowed">Find</button
			>
		{:else if !buttonSaveEnable && !isLoadingAccount}
			<button
				type="button"
				on:click={() => setServiceOpened(false, '')}
				in:fade={{ duration: 100 }}
				class="bg-red-400 border border-red-500 text-white font-bold px-2.5 rounded-md
    transition-all hover:bg-opacity-80 active:scale-95 active:transition-none">Close</button
			>
		{/if}
	</form>

	{#if isLoadingAccount}
		<br />
		<ButtonLoader />
	{/if}

	{#if basicData.name}
		<div class="flex flex-col items-center gap-1 mt-4">
			<h1 class="font-bold text-xl dark:text-white mb-2">Is this your Github account?</h1>

			{#if basicData.avatar_url}
				<img
					width="150"
					height="150"
					src={basicData.avatar_url}
					alt={basicData.name}
					class="rounded-full border-primary border-4 bg-light_gray dark:bg-dark_light_gray"
				/>
			{/if}

			<b class="capitalize text-center text-xl dark:text-dark mt-1"> {basicData.name} </b>

			<div class="w-full flex justify-center gap-2 mt-2">
				<button
					on:click={saveGithubUserData}
					type="button"
					class="bg-[#161B22] border border-[#30363D] text-white font-bold py-2 px-4 rounded outline-none
            transition-all hover:bg-opacity-80 active:scale-95 active:transition-none">Yes</button
				>

				<button
					type="button"
					on:click={resetDataBasic}
					class="bg-red-400 border border-red-500 text-white font-bold py-2 px-4 rounded
            transition-all hover:bg-opacity-80 active:scale-95 active:transition-none">No</button
				>
			</div>
		</div>
	{/if}
</main>
