<script lang="ts">
	import type { Player, MissionResult } from '$lib/types.js';
	import MissionTracker from './MissionTracker.svelte';

	interface Props {
		players: Player[];
		currentMission: number;
		missionResults: MissionResult[];
		onreveal: () => void;
	}

	let { players, currentMission, missionResults, onreveal }: Props = $props();

	let rolling = $state(false);
	let audioCtx: AudioContext | null = null;

	function playDrumroll() {
		try {
			audioCtx = new AudioContext();
			const duration = 2.5;
			const now = audioCtx.currentTime;

			const noiseBuffer = audioCtx.createBuffer(
				1,
				audioCtx.sampleRate * duration,
				audioCtx.sampleRate
			);
			const data = noiseBuffer.getChannelData(0);
			for (let i = 0; i < data.length; i++) {
				data[i] = (Math.random() * 2 - 1) * 0.3;
			}

			const noise = audioCtx.createBufferSource();
			noise.buffer = noiseBuffer;

			const bandpass = audioCtx.createBiquadFilter();
			bandpass.type = 'bandpass';
			bandpass.frequency.value = 200;
			bandpass.Q.value = 0.5;

			const gain = audioCtx.createGain();
			gain.gain.setValueAtTime(0.05, now);
			gain.gain.linearRampToValueAtTime(0.25, now + duration * 0.8);
			gain.gain.linearRampToValueAtTime(0.0, now + duration);

			noise.connect(bandpass);
			bandpass.connect(gain);
			gain.connect(audioCtx.destination);
			noise.start(now);
			noise.stop(now + duration);

			const cymbal = audioCtx.createOscillator();
			const cymbalGain = audioCtx.createGain();
			cymbal.type = 'triangle';
			cymbal.frequency.value = 800;
			cymbalGain.gain.setValueAtTime(0, now);
			cymbalGain.gain.setValueAtTime(0.15, now + duration - 0.05);
			cymbalGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);
			cymbal.connect(cymbalGain);
			cymbalGain.connect(audioCtx.destination);
			cymbal.start(now + duration - 0.05);
			cymbal.stop(now + duration + 0.5);
		} catch {
			// noop
		}
	}

	function handleReveal() {
		rolling = true;
		playDrumroll();
		setTimeout(() => {
			onreveal();
		}, 2800);
	}
</script>

<div class="mx-auto flex max-w-md flex-col items-center gap-8 p-6 text-center">
	<MissionTracker playerCount={players.length} {currentMission} {missionResults} />

	<div class="text-sm text-zinc-400">Mission {currentMission + 1}</div>

	{#if !rolling}
		<div class="flex flex-col items-center gap-6">
			<div class="text-xl font-semibold text-white">All votes are in.</div>
			<div class="text-sm text-zinc-400">Pass the phone back to the mission leader.</div>
			<button
				onclick={handleReveal}
				class="rounded-lg bg-amber-600 px-10 py-5 text-xl font-bold text-white transition hover:bg-amber-500"
			>
				Reveal Result
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-6">
			<div class="text-xl font-semibold text-zinc-300">Revealing...</div>

			<div class="relative flex h-32 w-32 items-center justify-center">
				<div class="absolute inset-0 animate-ping rounded-full bg-amber-500/20"></div>
				<div class="absolute inset-2 animate-pulse rounded-full bg-amber-500/10"></div>
				<div class="relative text-6xl" style="animation: flip 0.15s steps(1) infinite;">
					<span class="drumroll-icon">?</span>
				</div>
			</div>

			<div class="flex gap-1">
				{#each Array(3) as _, i}
					<div
						class="h-2 w-2 rounded-full bg-amber-400"
						style="animation: bounce 0.6s ease-in-out {i * 0.2}s infinite;"
					></div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes flip {
		0% {
			content: '?';
			transform: rotateY(0deg);
		}
		25% {
			transform: rotateY(90deg);
		}
		50% {
			transform: rotateY(180deg);
		}
		75% {
			transform: rotateY(270deg);
		}
		100% {
			transform: rotateY(360deg);
		}
	}
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
	.drumroll-icon {
		display: inline-block;
		animation: flip 0.3s linear infinite;
	}
</style>
