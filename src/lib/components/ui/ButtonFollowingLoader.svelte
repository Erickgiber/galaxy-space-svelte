<script lang="ts">
	const defaultSize = '40px'
	export let width = defaultSize
	export let height = defaultSize
</script>

<div class="lds-ellipsis" style="width: {width}; height: {height};">
	<div />
	<div />
	<div />
	<div />
</div>

<style>
	.lds-ellipsis {
		display: inline-block;
		position: relative;
	}
	.lds-ellipsis div {
		position: absolute;
		top: 40%;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--primary);
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
