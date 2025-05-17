// js/core/gameState.js
const state = {
    bp: 0,
    factories: 0,
    factoryBaseCost: 1, // Initial cost of the first factory
    factoryCostMultiplier: 1.01, // How much cost increases per factory
    passiveBpsPerFactory: 0.05,
    flags: {
        hasGained1BP: false,
        hasTitleUpgrade: false,
        hasCSS: false,
        hasDarkMode: false,
        hasCounter: false,
        hasH1: false,
        hasBulkPurchaser: false,
    },
    // Game-wide settings
    bulkBuyAmount: 10, // Default bulk buy amount
};

export function getGameState() {
    // Return a shallow copy of flags to prevent direct modification elsewhere by mistake
    // For deeper objects, a deep clone might be considered if direct mutation is a concern
    return { ...state, flags: { ...state.flags } };
}

export function addBp(amount) {
    state.bp += amount;
}

export function spendBp(amount) {
    if (state.bp >= amount) {
        state.bp -= amount;
        return true;
    }
    return false;
}

export function setFlag(flagName, value) {
    if (state.flags.hasOwnProperty(flagName)) {
        state.flags[flagName] = value;
    } else {
        console.warn(`Attempted to set unknown flag: ${flagName}`);
    }
}

export function addFactories(amount) {
    state.factories += amount;
}

export function getFactoryCurrentCost() {
    // Cost of the *next* single factory
    return state.factoryBaseCost * Math.pow(state.factoryCostMultiplier, state.factories);
}

export function setBulkBuyAmount(amount) {
    const val = parseInt(amount, 10);
    if (!isNaN(val) && val >= 1 && val <= 9999999) {
        state.bulkBuyAmount = val;
        return true;
    }
    // If invalid, reset to a safe default or keep current
    // For simplicity here, we just don't update if invalid, but UI should reflect this.
    return false;
}

export function getBulkBuyAmount() {
    return state.bulkBuyAmount;
}

// TODO: Add loadState and saveState functions for persistence
// export function saveState() { localStorage.setItem('skillTreeGameState', JSON.stringify(state)); }
// export function loadState() {
//     const saved = localStorage.getItem('skillTreeGameState');
//     if (saved) {
//         const loadedState = JSON.parse(saved);
//         // Carefully merge loadedState into state to avoid issues with new/removed properties
//         Object.assign(state, loadedState); // Simple merge, might need more robust logic
//         // Ensure flags are also correctly merged if they were nested
//         if (loadedState.flags) {
//            Object.assign(state.flags, loadedState.flags);
//         }
//     }
// }
