<script lang="ts">
	import { GAME_CONFIGS } from '$lib/types.js';

	interface Props {
		onstart: (names: string[], timerEnabled: boolean) => void;
	}

	let { onstart }: Props = $props();

	let names = $state<string[]>(['', '', '', '', '']);
	let timerEnabled = $state(false);
	let error = $state('');

	function addPlayer() {
		if (names.length >= 10) return;
		names = [...names, ''];
	}

	function removePlayer(index: number) {
		if (names.length <= 5) return;
		names = names.filter((_, i) => i !== index);
	}

	function updateName(index: number, value: string) {
		names = names.map((n, i) => (i === index ? value : n));
	}

	function handleStart() {
		const trimmed = names.map((n) => n.trim());
		if (trimmed.some((n) => n === '')) {
			error = 'All players need a name.';
			return;
		}
		if (new Set(trimmed).size !== trimmed.length) {
			error = 'Names must be unique.';
			return;
		}
		if (!GAME_CONFIGS[trimmed.length]) {
			error = 'Need 5–10 players.';
			return;
		}
		error = '';
		onstart(trimmed, timerEnabled);
	}
</script>

<div class="mx-auto flex max-w-md flex-col gap-6 p-6">
	<div class="text-center">
		<h1 class="text-3xl font-bold tracking-tight text-white">The Resistance</h1>
		<p class="mt-2 text-sm text-zinc-400">Enter player names to begin</p>
	</div>

	<div class="flex flex-col gap-3">
		{#each names as name, i}
			<div class="flex items-center gap-2">
				<span class="w-6 shrink-0 text-right text-sm text-zinc-500">{i + 1}.</span>
				<input
					type="text"
					placeholder="Player {i + 1}"
					value={name}
					oninput={(e) => updateName(i, e.currentTarget.value)}
					class="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				{#if names.length > 5}
					<button
						onclick={() => removePlayer(i)}
						class="shrink-0 rounded-lg px-2 py-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
						aria-label="Remove player"
					>
						✕
					</button>
				{/if}
			</div>
		{/each}
	</div>

	{#if names.length < 10}
		<button
			onclick={addPlayer}
			class="rounded-lg border border-dashed border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-300"
		>
			+ Add Player
		</button>
	{/if}

	<label
		class="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3"
	>
		<input
			type="checkbox"
			bind:checked={timerEnabled}
			class="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
		/>
		<div>
			<div class="text-sm font-medium text-zinc-300">Enable timers</div>
			<div class="text-xs text-zinc-500">Soft time limits with sound alerts</div>
		</div>
	</label>

	{#if error}
		<p class="text-center text-sm text-red-400">{error}</p>
	{/if}

	<button
		onclick={handleStart}
		class="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
	>
		Start Game ({names.length} players)
	</button>

	<div class="text-center text-xs text-zinc-500">
		{#if GAME_CONFIGS[names.length]}
			{GAME_CONFIGS[names.length].spyCount} spies · {names.length -
				1 -
				GAME_CONFIGS[names.length].spyCount} resistance · 1 resistance leader
		{/if}
	</div>
</div>
