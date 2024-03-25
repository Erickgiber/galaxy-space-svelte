<script lang="ts">
	import Icon from '@iconify/svelte'
	import type { ITabs } from '$lib/types/components/Tabs/tabst.types'

	// Prop
	export let tabs: ITabs[]
	export let props: any

	// Active var
	let activeTabIndex = 0

	const setActiveTab = (index: number) => (activeTabIndex = index)
</script>

{#if tabs}
	<article>
		<ul class="tabs">
			{#each tabs as { title, icon }, index}
				<li>
					<div
						class="tab"
						class:selected_tab={activeTabIndex === index}
						tabindex="0"
						role="button"
						on:click={() => setActiveTab(index)}
						on:keypress={() => setActiveTab(index)}
					>
						{#if icon}
							<Icon {icon} />
						{/if}
						<p>{title}</p>
					</div>
				</li>
			{/each}
		</ul>
		<article>
			<svelte:component this={tabs[activeTabIndex].content} {...props} />
		</article>
	</article>
{:else}
	<h1>No tabs found</h1>
{/if}

<style lang="scss">
	.tabs {
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
		padding: 15px 0;

		.tab {
			font-weight: 300;
			font-size: 15px;
			border-radius: 5px;
			cursor: pointer;
			user-select: none;
			transition: 0.15s, color 0s;
			width: 130px;
			height: 38px;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 5px;
			font-weight: 500;

			&:hover {
				color: var(--primary);
			}

			&:active {
				transition: 0s;
				transform: scale(0.95);
			}
		}

		.selected_tab {
			background-color: var(--primary);
			color: #ffffff;

			&:hover {
				color: #ffffff;
			}
		}
	}
</style>
