import * as GameState from '../core/gameState.js'; // Use an alias for clarity
import * as UIManager from '../ui/uiManager.js'; // Alias for clarity
import { formatNumber } from '../core/utils.js';

export const UPGRADE_TYPES = {
    ONE_TIME: 'one_time', // Button removed or permanently disabled after purchase
    FLAG_TOGGLE: 'flag_toggle', // Toggles a boolean state, button might change text/state
    // REPEATABLE: 'repeatable' // This is more for factories, handled separately
};

// Service object to pass to onPurchase methods
const services = {
    gameState: GameState,
    uiManager: UIManager,
    // No eventBus needed here if gameState and uiManager handle updates
};

export const upgrades = {
    // Matches button ID in HTML
    gain1BP: {
        id: 'gain1BPButton', // This is the ID of the button in domElements.js
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 0, // Dynamic cost if needed, here it's fixed
        textTemplate: (costVal, state) => `Gain 1 BP (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasGained1BP,
        isPurchased: (state) => state.flags.hasGained1BP,
        onPurchase: (currentState) => {
            services.gameState.addBp(1);
            services.gameState.setFlag('hasGained1BP', true);
        },
    },
    changeTitleButton: {
        id: 'changeTitleButton',
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 1.5,
        textTemplate: (costVal, state) => `Window title (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasTitleUpgrade,
        isPurchased: (state) => state.flags.hasTitleUpgrade,
        onPurchase: (currentState) => {
            document.title = "Skill Tree Ultra Deluxe";
            services.gameState.setFlag('hasTitleUpgrade', true);
        },
    },
    purchaseCSSButton: {
        id: 'purchaseCSSButton',
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 10,
        textTemplate: (costVal, state) => `Purchase CSS (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasCSS,
        isPurchased: (state) => state.flags.hasCSS,
        onPurchase: (currentState) => {
            services.uiManager.applyGameStyles();
            services.gameState.setFlag('hasCSS', true);
            services.uiManager.showElement(services.uiManager.elements.darkModeButton); // Show by instance
            // Original code also changed buyFactory width, can be done via UIManager if needed:
            // services.uiManager.setElementStyle(services.uiManager.elements.buyFactoryButton, 'width', '250px');
            // However, this is better handled by CSS rules within .has-css context
        },
    },
    buyCounterButton: {
        id: 'buyCounterButton',
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 3,
        textTemplate: (costVal, state) => `Purchase Factory Counter (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasCounter,
        isPurchased: (state) => state.flags.hasCounter,
        onPurchase: (currentState) => {
            services.gameState.setFlag('hasCounter', true);
            services.uiManager.showElement(services.uiManager.elements.factoryCountDisplay);
        },
    },
    purchaseH1Button: {
        id: 'purchaseH1Button',
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 2,
        textTemplate: (costVal, state) => `Purchase Headings (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasH1,
        isPurchased: (state) => state.flags.hasH1,
        onPurchase: (currentState) => {
            services.gameState.setFlag('hasH1', true);
            services.uiManager.showElement(services.uiManager.elements.h1Upgrade);
            services.uiManager.showElement(services.uiManager.elements.subheading);
        },
    },
    darkModeButton: {
        id: 'darkModeButton',
        type: UPGRADE_TYPES.ONE_TIME, // Or FLAG_TOGGLE if it can be turned off
        cost: (state) => 5,
        textTemplate: (costVal, state) => `Dark Mode (${formatNumber(costVal, 2)} BP)`,
        prerequisites: (state) => state.flags.hasCSS, // Example prerequisite
        isAvailable: (state) => state.flags.hasCSS && !state.flags.hasDarkMode,
        isPurchased: (state) => state.flags.hasDarkMode,
        onPurchase: (currentState) => {
            services.uiManager.enableDarkMode();
            services.gameState.setFlag('hasDarkMode', true);
        },
    },
    bulkPurchaserButton: {
        id: 'bulkPurchaserButton',
        type: UPGRADE_TYPES.ONE_TIME,
        cost: (state) => 50,
        textTemplate: (costVal, state) => `Purchase Bulk Buy (${formatNumber(costVal, 2)} BP)`,
        isAvailable: (state) => !state.flags.hasBulkPurchaser,
        isPurchased: (state) => state.flags.hasBulkPurchaser,
        onPurchase: (currentState) => {
            services.gameState.setFlag('hasBulkPurchaser', true);
            services.uiManager.showElement(services.uiManager.elements.bulkAmountInput);
            services.uiManager.showElement(services.uiManager.elements.bulkBuyButton);
        },
    },
};
