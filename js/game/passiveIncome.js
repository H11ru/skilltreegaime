import * as GameState from '../core/gameState.js'; // Alias
import { publish } from '../core/eventBus.js';
import { debounce } from '../core/utils.js';

let gameLoopInterval = null;

// Debounce the publish event to avoid flooding if interval is very short
// or if multiple quick state changes happen.
const debouncedPublishStateChange = debounce(() => publish('gameStateChanged'), 100);


export function startPassiveIncome() {
    if (gameLoopInterval) return; // Already running

    gameLoopInterval = setInterval(() => {
        const currentGameState = GameState.getGameState();
        if (currentGameState.factories > 0) {
            const bpsEarned = currentGameState.factories * currentGameState.passiveBpsPerFactory;
            if (bpsEarned > 0) {
                GameState.addBp(bpsEarned);
                debouncedPublishStateChange(); // Publish event, UI manager will update
            }
        }
    }, 1000);
    // console.log("Passive income started.");
}

export function stopPassiveIncome() {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
    // console.log("Passive income stopped.");
}
