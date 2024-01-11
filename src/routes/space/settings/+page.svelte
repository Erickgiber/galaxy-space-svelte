<script>
	import { loadTheme } from '$lib/utils/loadTheme'
	import Icon from '@iconify/svelte'

	const toggleDarkMode = () => {
		const storage = localStorage.getItem('theme')
		if (storage === 'dark') {
			localStorage.removeItem('theme')
		} else {
			localStorage.setItem('theme', 'dark')
		}

		loadTheme()
	}
</script>

<svelte:head>
	<title>Settings | Galaxy Space</title>
</svelte:head>

<h1
	class="text-dark dark:text-dark_text text-xl border-b pb-1
	dark:border-dark_light_gray
"
>
	Settings
</h1>

<button
	on:click={toggleDarkMode}
	type="button"
	class="bg-white dark:text-white hover:text-white text-dark dark:bg-dark_white flex items-center gap-1 mt-5 bg-text-white px-3 py-2 rounded-xl hover:bg-dark_white active:bg-dark_white focus:outline-none shadow hover:shadow-md transition duration-50"
>
	<Icon icon="material-symbols:dark-mode" width="20" />
	Dark Mode
</button>
