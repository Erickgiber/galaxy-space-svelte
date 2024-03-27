<script lang="ts">
	import Icon from '@iconify/svelte'
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'
	export let className: string = ''
	type TypeParams = {
		module?: {
			title: string
			href: string
			icon?: string
		}
		current: {
			title: string
			icon?: string
			href?: string
		}
		child?: {
			title: string
			icon?: string
		}
	}

	export let data: TypeParams = {
		module: {
			title: '',
			href: '',
			icon: ''
		},
		current: {
			title: '',
			icon: ''
		}
	}
</script>

<div class="py-3 px-3 sm:px-0 flex flex-wrap {className}">
	<Breadcrumb aria-label="Breadcrumb">
		<BreadcrumbItem href="/space" home>
			<svelte:fragment slot="icon">
				<Icon icon="mage:home-2-fill" width="17" class="mr-1.5" />
			</svelte:fragment>
			<span class="text-lg sm:text-xl">Home</span>
		</BreadcrumbItem>
		{#if data.module}
			<BreadcrumbItem href={data.module.href}>
				<span class="capitalize text-lg sm:text-xl flex items-center gap-1">
					{#if data.module.icon}
						<Icon icon={data.module.icon} />
					{/if}
					{data.module.title}
				</span>
			</BreadcrumbItem>
		{/if}
		<BreadcrumbItem href={data.child?.title ? data.current?.href : ''}>
			<span class="capitalize text-lg sm:text-xl flex items-center gap-1">
				{#if data.current.icon}
					<Icon icon={data.current.icon} />
				{/if}
				{data.current.title ?? 'not found'}
			</span>
		</BreadcrumbItem>

		{#if data.child?.title}
			<BreadcrumbItem>
				<span class="capitalize text-lg sm:text-xl flex items-center gap-1">
					{#if data.child?.icon}
						<Icon icon={data.child.icon} />
					{/if}
					{data.child.title ?? 'not found'}
				</span>
			</BreadcrumbItem>
		{/if}
	</Breadcrumb>
</div>
