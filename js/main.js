import { cacheElements, elements as UIElements } from './ui/domElements.js'; // Import cached elements
import * as UIManager from './ui/uiManager.js';
import * as GameState from './core/gameState.js';
import * as PassiveIncome from './game/passiveIncome.js';
import * as GameLogic from './game/gameLogic.js'; // Import the game logic module

function initialHideElements() {
    // Based on original inline styles and game logic
    UIManager.hideElement(UIElements.h1Upgrade);
    UIManager.hideElement(UIElements.subheading);
    UIManager.hideElement(UIElements.darkModeButton);
    UIManager.hideElement(UIElements.bulkBuyButton);
    UIManager.hideElement(UIElements.bulkAmountInput);
    UIManager.hideElement(UIElements.factoryCountDisplay);
}


function initGame() {
    console.log("Initializing Skill Tree Game...");
    cacheElements(); // Cache DOM elements first
    // GameState.loadState(); // Implement and call if you have save/load

    initialHideElements(); // Set initial visibility based on game start

    UIManager.setupEventListeners(GameLogic); // Pass GameLogic to UIManager for wiring up

    UIManager.updateUI(); // Initial UI render based on default/loaded state
    PassiveIncome.startPassiveIncome();

    console.log("Game Initialized and Running.");
    // console.log("Initial Game State:", GameState.getGameState());
    // console.log("Cached DOM Elements:", UIElements);
}

// Start the game once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
