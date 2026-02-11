<script lang="ts">
	import type { Player } from '$lib/types.js';

	import Timer from './Timer.svelte';

	interface Props {
		players: Player[];
		spies: Player[];
		timerEnabled: boolean;
		timerSeconds: number;
		onguess: (guessedPlayerId: number) => void;
	}

	let { players, spies, timerEnabled, timerSeconds, onguess }: Props = $props();

	let tapped = $state(false);

	const spyNames = $derived(spies.map((s) => s.name).join(' and '));
	const nonSpies = $derived(players.filter((p) => p.role !== 'spy'));
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<div class="text-sm text-zinc-400">Last Chance for Spies</div>

	<div class="rounded-lg border border-blue-900/50 bg-blue-950/30 px-4 py-3">
		<div class="text-sm text-blue-400">Resistance won 3 missions!</div>
		<div class="mt-1 text-xs text-zinc-400">
			But spies can still win by correctly guessing who the Resistance Leader is.
		</div>
	</div>

	{#if !tapped}
		<div class="flex flex-col items-center gap-4">
			<div class="text-xl font-semibold text-white">Pass the phone to the spies</div>
			<div class="text-3xl font-bold text-red-400">{spyNames}</div>
			<p class="text-sm text-zinc-500">Discuss among yourselves, then make one guess.</p>
			<button
				onclick={() => (tapped = true)}
				class="mt-4 rounded-lg bg-zinc-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
			>
				Ready to Guess
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">Who is the Resistance Leader?</div>
			{#if timerEnabled}
				<Timer durationSeconds={timerSeconds} key="spy-guess" />
			{/if}
			<div class="flex w-full flex-col gap-2">
				{#each nonSpies as player}
					<button
						onclick={() => onguess(player.id)}
						class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-left text-zinc-300 transition hover:border-zinc-500 hover:text-white"
					>
						{player.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
