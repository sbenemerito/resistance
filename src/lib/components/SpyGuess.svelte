<script lang="ts">
	import type { Player } from '$lib/types.js';

	interface Props {
		players: Player[];
		spies: Player[];
		spyGuesses: { spyId: number; guessedPlayerId: number }[];
		onguess: (spyId: number, guessedPlayerId: number) => void;
		onfinalize: () => void;
	}

	let { players, spies, spyGuesses, onguess, onfinalize }: Props = $props();

	let currentSpyIdx = $state(0);
	let tapped = $state(false);
	let voted = $state(false);

	const currentSpy = $derived(spies[currentSpyIdx]);
	const nonSpies = $derived(players.filter((p) => p.role !== 'spy'));
	const allVoted = $derived(spies.every((s) => spyGuesses.some((g) => g.spyId === s.id)));

	function showChoices() {
		tapped = true;
	}

	function guess(playerId: number) {
		onguess(currentSpy.id, playerId);
		voted = true;
	}

	function nextSpy() {
		voted = false;
		tapped = false;
		if (currentSpyIdx < spies.length - 1) {
			currentSpyIdx++;
		}
	}
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<div class="text-sm text-zinc-400">Last Chance for Spies</div>

	<div class="rounded-lg border border-blue-900/50 bg-blue-950/30 px-4 py-3">
		<div class="text-sm text-blue-400">Resistance won 3 missions!</div>
		<div class="mt-1 text-xs text-zinc-400">
			But spies can still win by unanimously guessing who the Resistance Leader is.
		</div>
	</div>

	{#if allVoted}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">All spies have voted.</div>
			<button
				onclick={onfinalize}
				class="rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-500"
			>
				Reveal Result
			</button>
		</div>
	{:else if !tapped}
		<div class="flex flex-col items-center gap-4">
			<div class="text-xl font-semibold text-white">Pass the phone to</div>
			<div class="text-3xl font-bold text-red-400">{currentSpy.name}</div>
			<div class="text-sm text-zinc-500">Spy {currentSpyIdx + 1} of {spies.length}</div>
			<button
				onclick={showChoices}
				class="mt-4 rounded-lg bg-zinc-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
			>
				Ready to Guess
			</button>
		</div>
	{:else if !voted}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">{currentSpy.name}, who is the Resistance Leader?</div>
			<div class="flex w-full flex-col gap-2">
				{#each nonSpies as player}
					<button
						onclick={() => guess(player.id)}
						class="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-left text-zinc-300 transition hover:border-zinc-500 hover:text-white"
					>
						{player.name}
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-green-400">Vote recorded!</div>
			<button
				onclick={nextSpy}
				class="rounded-lg bg-zinc-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
			>
				Pass Phone to Next Spy
			</button>
		</div>
	{/if}
</div>
