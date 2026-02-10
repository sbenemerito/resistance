<script lang="ts">
	import { GAME_CONFIGS, failsRequired } from '$lib/types.js';
	import type { MissionResult } from '$lib/types.js';

	interface Props {
		playerCount: number;
		currentMission: number;
		missionResults: MissionResult[];
	}

	let { playerCount, currentMission, missionResults }: Props = $props();

	const config = $derived(GAME_CONFIGS[playerCount]);
</script>

<div class="flex items-center justify-center gap-2">
	{#each config.missionSizes as size, i}
		{@const result = missionResults.find((r) => r.missionIndex === i)}
		{@const isCurrent = i === currentMission}
		{@const failsNeeded = failsRequired(playerCount, i)}
		<div class="flex flex-col items-center gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition
					{result
					? result.passed
						? 'bg-blue-600 text-white'
						: 'bg-red-600 text-white'
					: isCurrent
						? 'border-2 border-blue-400 text-blue-400'
						: 'border border-zinc-700 text-zinc-500'}"
			>
				{size}
			</div>
			<span class="text-[10px] {failsNeeded > 1 ? 'text-amber-400' : 'text-zinc-500'}"
				>{failsNeeded}F</span
			>
		</div>
	{/each}
</div>
