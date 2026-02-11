<script lang="ts">
	import type { Player } from '$lib/types.js';

	import Timer from './Timer.svelte';

	interface Props {
		voter: Player;
		voterIndex: number;
		totalVoters: number;
		timerEnabled: boolean;
		timerSeconds: number;
		onvote: (pass: boolean) => void;
	}

	let { voter, voterIndex, totalVoters, timerEnabled, timerSeconds, onvote }: Props = $props();

	let tapped = $state(false);
	let passOnLeft = $state(Math.random() < 0.5);
	let pendingVote = $state<boolean | null>(null);

	function showVote() {
		tapped = true;
		passOnLeft = Math.random() < 0.5;
	}

	function selectVote(pass: boolean) {
		pendingVote = pass;
	}

	function confirmVote() {
		if (pendingVote === null) return;
		const pass = pendingVote;
		pendingVote = null;
		tapped = false;
		onvote(pass);
	}

	function cancelVote() {
		pendingVote = null;
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
	{:else if pendingVote !== null}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">Confirm your choice</div>
			<div
				class="rounded-lg px-8 py-4 text-2xl font-bold {pendingVote
					? 'bg-blue-600/20 text-blue-400'
					: 'bg-red-600/20 text-red-400'}"
			>
				{pendingVote ? '✓ Pass' : '✗ Fail'}
			</div>
			<p class="text-sm text-zinc-400">Are you sure? This cannot be undone.</p>
			<div class="flex w-full gap-4">
				<button
					onclick={cancelVote}
					class="flex-1 rounded-lg bg-zinc-700 px-6 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
				>
					Go Back
				</button>
				<button
					onclick={confirmVote}
					class="flex-1 rounded-lg px-6 py-4 text-lg font-bold text-white transition {pendingVote
						? 'bg-blue-600 hover:bg-blue-500'
						: 'bg-red-600 hover:bg-red-500'}"
				>
					Confirm
				</button>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">{voter.name}, choose wisely</div>
			{#if timerEnabled}
				<Timer durationSeconds={timerSeconds} key="vote-{voter.id}-{voterIndex}" />
			{/if}
			<div class="flex w-full gap-4">
				{#if passOnLeft}
					<button
						onclick={() => selectVote(true)}
						class="flex-1 rounded-lg bg-blue-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-blue-500"
					>
						✓ Pass
					</button>
					<button
						onclick={() => selectVote(false)}
						class="flex-1 rounded-lg bg-red-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-red-500"
					>
						✗ Fail
					</button>
				{:else}
					<button
						onclick={() => selectVote(false)}
						class="flex-1 rounded-lg bg-red-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-red-500"
					>
						✗ Fail
					</button>
					<button
						onclick={() => selectVote(true)}
						class="flex-1 rounded-lg bg-blue-600 px-6 py-6 text-xl font-bold text-white transition hover:bg-blue-500"
					>
						✓ Pass
					</button>
				{/if}
			</div>
			<p class="text-xs text-zinc-500">
				Resistance members should almost always pass, except for very rare situations. Spies can choose to sabotage.
			</p>
		</div>
	{/if}
</div>
