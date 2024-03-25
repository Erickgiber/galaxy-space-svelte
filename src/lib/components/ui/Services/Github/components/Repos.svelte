<script lang="ts">
	import ButtonLoader from '$lib/components/ui/ButtonLoader.svelte'
	import type { TypeReposResponse } from '$lib/types/services/github-repos.response.types'
	import type { TypeGithubUserResponse } from '$lib/types/services/github-response.types'
	import Icon from '@iconify/svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import axios from 'axios'
	import { onMount } from 'svelte'

	export let service_info: TypeGithubUserResponse
	let repos: TypeReposResponse[] = []
	let isLoadingRepos = false

	onMount(async () => {
		isLoadingRepos = true
		const { data, status } = await axios.get<TypeReposResponse[]>(`/github/repos?username=${service_info.login}`)

		if (status !== 200) {
			toast.pop()
			toast.push('Error on fetch user! Try again')
			isLoadingRepos = false
			return
		}

		if (data) {
			repos = [...data]
			isLoadingRepos = false
		}
	})
</script>

{#if isLoadingRepos}
	<div class="w-40 flex justify-start items-start">
		<ButtonLoader />
	</div>
{:else}
	<ul class="flex flex-col gap-3">
		<li>
			<h1>Total: {repos.length}</h1>
		</li>
		{#each repos as repo}
			<li>
				<a
					class="sm:hover:scale-[99%] hover:bg-primary dark:hover:bg-primary hover:text-white transition-all hover:duration-0 px-3 pt-2 flex flex-col justify-between gap-1 dark:border-dark_light_gray w-full h-[70px] rounded-md bg-white dark:bg-dark_white shadow-sm dark:text-white"
					href="/space/services/github/{repo.id}"
				>
					<div class="flex items-center gap-1">
						<Icon icon="iconoir:repository" />
						<h1 class="font-semibold">{repo.name}</h1>
					</div>

					<article class="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-2">
						{#if repo.topics.length > 0}
							{#each repo.topics as topic}
								<span
									class="topic dark:bg-white bg-dark dark:bg-opacity-20 text-white font-semibold {topic} text-sm px-2 pb-0.5 flex justify-center items-center rounded-md"
									>{topic}</span
								>
							{/each}
						{:else}
							<span class="bg-black text-white text-sm px-2 pb-0.5 rounded-md">no-topic</span>
						{/if}
					</article>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.topic:where(.css, .tailwind, .tailwindcss, .tailwind-css, .css-grid, .css-flexbox, .css3) {
		background-color: var(--css);
	}

	.topic:where(.javascript, .js, .js-vanilla) {
		background-color: var(--js);
	}

	.topic:where(.html, .html5, .ejs) {
		background-color: var(--html);
	}

	.topic:where(.eslint, .express, .node, .node-js, .nodejs) {
		background-color: var(--eslint);
	}

	.topic.sass {
		background-color: var(--sass);
	}

	.topic:where(.svelte, .sveltekit) {
		background-color: var(--sveltekit);
	}

	.topic.youtube {
		background-color: var(--youtube);
	}

	.topic:where(.gatsby, .gatsbyjs, .gatsby-js) {
		background-color: var(--gatsby);
	}

	.topic:where(.react, .reactjs, .react-js) {
		background-color: var(--react);
	}

	.topic:where(.ts, .typescript) {
		background-color: var(--ts);
	}

	.topic:where(.socket, .socketio, .socket-io) {
		background-color: var(--socket-io);
	}
</style>
