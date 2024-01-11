<script lang="ts">
	import type { TypeLikesPost } from '$lib/types/likesPost.types'

	export let likes: TypeLikesPost[]
</script>

{#if likes.length > 0}
	<article
		class="position absolute bottom-5 left-3 w-40 max-h-44 overflow-y-auto pb-1 pt-0 border rounded-lg bg-light_gray flex flex-col"
	>
		<h1 class="text-left text-black border-b p-1 sticky top-0 bg-white">Starred by:</h1>
		{#each likes as like}
			<a
				href="/space/u/{like.username}"
				class="text-left w-[97%] mx-auto mt-0.5 whitespace-nowrap py-1.5 px-1 hover:bg-primary hover:text-white rounded-lg"
				>@{like.username.toLocaleLowerCase()}</a
			>
		{/each}
	</article>
{/if}
