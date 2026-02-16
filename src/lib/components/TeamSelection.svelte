<script lang="ts">
	import type { Player, MissionResult, RejectedTeam } from '$lib/types.js';
	import { MAX_REJECTED_PROPOSALS, combinations } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';
	import Timer from './Timer.svelte';

	interface Props {
		players: Player[];
		leader: Player;
		currentMission: number;
		missionResults: MissionResult[];
		rejectedTeams: RejectedTeam[];
		requiredSize: number;
		timerEnabled: boolean;
		timerSeconds: number;
		onselect: (playerIds: number[]) => void;
	}

	let {
		players,
		leader,
		currentMission,
		missionResults,
		rejectedTeams,
		requiredSize,
		timerEnabled,
		timerSeconds,
		onselect
	}: Props = $props();

	const selectablePlayers = $derived(players.filter((p) => p.id !== leader.id));

	let selected = $state<Set<number>>(new Set());

	const proposalNumber = $derived(rejectedTeams.length + 1);
	const isFinalProposal = $derived(rejectedTeams.length === MAX_REJECTED_PROPOSALS - 1);

	const totalCombinations = $derived(combinations(selectablePlayers.length, requiredSize));
	const uniqueRejectedCount = $derived.by(() => {
		const seen = new Set<string>();
		for (const rt of rejectedTeams) {
			seen.add([...rt.playerIds].sort((a, b) => a - b).join(','));
		}
		return seen.size;
	});
	const remainingUnique = $derived(totalCombinations - uniqueRejectedCount);

	const matchingRejection = $derived.by(() => {
		if (selected.size !== requiredSize) return null;
		const sorted = [...selected].sort((a, b) => a - b);
		return (
			rejectedTeams.find((rt) => {
				const prev = [...rt.playerIds].sort((a, b) => a - b);
				return prev.length === sorted.length && prev.every((id, i) => id === sorted[i]);
			}) ?? null
		);
	});

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
		<div
			class="mt-2 flex items-center justify-center gap-1 text-sm {isFinalProposal
				? 'font-medium text-red-400'
				: 'text-zinc-400'}"
		>
			Proposal {proposalNumber} of {MAX_REJECTED_PROPOSALS}
			{#if isFinalProposal}
				— final chance!
			{/if}
			<span
				class="group relative inline-flex cursor-help"
				role="button"
				tabindex="0"
				aria-label="Proposal rule info"
			>
				<svg class="h-3.5 w-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span
					class="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg bg-zinc-700 px-3 py-2 text-xs leading-relaxed text-zinc-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100"
				>
					If 5 proposals in a row are rejected, spies win
				</span>
			</span>
		</div>
		{#if remainingUnique <= 3 && remainingUnique > 0 && rejectedTeams.length > 0}
			<p class="mt-1 text-xs text-zinc-500">
				{remainingUnique} untried combination{remainingUnique === 1 ? '' : 's'} remaining
			</p>
		{:else if remainingUnique === 0 && rejectedTeams.length > 0}
			<p class="mt-1 text-xs text-amber-500">All combinations have been tried</p>
		{/if}
	</div>

	{#if timerEnabled}
		<div class="flex justify-center">
			<Timer durationSeconds={timerSeconds} key="team-{currentMission}-{leader.id}" />
		</div>
	{/if}

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

	{#if matchingRejection}
		<p class="text-center text-sm text-amber-400">
			This combination was already proposed by {players[matchingRejection.leaderIndex]?.name} and rejected
		</p>
	{/if}

	<button
		onclick={confirm}
		disabled={selected.size !== requiredSize}
		class="rounded-lg px-4 py-3 font-semibold text-white transition
			{selected.size === requiredSize
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
