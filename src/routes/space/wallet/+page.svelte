<script lang="ts">
	import BreadCrumb from '$lib/components/ui/BreadCrumb.svelte'
</script>

<svelte:head>
	<title>Wallet | Galaxy Space</title>

	<meta name="keywords" content="wallet,galaxy,space,galaxyspace,carupano,guayana,venezuela,social" />
	<meta name="description" content="See your balance in your wallet of your Galaxy Space account" />
</svelte:head>

<BreadCrumb data={{ current: { title: 'Wallet', icon: 'ph:wallet' } }} />

<section class="flex flex-wrap px-3 sm:px-0 gap-2">
	<article class="w-full flex flex-col justify-between sm:w-2/4 h-32 p-3 bg-white dark:bg-dark_white rounded-md shadow-sm">
		<div>
			<h1 class="text-base text-dark_text font-semibold">Wallet balance</h1>
			<h2 class="text-xl font-semibold dark:text-white">$ 0,00</h2>
		</div>

		<div class="flex items-center gap-3">
			<button type="button" class="bg-primary transition-all hover:bg-opacity-75 text-white font-semibold px-3 py-1 rounded shadow-md">Deposit</button
			>
			<button
				type="button"
				class="border transition-all border-gray-300 dark:bg-dark_light_gray dark:border-transparent dark:text-white
				bg-gray-100 hover:bg-gray-600 dark:hover:bg-white dark:hover:bg-opacity-10 hover:text-white px-2 py-1 rounded"
			>
				Send
			</button>
		</div>
	</article>

	<article class="w-full h-32 sm:w-[48%] pb-3 px-0 bg-white dark:bg-dark_white rounded-md shadow-sm">
		<h1 class="border-b dark:border-dark_light_gray py-1 px-3 text-center dark:text-white">History payment's</h1>
		<p class="text-center mt-3 dark:text-white">No transactions...</p>
	</article>
</section>
