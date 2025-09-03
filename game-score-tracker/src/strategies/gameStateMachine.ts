import { Player, GameSettings } from '@/store/gameStore'

export type GameStatus = 'setup' | 'playing' | 'finished'

export interface GameStateContext {
	players: Player[]
	gameSettings: GameSettings
	currentRound: number
}

export interface GameStateTransition {
	canTransition(context: GameStateContext): boolean
	execute(context: GameStateContext): GameStatus
}

export class SetupToPlayingTransition implements GameStateTransition {
	canTransition(context: GameStateContext): boolean {
		return context.players.length >= 2
	}

	execute(context: GameStateContext): GameStatus {
		return this.canTransition(context) ? 'playing' : 'setup'
	}
}

export class PlayingToFinishedTransition implements GameStateTransition {
	canTransition(context: GameStateContext): boolean {
		const { players, gameSettings, currentRound } = context
		const { gameMode, gameType, maxRounds } = gameSettings

		if (gameMode === 'points-based') {
			// Points-based: End when only one player left or all eliminated
			const activePlayers = players.filter(p => !p.isEliminated)
			return activePlayers.length <= 1
		} else if (gameMode === 'rounds-based') {
			// Rounds-based: End when max rounds reached
			const targetRounds = gameType === 'secret-7' ? 7 : (maxRounds || 7)
			return currentRound > targetRounds
		}

		return false
	}

	execute(context: GameStateContext): GameStatus {
		return this.canTransition(context) ? 'finished' : 'playing'
	}
}

export class FinishedToSetupTransition implements GameStateTransition {
	canTransition(): boolean {
		// Can always reset from finished to setup
		return true
	}

	execute(): GameStatus {
		return 'setup'
	}
}

export class PlayingToSetupTransition implements GameStateTransition {
	canTransition(): boolean {
		// Can always pause from playing to setup
		return true
	}

	execute(): GameStatus {
		return 'setup'
	}
}

export class GameStateMachine {
	private transitions: Map<string, GameStateTransition> = new Map()

	constructor() {
		this.transitions.set('setup->playing', new SetupToPlayingTransition())
		this.transitions.set('playing->finished', new PlayingToFinishedTransition())
		this.transitions.set('finished->setup', new FinishedToSetupTransition())
		this.transitions.set('playing->setup', new PlayingToSetupTransition())
	}

	canTransition(from: GameStatus, to: GameStatus, context: GameStateContext): boolean {
		const key = `${from}->${to}`
		const transition = this.transitions.get(key)
		return transition ? transition.canTransition(context) : false
	}

	transition(from: GameStatus, to: GameStatus, context: GameStateContext): GameStatus {
		const key = `${from}->${to}`
		const transition = this.transitions.get(key)
		return transition ? transition.execute(context) : from
	}

	// Helper method to determine next state after round completion
	getNextStateAfterRound(context: GameStateContext): GameStatus {
		const playingToFinished = this.transitions.get('playing->finished')!
		return playingToFinished.execute(context)
	}

	// Helper method to start game
	startGame(context: GameStateContext): GameStatus {
		const setupToPlaying = this.transitions.get('setup->playing')!
		return setupToPlaying.execute(context)
	}

	// Helper method to reset game
	resetGame(): GameStatus {
		return 'setup'
	}

	// Helper method to pause game
	pauseGame(): GameStatus {
		return 'setup'
	}
}

// Singleton instance
export const gameStateMachine = new GameStateMachine()
