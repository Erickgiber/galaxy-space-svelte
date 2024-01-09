<script lang="ts">
	import type { TypeImage } from '$lib/types/image.types'

	export let imageList: TypeImage[] = []
	export let currentSection: string = ''
</script>

<!-- If la lista existe -->
{#if currentSection === 'images' && imageList && imageList.length > 0}
	<div class="w-full pb-5 h-max mb-5 rounded-xl mt-3">
		<div class="grid grid-cols-2 lg:grid-cols-4 w-full justify-between gap-5">
			<!-- Iterar la lista de imagenes -->
			{#each imageList as image}
				{#if image.image_url}
					<!-- component -->
					<div class="w-full h-full shadow-lg bg-white rounded-xl p-2">
						<a href="/space/post">
							<img
								class="w-full h-72 object-cover rounded-xl"
								src={image.image_url}
								alt={image.text}
							/>
						</a>
						<ul class="mt-2 flex flex-wrap px-2">
							<li class="mr-auto">
								<a href="/space/post" class="flex text-gray-400 hover:text-gray-600">
									<svg class="mr-0.5" style="width:24px;height:24px" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z"
										/>
									</svg>
									1
								</a>
							</li>
							<!-- <li class="mr-2">
							<a href="#" class="flex text-gray-400 hover:text-gray-600">
								<svg class="mr-0.5" style="width:24px;height:24px" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"
									/>
								</svg>
								3
							</a>
						</li> -->
							<li>
								<a href="#a" class="flex text-gray-400 hover:text-gray-600">
									<svg class="mr-0.5" style="width:24px;height:24px" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
										/>
									</svg>
									3
								</a>
							</li>
						</ul>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}
