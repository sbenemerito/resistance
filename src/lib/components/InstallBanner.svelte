<script lang="ts">
	let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let isIos = $state(false);
	let isStandalone = $state(false);
	let dismissed = $state(false);

	$effect(() => {
		isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			('standalone' in navigator && (navigator as { standalone: boolean }).standalone);

		isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
		};

		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	async function install() {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') dismissed = true;
		deferredPrompt = null;
	}

	const showBanner = $derived(!isStandalone && !dismissed && (deferredPrompt || isIos));
</script>

{#if showBanner}
	<div class="relative rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3">
		<button
			onclick={() => (dismissed = true)}
			class="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300"
			aria-label="Dismiss"
		>
			✕
		</button>

		{#if deferredPrompt}
			<p class="pr-6 text-sm text-zinc-300">Install for offline play — no internet needed.</p>
			<button
				onclick={install}
				class="mt-2 rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-600"
			>
				Install App
			</button>
		{:else if isIos}
			<p class="pr-6 text-sm text-zinc-300">
				To play offline, tap
				<svg
					class="inline-block h-4 w-4 align-text-bottom"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
					<polyline points="16 6 12 2 8 6" />
					<line x1="12" y1="2" x2="12" y2="15" />
				</svg>
				then <strong class="text-white">Add to Home Screen</strong>.
			</p>
		{/if}
	</div>
{/if}
