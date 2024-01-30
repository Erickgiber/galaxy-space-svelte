<script lang="ts">
	import VerifiedIcon from '$lib/components/ui/VerifiedIcon.svelte'

	export let data
</script>

<svelte:head>
	<title>Statistics | Galaxy Space</title>
</svelte:head>

<article class="flex gap-3 flex-col bg-white dark:bg-dark_bg dark:text-white px-2 py-4 mt-5 rounded-xl shadow-sm">
	<div class="flex flex-col px-4">
		<span class="text-lg">Users registered in the app</span>
		<span class="text-base font-bold"> Total: {data.totalUsers}</span>
	</div>

	{#each data.users as user}
		<a
			href="/space/u/{user.username}"
			class="user-a shadow-sm border dark:bg-dark_white border-light_gray dark:border-dark_light_gray py-2.5 flex items-center gap-1 pl-2 pr-5 rounded-xl hover:shadow-sm"
		>
			<img class="rounded-full w-12 h-12 object-cover" src={user.photo_url} alt={user.public_name} />
			<div class="flex flex-col leading-4">
				<b class="text-md flex items-center gap-1">
					{user.public_name}
					<VerifiedIcon isStar={user.is_star} />
				</b>
				<p class="text-sm font-semibold text-gray-500">@{user.username}</p>
			</div>
		</a>
	{/each}
</article>

<style lang="scss">
	.user-a:hover {
		color: white;
		background: var(--primary);
		background: -webkit-linear-gradient(to right, #1cb5e0, var(--primary));
		background: linear-gradient(to right, #1cb5e0, var(--primary));

		p {
			color: white;
			opacity: 0.7;
		}
	}
</style>
