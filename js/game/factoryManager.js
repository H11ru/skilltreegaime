import * as GameState from '../core/gameState.js'; // Alias
import * as UIManager from '../ui/uiManager.js'; // Alias
import { publish } from '../core/eventBus.js'; // For notifying UI or other systems

export function getSingleFactoryCost() {
    return GameState.getFactoryCurrentCost();
}

export function buySingleFactory() {
    const cost = getSingleFactoryCost();
    const currentBP = GameState.getGameState().bp;

    if (currentBP >= cost) {
        if (GameState.spendBp(cost)) {
            GameState.addFactories(1);
            publish('gameStateChanged'); // General event, UIManager will listen
            return true;
        }
    }
    return false;
}

export function calculateBulkFactoryCost(amount) {
    let totalCost = 0;
    let tempFactoryCount = GameState.getGameState().factories;
    const baseCost = GameState.getGameState().factoryBaseCost;
    const multiplier = GameState.getGameState().factoryCostMultiplier;

    for (let i = 0; i < amount; i++) {
        totalCost += baseCost * Math.pow(multiplier, tempFactoryCount + i);
    }
    return totalCost;
}

export function buyBulkFactories() {
    const amount = GameState.getBulkBuyAmount();
    if (!amount || amount < 1) {
        console.warn("Invalid bulk buy amount:", amount);
        return false;
    }

    const totalCost = calculateBulkFactoryCost(amount);
    const currentBP = GameState.getGameState().bp;

    if (currentBP >= totalCost) {
        if (GameState.spendBp(totalCost)) {
            GameState.addFactories(amount);
            publish('gameStateChanged');
            return true;
        }
    }
    return false;
}
