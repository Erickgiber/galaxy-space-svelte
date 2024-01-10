<script lang="ts">
	import Post from '$lib/components/ui/Post.svelte'
	import type { IPost } from '$lib/types/post.types'
	import type { PageData } from './$types'

	export let data: PageData
	const post = data.post as IPost
</script>

<Post supabase={data.supabase} {post} />
