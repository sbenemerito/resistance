<script lang="ts">
	import type { Player, RejectedTeam, MissionResult } from '$lib/types.js';
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
