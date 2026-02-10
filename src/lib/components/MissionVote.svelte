<script lang="ts">
	import type { Player } from '$lib/types.js';

	interface Props {
		voter: Player;
		voterIndex: number;
		totalVoters: number;
		onvote: (pass: boolean) => void;
	}

	let { voter, voterIndex, totalVoters, onvote }: Props = $props();

	let tapped = $state(false);

	function showVote() {
		tapped = true;
	}

	function vote(pass: boolean) {
		tapped = false;
		onvote(pass);
	}
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<div class="text-sm text-zinc-400">
		Mission Vote — {voterIndex + 1} of {totalVoters}
	</div>

	{#if !tapped}
		<div class="flex flex-col items-center gap-4">
			<div class="text-xl font-semibold text-white">Pass the phone to</div>
			<div class="text-3xl font-bold text-white">{voter.name}</div>
			<p class="text-sm text-zinc-400">No one else should see your choice!</p>
			<button
				onclick={showVote}
				class="mt-4 rounded-lg bg-zinc-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
			>
				Ready to Vote
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">{voter.name}, choose wisely</div>
			<div class="flex w-full gap-4">
				<button
					onclick={() => vote(true)}
					class="flex-1 rounded-lg bg-blue-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-blue-500"
				>
					✓ Pass
				</button>
				<button
					onclick={() => vote(false)}
					class="flex-1 rounded-lg bg-red-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-red-500"
				>
					✗ Fail
				</button>
			</div>
			<p class="text-xs text-zinc-500">
				Resistance members should always pass. Spies can choose to sabotage.
			</p>
		</div>
	{/if}
</div>
