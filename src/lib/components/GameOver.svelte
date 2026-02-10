<script lang="ts">
	import type { Player, MissionResult } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';

	interface Props {
		players: Player[];
		winner: 'resistance' | 'spies';
		missionResults: MissionResult[];
		resistanceWins: number;
		spyWins: number;
		spyGuessCorrect: boolean;
		onreset: () => void;
	}

	let {
		players,
		winner,
		missionResults,
		resistanceWins,
		spyWins,
		spyGuessCorrect,
		onreset
	}: Props = $props();

	const spies = $derived(players.filter((p) => p.role === 'spy'));
	const resistanceLeader = $derived(players.find((p) => p.role === 'resistance-leader'));
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<MissionTracker playerCount={players.length} currentMission={5} {missionResults} />

	<div
		class="flex h-32 w-32 items-center justify-center rounded-full text-6xl
			{winner === 'resistance' ? 'bg-blue-600' : 'bg-red-600'}"
	>
		{winner === 'resistance' ? '🛡️' : '🗡️'}
	</div>

	<div class="text-3xl font-bold {winner === 'resistance' ? 'text-blue-400' : 'text-red-400'}">
		{winner === 'resistance' ? 'Resistance Wins!' : 'Spies Win!'}
	</div>

	{#if spyGuessCorrect}
		<div class="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm">
			<span class="text-red-400">The spies correctly identified the Resistance Leader!</span>
		</div>
	{:else if resistanceWins >= 3 && winner === 'resistance'}
		<div class="rounded-lg border border-blue-900/50 bg-blue-950/30 px-4 py-3 text-sm">
			<span class="text-blue-400">The spies failed to identify the Resistance Leader.</span>
		</div>
	{/if}

	<div class="flex gap-6 text-lg">
		<span>Resistance: <strong class="text-blue-400">{resistanceWins}</strong></span>
		<span>Spies: <strong class="text-red-400">{spyWins}</strong></span>
	</div>

	<div class="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
		<div class="mb-2 text-sm font-medium text-zinc-400">Roles Revealed</div>
		<div class="flex flex-col gap-1">
			{#each players as player}
				{@const color =
					player.role === 'spy'
						? 'text-red-400'
						: player.role === 'resistance-leader'
							? 'text-blue-400'
							: 'text-green-400'}
				<div class="flex justify-between text-sm">
					<span class="text-zinc-300">{player.name}</span>
					<span class={color}>
						{player.role === 'resistance-leader'
							? 'Resistance Leader'
							: player.role === 'resistance'
								? 'Resistance'
								: 'Spy'}
					</span>
				</div>
			{/each}
		</div>
	</div>

	<button
		onclick={onreset}
		class="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
	>
		Play Again
	</button>
</div>
