<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		durationSeconds: number;
		key?: string;
	}

	let { durationSeconds, key = '' }: Props = $props();

	let remaining = $state(0);
	let expired = $state(false);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function start() {
		stop();
		remaining = durationSeconds;
		expired = false;
		intervalId = setInterval(() => {
			remaining--;
			if (remaining <= 0) {
				remaining = 0;
				expired = true;
				stop();
				playAlarm();
			}
		}, 1000);
	}

	function stop() {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function addTime(seconds: number) {
		remaining += seconds;
		if (expired) {
			expired = false;
			start();
		}
	}

	function playAlarm() {
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.frequency.value = 880;
			osc.type = 'square';
			gain.gain.value = 0.15;

			osc.start();
			// 3 short beeps: on-off-on-off-on-off
			gain.gain.setValueAtTime(0.15, ctx.currentTime);
			gain.gain.setValueAtTime(0, ctx.currentTime + 0.15);
			gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.3);
			gain.gain.setValueAtTime(0, ctx.currentTime + 0.45);
			gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.6);
			gain.gain.setValueAtTime(0, ctx.currentTime + 0.75);
			osc.stop(ctx.currentTime + 0.8);
		} catch {
			// noop — audio may be unavailable
		}
	}

	function formatTime(s: number): string {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	$effect(() => {
		void key;
		void durationSeconds;
		remaining = durationSeconds;
		expired = false;
		start();
	});

	onDestroy(stop);
</script>

<div class="flex items-center gap-3">
	<div
		class="font-mono text-2xl font-bold tabular-nums
			{expired ? 'animate-pulse text-red-400' : remaining <= 10 ? 'text-amber-400' : 'text-zinc-300'}"
	>
		{formatTime(remaining)}
	</div>

	<div class="flex gap-1.5">
		<button
			onclick={() => addTime(30)}
			class="rounded-md bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-600"
		>
			+30s
		</button>
		<button
			onclick={() => addTime(60)}
			class="rounded-md bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-600"
		>
			+1m
		</button>
	</div>
</div>
