import * as GameState from '../core/gameState.js'; // Alias
import { upgrades as upgradeDataDefinitions } from './upgrades.js';
import { publish } from '../core/eventBus.js';

export function attemptPurchaseUpgrade(upgradeButtonId) {
    // Find the upgrade definition by its button ID
    const upgradeKey = Object.keys(upgradeDataDefinitions).find(
        key => upgradeDataDefinitions[key].id === upgradeButtonId
    );

    if (!upgradeKey) {
        console.error(`Upgrade definition not found for button ID: ${upgradeButtonId}`);
        return false;
    }

    const upgrade = upgradeDataDefinitions[upgradeKey];
    const currentGameState = GameState.getGameState();
    const cost = upgrade.cost(currentGameState); // Calculate cost based on current state

    let canAfford = currentGameState.bp >= cost;
    let prerequisitesMet = upgrade.prerequisites ? upgrade.prerequisites(currentGameState) : true;
    let isAlreadyPurchased = upgrade.isPurchased ? upgrade.isPurchased(currentGameState) : false;
    // isAvailable flag from upgrade definition combines multiple checks
    let isGenerallyAvailable = upgrade.isAvailable ? upgrade.isAvailable(currentGameState) : true;


    if (canAfford && prerequisitesMet && !isAlreadyPurchased && isGenerallyAvailable) {
        if (GameState.spendBp(cost)) {
            upgrade.onPurchase(currentGameState); // Pass current state, onPurchase uses services inside
            publish('gameStateChanged'); // Notify UI and other systems
            return true;
        }
    } else {
        // console.log(`Cannot purchase ${upgradeButtonId}. Afford: ${canAfford}, Prereq: ${prerequisitesMet}, Purchased: ${isAlreadyPurchased}, Available: ${isGenerallyAvailable}`);
    }
    return false;
}
