<script lang="ts">
	import type { Player } from '$lib/types.js';
	import { failsRequired } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';
	import type { MissionResult } from '$lib/types.js';

	interface Props {
		players: Player[];
		currentMission: number;
		missionResults: MissionResult[];
		votes: { playerId: number; pass: boolean }[];
		teamPlayerIds: number[];
		passed: boolean;
		resistanceWins: number;
		spyWins: number;
		onproceed: () => void;
	}

	let {
		players,
		currentMission,
		missionResults,
		votes,
		teamPlayerIds,
		passed,
		resistanceWins,
		spyWins,
		onproceed
	}: Props = $props();

	const passCount = $derived(votes.filter((v) => v.pass).length);
	const failCount = $derived(votes.filter((v) => !v.pass).length);
	const needed = $derived(failsRequired(players.length, currentMission));
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<MissionTracker playerCount={players.length} {currentMission} {missionResults} />

	<div class="text-sm text-zinc-400">Mission {currentMission + 1} Result</div>

	<div
		class="flex h-28 w-28 items-center justify-center rounded-full text-5xl font-bold
			{passed ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}"
	>
		{passed ? '✓' : '✗'}
	</div>

	<div class="text-2xl font-bold {passed ? 'text-blue-400' : 'text-red-400'}">
		Mission {passed ? 'Passed' : 'Failed'}!
	</div>

	<div class="flex gap-8 text-lg">
		<div class="text-blue-400">
			<span class="font-bold">{passCount}</span> Pass
		</div>
		<div class="text-red-400">
			<span class="font-bold">{failCount}</span> Fail
		</div>
	</div>

	{#if needed > 1}
		<div class="text-sm text-zinc-500">
			This mission required {needed} fails to be sabotaged
		</div>
	{/if}

	<div class="flex flex-wrap justify-center gap-2">
		{#each teamPlayerIds as id}
			{@const player = players.find((p) => p.id === id)}
			{#if player}
				<span class="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">{player.name}</span>
			{/if}
		{/each}
	</div>

	<div class="flex gap-6 text-sm text-zinc-400">
		<span>Resistance: <strong class="text-blue-400">{resistanceWins}</strong></span>
		<span>Spies: <strong class="text-red-400">{spyWins}</strong></span>
	</div>

	<button
		onclick={onproceed}
		class="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
	>
		Continue
	</button>
</div>
