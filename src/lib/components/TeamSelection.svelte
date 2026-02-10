<script lang="ts">
	import type { Player, MissionResult } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';

	import type { RejectedTeam } from '$lib/types.js';

	interface Props {
		players: Player[];
		leader: Player;
		currentMission: number;
		missionResults: MissionResult[];
		rejectedTeams: RejectedTeam[];
		requiredSize: number;
		isTeamAlreadyRejected: (playerIds: number[]) => boolean;
		onselect: (playerIds: number[]) => void;
	}

	let {
		players,
		leader,
		currentMission,
		missionResults,
		rejectedTeams,
		requiredSize,
		isTeamAlreadyRejected,
		onselect
	}: Props = $props();

	const selectablePlayers = $derived(players.filter((p) => p.id !== leader.id));

	let selected = $state<Set<number>>(new Set());

	const isDuplicate = $derived(
		selected.size === requiredSize && isTeamAlreadyRejected([...selected])
	);

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
		if (isDuplicate) return;
		onselect([...selected]);
	}

	function playerName(id: number): string {
		return players.find((p) => p.id === id)?.name ?? '';
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
		{#each selectablePlayers as player}
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

	{#if isDuplicate}
		<p class="text-center text-sm text-red-400">
			This team was already rejected. Pick a different combination.
		</p>
	{/if}

	<button
		onclick={confirm}
		disabled={selected.size !== requiredSize || isDuplicate}
		class="rounded-lg px-4 py-3 font-semibold text-white transition
			{selected.size === requiredSize && !isDuplicate
			? 'bg-blue-600 hover:bg-blue-500'
			: 'cursor-not-allowed bg-zinc-700 text-zinc-500'}"
	>
		Propose Team ({selected.size}/{requiredSize})
	</button>

	{#if rejectedTeams.length > 0}
		<div class="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
			<div class="mb-3 text-sm font-medium text-zinc-400">Previously Rejected</div>
			<div class="flex flex-col gap-3">
				{#each rejectedTeams as rejected, i}
					<div class="flex flex-col gap-1">
						<div class="text-xs text-zinc-500">
							Proposed by {players[rejected.leaderIndex]?.name}
						</div>
						<div class="flex flex-wrap gap-1.5">
							{#each rejected.playerIds as id}
								<span
									class="rounded-full border border-red-900/40 bg-red-950/30 px-2.5 py-0.5 text-xs text-red-400"
								>
									{playerName(id)}
								</span>
							{/each}
						</div>
					</div>
					{#if i < rejectedTeams.length - 1}
						<hr class="border-zinc-700/50" />
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>
