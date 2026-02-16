export type Role = 'resistance-leader' | 'resistance' | 'spy';

export type Phase =
	| 'lobby'
	| 'role-reveal'
	| 'team-selection'
	| 'team-approval'
	| 'mission-vote'
	| 'mission-reveal'
	| 'mission-result'
	| 'spy-guess'
	| 'game-over';

export interface RejectedTeam {
	leaderIndex: number;
	playerIds: number[];
}

export interface Player {
	id: number;
	name: string;
	role: Role;
}

export interface MissionResult {
	missionIndex: number;
	teamPlayerIds: number[];
	votes: { playerId: number; pass: boolean }[];
	passed: boolean;
}

export interface TimerConfig {
	teamSelectionSeconds: number;
	teamApprovalSeconds: number;
	missionVoteSeconds: number;
	spyGuessSeconds: number;
}

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
	teamSelectionSeconds: 120,
	teamApprovalSeconds: 60,
	missionVoteSeconds: 30,
	spyGuessSeconds: 180
};

export interface GameState {
	phase: Phase;
	players: Player[];
	timerEnabled: boolean;
	timerConfig: TimerConfig;

	// Role reveal
	revealIndex: number;

	// Missions
	currentMission: number; // 0-4
	missionResults: MissionResult[];
	leaderIndex: number; // index into players[] — rotates clockwise
	selectedTeam: number[]; // player ids chosen for current mission
	rejectedTeams: RejectedTeam[]; // rejected proposals for current mission
	currentVoterIndex: number; // index into selectedTeam[]
	currentMissionVotes: { playerId: number; pass: boolean }[];

	// Scoreboard
	resistanceWins: number;
	spyWins: number;

	// Final outcome
	winner: 'resistance' | 'spies' | null;
}

/**
 * Standard Resistance player-count configs.
 * [spyCount, ...missionTeamSizes]
 * Mission 4 (index 3) requires 2 fails for 7+ players.
 */
export const GAME_CONFIGS: Record<number, { spyCount: number; missionSizes: number[] }> = {
	5: { spyCount: 2, missionSizes: [2, 3, 2, 3, 3] },
	6: { spyCount: 2, missionSizes: [2, 3, 4, 3, 4] },
	7: { spyCount: 3, missionSizes: [2, 3, 3, 4, 4] },
	8: { spyCount: 3, missionSizes: [3, 4, 4, 5, 5] },
	9: { spyCount: 3, missionSizes: [3, 4, 4, 5, 5] },
	10: { spyCount: 4, missionSizes: [3, 4, 4, 5, 5] }
};

/** After this many consecutive rejected proposals in a single mission, spies win. */
export const MAX_REJECTED_PROPOSALS = 5;

/** Mission 4 (index 3) requires 2 fails for spy win when 7+ players */
export function failsRequired(playerCount: number, missionIndex: number): number {
	if (missionIndex === 3 && playerCount >= 7) return 2;
	return 1;
}

/** Compute C(n, k) — the number of ways to choose k items from n. */
export function combinations(n: number, k: number): number {
	if (k > n || k < 0) return 0;
	if (k === 0 || k === n) return 1;
	if (k > n - k) k = n - k;
	let result = 1;
	for (let i = 0; i < k; i++) {
		result = Math.round((result * (n - i)) / (i + 1));
	}
	return result;
}
