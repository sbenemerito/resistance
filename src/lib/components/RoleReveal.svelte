<script lang="ts">
	import type { Player } from '$lib/types.js';

	interface Props {
		players: Player[];
		revealIndex: number;
		onconfirm: () => void;
	}

	let { players, revealIndex, onconfirm }: Props = $props();

	let revealed = $state(false);

	const currentPlayer = $derived(players[revealIndex]);
	const spyNames = $derived(players.filter((p) => p.role === 'spy').map((p) => p.name));

	function reveal() {
		revealed = true;
	}

	function confirm() {
		revealed = false;
		onconfirm();
	}

	const roleDisplay: Record<string, { label: string; color: string; description: string }> = {
		'resistance-leader': {
			label: 'Resistance Leader',
			color: 'text-blue-400',
			description: 'You lead the resistance. You know who the spies are.'
		},
		resistance: {
			label: 'Resistance',
			color: 'text-green-400',
			description: 'You are a loyal member of the resistance.'
		},
		spy: {
			label: 'Spy',
			color: 'text-red-400',
			description: 'You are a spy. Sabotage the missions without getting caught.'
		}
	};
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
	<div class="text-sm text-zinc-400">
		Role Reveal — {revealIndex + 1} of {players.length}
	</div>

	{#if !revealed}
		<div class="flex flex-col items-center gap-4">
			<div class="text-xl font-semibold text-white">Pass the phone to</div>
			<div class="text-3xl font-bold text-white">{currentPlayer.name}</div>
			<p class="text-sm text-zinc-400">Make sure no one else is looking!</p>
			<button
				onclick={reveal}
				class="mt-4 rounded-lg bg-zinc-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-600"
			>
				Tap to Reveal
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="text-lg text-zinc-300">{currentPlayer.name}, you are:</div>
			<div class="text-4xl font-bold {roleDisplay[currentPlayer.role].color}">
				{roleDisplay[currentPlayer.role].label}
			</div>
			<p class="text-sm text-zinc-400">{roleDisplay[currentPlayer.role].description}</p>

			{#if currentPlayer.role === 'resistance-leader'}
				<div class="mt-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
					<div class="text-sm font-medium text-red-400">The spies are:</div>
					<div class="mt-1 text-lg font-semibold text-red-300">
						{spyNames.join(', ')}
					</div>
				</div>
			{/if}

			{#if currentPlayer.role === 'spy'}
				<div class="mt-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
					<div class="text-sm font-medium text-red-400">Fellow spies:</div>
					<div class="mt-1 text-lg font-semibold text-red-300">
						{spyNames.filter((n) => n !== currentPlayer.name).join(', ') || 'You are the only spy'}
					</div>
				</div>
			{/if}

			<button
				onclick={confirm}
				class="mt-4 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500"
			>
				Got it — Hide & Pass Phone
			</button>
		</div>
	{/if}
</div>
