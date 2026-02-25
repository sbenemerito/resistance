<script lang="ts">
	import { GAME_CONFIGS } from '$lib/types.js';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	const playerCounts = [5, 6, 7, 8, 9, 10] as const;
</script>

<div
	class="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
>
	<div
		class="flex max-h-dvh w-full max-w-md flex-col bg-zinc-900"
		transition:fly={{ y: 40, duration: 300 }}
	>
		<div class="flex shrink-0 items-center justify-between border-b border-zinc-700/50 px-6 py-4">
			<h2 class="text-lg font-bold text-white">How to play</h2>
			<button
				onclick={onclose}
				class="rounded-lg px-2 py-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white cursor-pointer"
				aria-label="Close"
			>
				&#x2715;
			</button>
		</div>

		<div class="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
			<div class="flex flex-col gap-6">
				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">Overview</h3>
					<p class="text-sm leading-relaxed text-zinc-400">
						The Resistance is a social deduction game for 5-10 players. Resistance members try to
						complete missions successfully. Spies try to sabotage them without being discovered.
					</p>
				</section>

				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">Roles</h3>
					<div class="flex flex-col gap-2">
						<div class="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5">
							<span class="text-sm font-medium text-blue-400">Resistance</span>
							<span class="text-sm text-zinc-400"> - the majority. Complete missions to win. </span>
						</div>
						<div class="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5">
							<span class="text-sm font-medium text-blue-400">Resistance Leader</span>
							<span class="text-sm text-zinc-400">
								- a special resistance member (1 per game) who knows who the spies are. Keep your
								identity secret.
							</span>
						</div>
						<div class="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5">
							<span class="text-sm font-medium text-red-400">Spies</span>
							<span class="text-sm text-zinc-400">
								- the minority. Sabotage missions and stay hidden.
							</span>
						</div>
					</div>
				</section>

				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">
						Game Flow
					</h3>
					<ol class="flex flex-col gap-2.5 text-sm leading-relaxed text-zinc-400">
						<li class="flex gap-2.5">
							<span class="shrink-0 font-medium text-zinc-300">1.</span>
							<span>
								A rotating <strong class="font-medium text-zinc-300">Mission Leader</strong>
								(different from the
								<strong class="font-medium text-zinc-300">Resistance Leader</strong>) picks a team
								for the mission. The leader cannot include themselves.
							</span>
						</li>
						<li class="flex gap-2.5">
							<span class="shrink-0 font-medium text-zinc-300">2.</span>
							<span>
								All players <strong class="font-medium text-zinc-300">vote</strong> to approve or reject
								the proposed team.
							</span>
						</li>
						<li class="flex gap-2.5">
							<span class="shrink-0 font-medium text-zinc-300">3.</span>
							<span>
								If <strong class="font-medium text-zinc-300">approved</strong>: team members
								secretly vote to pass or fail the mission. All resistance members should normally
								vote to pass, and only spies should vote to fail, except for very rare situations.
							</span>
						</li>
						<li class="flex gap-2.5">
							<span class="shrink-0 font-medium text-zinc-300">4.</span>
							<span>
								If <strong class="font-medium text-zinc-300">rejected</strong>: leadership rotates
								and a new team is proposed. 5 rejections in a row means spies win automatically.
							</span>
						</li>
					</ol>
				</section>

				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">
						Mission Results
					</h3>
					<ul class="flex flex-col gap-1.5 text-sm leading-relaxed text-zinc-400">
						<li class="flex gap-2">
							<span class="shrink-0 text-zinc-500">&bull;</span>
							<span
								>Usually <strong class="font-medium text-zinc-300">1 fail vote</strong> is enough to fail
								a mission.</span
							>
						</li>
						<li class="flex gap-2">
							<span class="shrink-0 text-zinc-500">&bull;</span>
							<span>
								Exception: <strong class="font-medium text-zinc-300">Mission 4</strong> with 7+
								players requires <strong class="font-medium text-zinc-300">2 fail votes</strong>.
							</span>
						</li>
					</ul>
				</section>

				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">Winning</h3>
					<div class="flex flex-col gap-2">
						<div
							class="rounded-lg border border-blue-900/40 bg-blue-950/20 px-3 py-2.5 text-sm text-zinc-400"
						>
							<strong class="font-medium text-blue-400">Resistance wins</strong> if they complete 3 of
							5 missions - but spies get a last chance to guess the Resistance Leader. If correct, spies
							steal the win.
						</div>
						<div
							class="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2.5 text-sm text-zinc-400"
						>
							<strong class="font-medium text-red-400">Spies win</strong> if they fail 3 missions, or
							if 5 team proposals are rejected in a row.
						</div>
					</div>
				</section>

				<section>
					<h3 class="mb-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">
						Team Sizes by Player Count
					</h3>
					<div class="overflow-x-auto rounded-lg border border-zinc-700/50">
						<table class="w-full text-xs">
							<thead>
								<tr class="border-b border-zinc-700/50 bg-zinc-800/50">
									<th class="px-2 py-2 text-left font-medium text-zinc-400">Players</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">Spies</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">M1</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">M2</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">M3</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">M4*</th>
									<th class="px-2 py-2 text-center font-medium text-zinc-400">M5</th>
								</tr>
							</thead>
							<tbody>
								{#each playerCounts as count}
									{@const config = GAME_CONFIGS[count]}
									<tr class="border-b border-zinc-700/30 last:border-0">
										<td class="px-2 py-1.5 font-medium text-zinc-300">{count}</td>
										<td class="px-2 py-1.5 text-center text-red-400">{config.spyCount}</td>
										{#each config.missionSizes as size}
											<td class="px-2 py-1.5 text-center text-zinc-400">{size}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<p class="mt-1.5 text-xs text-zinc-500">*M4 requires 2 fail votes with 7+ players</p>
				</section>
			</div>
		</div>

		<div class="flex shrink-0 flex-col gap-2 border-t border-zinc-700/50 px-6 py-4">
			<button
				onclick={onclose}
				class="w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700 cursor-pointer"
			>
				Got it
			</button>
			<a
				href="https://en.wikipedia.org/wiki/The_Resistance_(game)"
				target="_blank"
				rel="noopener noreferrer"
				class="block w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-300"
			>
				Read more on Wikipedia
			</a>
		</div>
	</div>
</div>
