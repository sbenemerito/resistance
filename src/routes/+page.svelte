<script lang="ts">
	import { createGame } from '$lib/game.svelte.js';
	import Lobby from '$lib/components/Lobby.svelte';
	import RoleReveal from '$lib/components/RoleReveal.svelte';
	import TeamSelection from '$lib/components/TeamSelection.svelte';
	import MissionVote from '$lib/components/MissionVote.svelte';
	import MissionResultScreen from '$lib/components/MissionResultScreen.svelte';
	import SpyGuess from '$lib/components/SpyGuess.svelte';
	import GameOver from '$lib/components/GameOver.svelte';

	const game = createGame();

	const currentVoter = $derived(
		game.state.phase === 'mission-vote'
			? game.state.players.find(
					(p) => p.id === game.state.selectedTeam[game.state.currentVoterIndex]
				)
			: null
	);

	const lastResult = $derived(
		game.state.missionResults.length > 0
			? game.state.missionResults[game.state.missionResults.length - 1]
			: null
	);

	const spyGuessCorrect = $derived(game.state.winner === 'spies' && game.state.resistanceWins >= 3);
</script>

<div class="flex min-h-dvh flex-col bg-zinc-900">
	{#if game.state.phase === 'lobby'}
		<Lobby onstart={(names) => game.startGame(names)} />
	{:else if game.state.phase === 'role-reveal'}
		<RoleReveal
			players={game.state.players}
			revealIndex={game.state.revealIndex}
			onconfirm={() => game.confirmReveal()}
		/>
	{:else if game.state.phase === 'team-selection'}
		<TeamSelection
			players={game.state.players}
			leader={game.leader}
			currentMission={game.state.currentMission}
			missionResults={game.state.missionResults}
			requiredSize={game.requiredTeamSize}
			onselect={(ids) => game.selectTeam(ids)}
		/>
	{:else if game.state.phase === 'mission-vote' && currentVoter}
		<MissionVote
			voter={currentVoter}
			voterIndex={game.state.currentVoterIndex}
			totalVoters={game.state.selectedTeam.length}
			onvote={(pass) => game.submitVote(pass)}
		/>
	{:else if game.state.phase === 'mission-result' && lastResult}
		<MissionResultScreen
			players={game.state.players}
			currentMission={lastResult.missionIndex}
			missionResults={game.state.missionResults}
			votes={lastResult.votes}
			teamPlayerIds={lastResult.teamPlayerIds}
			passed={lastResult.passed}
			resistanceWins={game.state.resistanceWins}
			spyWins={game.state.spyWins}
			onproceed={() => game.proceedFromResult()}
		/>
	{:else if game.state.phase === 'spy-guess'}
		<SpyGuess
			players={game.state.players}
			spies={game.spies}
			spyGuesses={game.state.spyGuesses}
			onguess={(spyId, guessedId) => game.submitSpyGuess(spyId, guessedId)}
			onfinalize={() => game.finalizeSpyGuess()}
		/>
	{:else if game.state.phase === 'game-over' && game.state.winner}
		<GameOver
			players={game.state.players}
			winner={game.state.winner}
			missionResults={game.state.missionResults}
			resistanceWins={game.state.resistanceWins}
			spyWins={game.state.spyWins}
			{spyGuessCorrect}
			onreset={() => game.reset()}
		/>
	{/if}
</div>
