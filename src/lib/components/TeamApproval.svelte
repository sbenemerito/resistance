<script lang="ts">
	import type { Player, RejectedTeam, MissionResult } from '$lib/types.js';
	import { MAX_REJECTED_PROPOSALS } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';
	import Timer from './Timer.svelte';

	interface Props {
		players: Player[];
		leader: Player;
		selectedTeam: number[];
		rejectedTeams: RejectedTeam[];
		currentMission: number;
		missionResults: MissionResult[];
		timerEnabled: boolean;
		timerSeconds: number;
		onapprove: () => void;
		onreject: () => void;
	}

	let {
		players,
		leader,
		selectedTeam,
		rejectedTeams,
		currentMission,
		missionResults,
		timerEnabled,
		timerSeconds,
		onapprove,
		onreject
	}: Props = $props();

	const proposalNumber = $derived(rejectedTeams.length + 1);
	const isFinalProposal = $derived(rejectedTeams.length === MAX_REJECTED_PROPOSALS - 1);

	const isReproposal = $derived.by(() => {
		const sorted = [...selectedTeam].sort((a, b) => a - b);
		return (
			rejectedTeams.find((rt) => {
				const prev = [...rt.playerIds].sort((a, b) => a - b);
				return prev.length === sorted.length && prev.every((id, i) => id === sorted[i]);
			}) ?? null
		);
	});

	function playerName(id: number): string {
		return players.find((p) => p.id === id)?.name ?? '';
	}

	function leaderName(leaderIdx: number): string {
		return players[leaderIdx]?.name ?? '';
	}
</script>

<div class="mx-auto flex max-w-md flex-col gap-6 p-6">
	<MissionTracker playerCount={players.length} {currentMission} {missionResults} />

	<div class="text-center">
		<div class="text-sm text-zinc-400">Mission {currentMission + 1} of 5</div>
		<div class="mt-1 text-lg font-semibold text-white">
			{leader.name}'s proposed team
		</div>
		<p class="mt-1 text-sm text-zinc-500">Vote outside the app, then record the result here</p>
		<div
			class="mt-2 flex items-center justify-center gap-1 text-sm {isFinalProposal
				? 'font-medium text-red-400'
				: 'text-zinc-400'}"
		>
			Proposal {proposalNumber} of {MAX_REJECTED_PROPOSALS}
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
		{#if isReproposal}
			<p class="mt-1 text-xs text-amber-400">
				Previously proposed by {players[isReproposal.leaderIndex]?.name} and rejected
			</p>
		{/if}
		{#if isFinalProposal}
			<p class="mt-2 text-sm font-medium text-red-400">If rejected, spies win!</p>
		{/if}
	</div>

	{#if timerEnabled}
		<div class="flex justify-center">
			<Timer durationSeconds={timerSeconds} key="approval-{currentMission}-{leader.id}" />
		</div>
	{/if}

	<div class="flex flex-wrap justify-center gap-2">
		{#each selectedTeam as id}
			<span
				class="rounded-full border border-blue-800 bg-blue-950/50 px-4 py-2 text-sm font-medium text-blue-300"
			>
				{playerName(id)}
			</span>
		{/each}
	</div>

	<div class="flex gap-3">
		<button
			onclick={onapprove}
			class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
		>
			✓ Approved
		</button>
		<button
			onclick={onreject}
			class="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500"
		>
			✗ Rejected
		</button>
	</div>

	{#if rejectedTeams.length > 0}
		<div class="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
			<div class="mb-3 text-sm font-medium text-zinc-400">Previously Rejected</div>
			<div class="flex flex-col gap-3">
				{#each rejectedTeams as rejected, i}
					<div class="flex flex-col gap-1">
						<div class="text-xs text-zinc-500">
							Proposed by {leaderName(rejected.leaderIndex)}
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
