<script lang="ts">
	import type { TypeLikesPost } from '$lib/types/likesPost.types'

	export let likes: TypeLikesPost[]
</script>

{#if likes?.length > 0}
	<article
		class="position absolute bottom-5 left-3 w-40 max-h-44 overflow-y-auto pb-1 pt-0 border dark:border-dark_bg rounded-lg bg-light_gray dark:bg-dark_light_gray flex flex-col"
	>
		<h1
			class="text-left text-black dark:text-white dark:border-dark_bg border-b p-1 sticky top-0 bg-white dark:bg-dark_white"
		>
			Starred by:
		</h1>
		{#each likes as like}
			<a
				href="/space/u/{like.username}"
				class="text-left w-[95%] mx-auto mt-0.5 whitespace-nowrap py-1.5 px-1 hover:bg-primary hover:text-white rounded-md dark:text-dark_text dark:hover:text-white"
				>@{like.username.toLocaleLowerCase()}</a
			>
		{/each}
	</article>
{/if}
