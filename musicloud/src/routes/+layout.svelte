<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import "@yaireo/tagify/dist/tagify.css";
	import "../app.css";
</script>

<style>
	:global(html) {
		background-color: var(--color-slate-800);
	}
</style>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
