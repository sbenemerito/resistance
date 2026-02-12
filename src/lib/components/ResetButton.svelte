<script lang="ts">
	interface Props {
		onreset: () => void;
	}

	let { onreset }: Props = $props();

	let showConfirm = $state(false);
</script>

<button
	onclick={() => (showConfirm = true)}
	class="fixed top-4 right-4 z-40 rounded-lg border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur transition hover:border-red-900 hover:text-red-400"
>
	Reset Game
</button>

{#if showConfirm}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
		onkeydown={(e) => {
			if (e.key === 'Escape') showConfirm = false;
		}}
		onclick={(e) => {
			if (e.target === e.currentTarget) showConfirm = false;
		}}
	>
		<div
			class="mx-4 flex w-full max-w-xs flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-2xl"
		>
			<div class="text-center">
				<div class="text-lg font-semibold text-white">Reset Game?</div>
				<p class="mt-1 text-sm text-zinc-400">
					This will end the current game and return to the lobby. Player names will be kept.
				</p>
			</div>
			<div class="flex gap-3">
				<button
					onclick={() => (showConfirm = false)}
					class="flex-1 rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700"
				>
					Cancel
				</button>
				<button
					onclick={() => {
						showConfirm = false;
						onreset();
					}}
					class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
{/if}
