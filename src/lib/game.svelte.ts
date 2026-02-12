import {
	type GameState,
	type Player,
	type Role,
	type MissionResult,
	type RejectedTeam,
	type TimerConfig,
	DEFAULT_TIMER_CONFIG,
	GAME_CONFIGS,
	failsRequired
} from './types.js';

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function createInitialState(): GameState {
	return {
		phase: 'lobby',
		players: [],
		timerEnabled: false,
		timerConfig: { ...DEFAULT_TIMER_CONFIG },
		revealIndex: 0,
		currentMission: 0,
		missionResults: [],
		leaderIndex: 0,
		selectedTeam: [],
		rejectedTeams: [],
		currentVoterIndex: 0,
		currentMissionVotes: [],
		resistanceWins: 0,
		spyWins: 0,
		winner: null
	};
}

function assignRoles(names: string[]): Player[] {
	const config = GAME_CONFIGS[names.length];
	if (!config) throw new Error(`Unsupported player count: ${names.length}`);

	const roles: Role[] = [
		'resistance-leader',
		...Array(names.length - 1 - config.spyCount).fill('resistance' as Role),
		...Array(config.spyCount).fill('spy' as Role)
	];

	const shuffledRoles = shuffle(roles);
	return names.map((name, i) => ({ id: i, name, role: shuffledRoles[i] }));
}

export function createGame() {
	let state = $state<GameState>(createInitialState());
	let lastPlayerNames = $state<string[]>([]);

	function currentConfig() {
		return GAME_CONFIGS[state.players.length];
	}

	function requiredTeamSize(): number {
		return currentConfig().missionSizes[state.currentMission];
	}

	function spies(): Player[] {
		return state.players.filter((p) => p.role === 'spy');
	}

	function leader(): Player {
		return state.players[state.leaderIndex];
	}

	function resistanceLeader(): Player | undefined {
		return state.players.find((p) => p.role === 'resistance-leader');
	}

	return {
		get state() {
			return state;
		},

		get lastPlayerNames() {
			return lastPlayerNames;
		},

		get currentConfig() {
			return currentConfig();
		},

		get requiredTeamSize() {
			return requiredTeamSize();
		},

		get spies() {
			return spies();
		},

		get leader() {
			return leader();
		},

		get resistanceLeader() {
			return resistanceLeader();
		},

		startGame(names: string[], timerEnabled: boolean) {
			lastPlayerNames = [...names];
			state = createInitialState();
			state.players = assignRoles(names);
			state.timerEnabled = timerEnabled;
			state.leaderIndex = Math.floor(Math.random() * names.length);
			state.phase = 'role-reveal';
		},

		confirmReveal() {
			state.revealIndex++;
			if (state.revealIndex >= state.players.length) {
				state.phase = 'team-selection';
			}
		},

		get rejectedTeams(): RejectedTeam[] {
			return state.rejectedTeams;
		},

		isTeamAlreadyRejected(playerIds: number[]): boolean {
			const sorted = [...playerIds].sort((a, b) => a - b);
			return state.rejectedTeams.some((rt) => {
				const prev = [...rt.playerIds].sort((a, b) => a - b);
				return prev.length === sorted.length && prev.every((id, i) => id === sorted[i]);
			});
		},

		selectTeam(playerIds: number[]) {
			if (playerIds.length !== requiredTeamSize()) return;
			if (playerIds.includes(leader().id)) return;
			if (this.isTeamAlreadyRejected(playerIds)) return;
			state.selectedTeam = playerIds;
			state.phase = 'team-approval';
		},

		approveTeam() {
			state.currentVoterIndex = 0;
			state.currentMissionVotes = [];
			state.phase = 'mission-vote';
		},

		rejectTeam() {
			state.rejectedTeams = [
				...state.rejectedTeams,
				{ leaderIndex: state.leaderIndex, playerIds: [...state.selectedTeam] }
			];
			state.leaderIndex = (state.leaderIndex + 1) % state.players.length;
			state.selectedTeam = [];
			state.phase = 'team-selection';
		},

		submitVote(pass: boolean) {
			const voterId = state.selectedTeam[state.currentVoterIndex];
			state.currentMissionVotes = [...state.currentMissionVotes, { playerId: voterId, pass }];
			state.currentVoterIndex++;

			if (state.currentVoterIndex >= state.selectedTeam.length) {
				state.phase = 'mission-reveal';
			}
		},

		revealMissionResult() {
			const fails = state.currentMissionVotes.filter((v) => !v.pass).length;
			const needed = failsRequired(state.players.length, state.currentMission);
			const passed = fails < needed;

			const result: MissionResult = {
				missionIndex: state.currentMission,
				teamPlayerIds: [...state.selectedTeam],
				votes: [...state.currentMissionVotes],
				passed
			};

			state.missionResults = [...state.missionResults, result];

			if (passed) {
				state.resistanceWins++;
			} else {
				state.spyWins++;
			}

			state.phase = 'mission-result';
		},

		proceedFromResult() {
			if (state.resistanceWins >= 3) {
				state.phase = 'spy-guess';
				return;
			}

			if (state.spyWins >= 3) {
				state.winner = 'spies';
				state.phase = 'game-over';
				return;
			}

			state.currentMission++;
			state.leaderIndex = (state.leaderIndex + 1) % state.players.length;
			state.selectedTeam = [];
			state.rejectedTeams = [];
			state.currentVoterIndex = 0;
			state.currentMissionVotes = [];
			state.phase = 'team-selection';
		},

		submitSpyGuess(guessedPlayerId: number) {
			const rl = resistanceLeader();
			if (!rl) return;

			state.winner = guessedPlayerId === rl.id ? 'spies' : 'resistance';
			state.phase = 'game-over';
		},

		resetToLobby() {
			state = createInitialState();
		},

		clearNames() {
			lastPlayerNames = [];
		}
	};
}
