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
	<meta name="keywords" content="settings,galaxy,space,galaxyspace,carupano,guayana,venezuela,social" />
	<meta name="description" content="Config your Galaxy Space account" />
</svelte:head>

<article class="flex items-centerm p-2 pb-3 sm:p-0 sm:pb-1 gap-1 border-b border-gray-300 text-xl dark:border-dark_light_gray">
	<Icon icon="solar:settings-linear" class="text-primary text-2xl" />
	<h1 class="font-semibold dark:text-white">Settings</h1>
</article>

<section class="sm:p-0 p-2">
	<button
	on:click={toggleDarkMode}
	type="button"
	class="bg-white dark:text-white hover:text-white text-dark dark:bg-dark_white flex items-center gap-1 mt-5 bg-text-white px-3 py-2 rounded-xl hover:bg-dark_white active:bg-dark_white focus:outline-none shadow hover:shadow-md transition duration-50"
>
	<Icon icon="material-symbols:dark-mode" width="20" />
	Dark Mode
</button>

</section>

