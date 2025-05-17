import { elements } from './domElements.js';
import * as GameState from '../core/gameState.js'; // Alias
import { upgrades as upgradeDataDefinitions, UPGRADE_TYPES } from '../game/upgrades.js';
import * as FactoryManager from '../game/factoryManager.js'; // Alias
import { formatNumber, debounce } from '../core/utils.js';
import { subscribe } from '../core/eventBus.js';

// --- Helper: Get Element Instance ---
function getElement(elementIdOrInstance) {
    if (typeof elementIdOrInstance === 'string') {
        // Attempt to find it in cached elements first
        const cachedEl = Object.values(elements).find(el => el && el.id === elementIdOrInstance);
        if (cachedEl) return cachedEl;
        return document.getElementById(elementIdOrInstance); // Fallback
    }
    return elementIdOrInstance; // Assume it's already an element instance
}

// --- Update Functions ---
function updateBpDisplay() {
    if (elements.bpDisplay) {
        elements.bpDisplay.textContent = formatNumber(GameState.getGameState().bp, 2);
    }
}

function updateFactoryCountDisplay() {
    const currentGameState = GameState.getGameState();
    if (elements.factoryCountDisplay) {
        if (currentGameState.flags.hasCounter) {
            elements.factoryCountDisplay.textContent = `Bapploid Factories: ${currentGameState.factories}`;
            showElement(elements.factoryCountDisplay);
        } else {
            hideElement(elements.factoryCountDisplay);
        }
    }
}

function updateGenericUpgradeButton(buttonElement, upgradeConfig) {
    if (!buttonElement || !upgradeConfig) return;

    const currentGameState = GameState.getGameState();
    const cost = upgradeConfig.cost(currentGameState); // cost is a function in new structure

    buttonElement.textContent = upgradeConfig.textTemplate(cost, currentGameState);

    let canAfford = currentGameState.bp >= cost;
    let prerequisitesMet = upgradeConfig.prerequisites ? upgradeConfig.prerequisites(currentGameState) : true;
    let isAlreadyPurchased = upgradeConfig.isPurchased ? upgradeConfig.isPurchased(currentGameState) : false;
    let isGenerallyAvailable = upgradeConfig.isAvailable ? upgradeConfig.isAvailable(currentGameState) : true;


    buttonElement.disabled = !(canAfford && prerequisitesMet && !isAlreadyPurchased && isGenerallyAvailable);

    if (isAlreadyPurchased) {
        if (upgradeConfig.type === UPGRADE_TYPES.ONE_TIME) {
            hideElement(buttonElement); // Hide one-time purchases
        } else {
            // For other types, could change text to "Purchased" or just keep disabled
            buttonElement.textContent = `${upgradeConfig.textTemplate(cost, currentGameState)} (Purchased)`;
        }
    } else {
        // Ensure button is visible if not purchased and should be (respecting initial hide logic)
        // This logic might need refinement based on how initial visibility is handled for complex cases
        if (buttonElement !== elements.darkModeButton || currentGameState.flags.hasCSS) {
             showElement(buttonElement); // Default to show unless it's a special case like darkMode
        }
        if (buttonElement === elements.darkModeButton && !currentGameState.flags.hasCSS) {
            hideElement(buttonElement); // Ensure dark mode button is hidden if CSS not purchased
        }
    }
}


function updateFactoryActionButtons() {
    const currentGameState = GameState.getGameState();
    // Single Factory Button
    if (elements.buyFactoryButton) {
        const cost = FactoryManager.getSingleFactoryCost();
        elements.buyFactoryButton.textContent = `Create Bapploid Factory (${formatNumber(cost, 2)} BP)`;
        elements.buyFactoryButton.disabled = currentGameState.bp < cost;
    }

    // Bulk Factory Button & Input
    if (elements.bulkAmountInput && elements.bulkBuyButton) {
        if (currentGameState.flags.hasBulkPurchaser) {
            showElement(elements.bulkAmountInput);
            showElement(elements.bulkBuyButton);

            // Ensure input reflects current game state for bulk amount
            elements.bulkAmountInput.value = GameState.getBulkBuyAmount();

            const amount = GameState.getBulkBuyAmount(); // Use validated amount from gameState
            const cost = FactoryManager.calculateBulkFactoryCost(amount);
            elements.bulkBuyButton.textContent = `Buy ${amount}x Factories (${formatNumber(cost, 2)} BP)`;
            elements.bulkBuyButton.disabled = currentGameState.bp < cost || amount < 1;
        } else {
            hideElement(elements.bulkAmountInput);
            hideElement(elements.bulkBuyButton);
        }
    }
}

// --- UI State Changers ---
export function showElement(elementIdOrInstance) {
    const el = getElement(elementIdOrInstance);
    if (el) {
        // Respect original display style if known, otherwise default to 'block' or 'flex'
        const originalDisplay = el.dataset.originalDisplay || (el.tagName === 'INPUT' || el.tagName === 'BUTTON' ? 'inline-block' : 'block');
        el.style.display = originalDisplay;
    }
}

export function hideElement(elementIdOrInstance) {
    const el = getElement(elementIdOrInstance);
    if (el) {
        if (!el.dataset.originalDisplay && el.style.display !== 'none') {
            el.dataset.originalDisplay = el.style.display; // Store original display style
        }
        el.style.display = 'none';
    }
}

export function applyGameStyles() {
    document.body.classList.add('has-css');
    // Re-evaluate visibility of elements that depend on .has-css for styling
    updateUI();
}

export function enableDarkMode() {
    document.documentElement.style.setProperty('--bg-color', '#222');
    document.documentElement.style.setProperty('--text-color', '#fff');
}

// --- Main Update Function ---
export function updateUI() {
    // console.log("Updating UI...");
    updateBpDisplay();
    updateFactoryCountDisplay();

    // Update generic upgrade buttons
    Object.values(upgradeDataDefinitions).forEach(upgradeConfig => {
        const buttonElement = getElement(upgradeConfig.id); // upgradeConfig.id is the button's actual DOM ID
        if (buttonElement) {
            updateGenericUpgradeButton(buttonElement, upgradeConfig);
        }
    });

    updateFactoryActionButtons();

    // Specific visibility logic not tied to a generic upgrade button's purchase state
    const currentGameState = GameState.getGameState();
    if (currentGameState.flags.hasH1) {
        showElement(elements.h1Upgrade);
        showElement(elements.subheading);
    } else {
        hideElement(elements.h1Upgrade);
        hideElement(elements.subheading);
    }

    if (currentGameState.flags.hasCSS && !currentGameState.flags.hasDarkMode) {
        showElement(elements.darkModeButton);
    } else if (currentGameState.flags.hasDarkMode || !currentGameState.flags.hasCSS) {
        // Hide if purchased or if CSS is not yet purchased
        if (getElement(elements.darkModeButton).style.display !== 'none' && currentGameState.flags.hasDarkMode){
             // If it's purchased and one-time, the generic updater would hide it.
             // If it's a toggle, it would remain visible but disabled or with different text.
        } else if (!currentGameState.flags.hasCSS) {
            hideElement(elements.darkModeButton);
        }
    }
     // Ensure bulk purchase elements are hidden if not purchased
    if (!currentGameState.flags.hasBulkPurchaser) {
        hideElement(elements.bulkAmountInput);
        hideElement(elements.bulkBuyButton);
    }
}

// --- Event Listener Setup ---
export function setupEventListeners(gameLogic) { // Pass gameLogic module
    // Generic Upgrade Buttons
    Object.values(upgradeDataDefinitions).forEach(upgradeConfig => {
        const buttonElement = getElement(upgradeConfig.id);
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                gameLogic.attemptPurchaseUpgrade(upgradeConfig.id); // Pass button ID
            });
        }
    });

    // Factory Buttons
    if (elements.buyFactoryButton) {
        elements.buyFactoryButton.addEventListener('click', () => {
            FactoryManager.buySingleFactory();
        });
    }

    if (elements.bulkBuyButton) {
        elements.bulkBuyButton.addEventListener('click', () => {
            FactoryManager.buyBulkFactories(); // Amount is taken from gameState now
        });
    }

    // Bulk Amount Input
    if (elements.bulkAmountInput) {
        const debouncedBulkAmountUpdate = debounce(() => {
            const success = GameState.setBulkBuyAmount(elements.bulkAmountInput.value);
            if (!success) { // If input was invalid and not set in gameState
                elements.bulkAmountInput.value = GameState.getBulkBuyAmount(); // Reset input to valid state
            }
            updateFactoryActionButtons(); // Just update relevant buttons, not full UI
        }, 300);
        elements.bulkAmountInput.addEventListener('input', debouncedBulkAmountUpdate);
    }

    // Subscribe to game state changes to automatically update UI
    subscribe('gameStateChanged', updateUI);
}
