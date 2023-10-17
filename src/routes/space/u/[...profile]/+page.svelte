<script lang="ts">
	import type { IProfile } from '$lib/types/profile.types.js'

	export let data

	const profile = data.profile as IProfile
</script>

<div
	id="cover_photo"
	class="w-full flex items-end justify-center h-full max-h-56 bg-white shadow-sm rounded-xl"
	style={profile.cover_photo_url
		? 'background-image: url(${profile.cover_photo_url}); background-size: cover;'
		: null}
>
	<div
		class="w-36 h-36 select-none relative top-16 rounded-full bg-light_gray border-4 border-white shadow-sm"
	>
		<img class="w-full h-full object-cover" src={profile.photo_url} alt="" />
	</div>
</div>

<div class="flex flex-col justify-center text-center mt-[73px]">
	<p class="text-2xl font-semibold text-dark leading-tight">{profile.public_name}</p>
	<b class="text-lg capitalize text-dark opacity-80 leading-snug">@{profile.username}</b>
</div>

<style lang="scss">
	#cover_photo {
		background: var(--primary); /* fallback for old browsers */
		background: -webkit-linear-gradient(
			to right,
			#1cb5e0,
			var(--primary)
		); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to right,
			#1cb5e0,
			var(--primary)
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
</style>
