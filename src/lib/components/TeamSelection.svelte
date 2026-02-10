<script lang="ts">
	import type { Player, MissionResult } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';

	interface Props {
		players: Player[];
		leader: Player;
		currentMission: number;
		missionResults: MissionResult[];
		requiredSize: number;
		onselect: (playerIds: number[]) => void;
	}

	let { players, leader, currentMission, missionResults, requiredSize, onselect }: Props = $props();

	let selected = $state<Set<number>>(new Set());

	function toggle(id: number) {
		const next = new Set(selected);
		if (next.has(id)) {
			next.delete(id);
		} else if (next.size < requiredSize) {
			next.add(id);
		}
		selected = next;
	}

	function confirm() {
		if (selected.size !== requiredSize) return;
		onselect([...selected]);
	}
</script>

<div class="mx-auto flex max-w-md flex-col gap-6 p-6">
	<MissionTracker playerCount={players.length} {currentMission} {missionResults} />

	<div class="text-center">
		<div class="text-sm text-zinc-400">Mission {currentMission + 1} of 5</div>
		<div class="mt-1 text-lg font-semibold text-white">
			{leader.name}, select {requiredSize} players
		</div>
		<p class="mt-1 text-sm text-zinc-500">Make sure only {leader.name} is looking</p>
	</div>

	<div class="flex flex-col gap-2">
		{#each players as player}
			{@const isSelected = selected.has(player.id)}
			<button
				onclick={() => toggle(player.id)}
				class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition
					{isSelected
					? 'border-blue-500 bg-blue-950/40 text-white'
					: 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600'}"
			>
				<div
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs
						{isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-zinc-600'}"
				>
					{#if isSelected}✓{/if}
				</div>
				<span>{player.name}</span>
			</button>
		{/each}
	</div>

	<button
		onclick={confirm}
		disabled={selected.size !== requiredSize}
		class="rounded-lg px-4 py-3 font-semibold text-white transition
			{selected.size === requiredSize
			? 'bg-blue-600 hover:bg-blue-500'
			: 'cursor-not-allowed bg-zinc-700 text-zinc-500'}"
	>
		Send Team on Mission ({selected.size}/{requiredSize})
	</button>
</div>
