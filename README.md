# Skill Tree Ultra Deluxe

A simple incremental game where you earn "Bapploid Points" (BP) and spend them on upgrades that unlock features, visual improvements, and more ways to earn BP. This project is structured to be modular and extensible.

## Project Structure

```
/my-skill-tree-game/
├── index.html // Main HTML shell
├── css/
│ ├── base.css // Basic, always-on styles
│ └── game-styles.css // Styles unlocked via "Purchase CSS" upgrade
├── js/
│ ├── main.js // Main game initializer, orchestrator
│ ├── core/
│ │ ├── gameState.js // Manages all game state variables
│ │ ├── eventBus.js // Simple pub/sub system for inter-module communication
│ │ └── utils.js // Utility functions (debounce, formatting)
│ ├── game/
│ │ ├── upgrades.js // Data definitions for all upgrades
│ │ ├── gameLogic.js // Core game mechanics (purchasing logic)
│ │ ├── factoryManager.js // Logic specific to factories
│ │ └── passiveIncome.js // Handles the setInterval for BP generation
│ ├── ui/
│ │ ├── uiManager.js // Handles all DOM manipulation, updates UI elements
│ │ └── domElements.js // Centralized DOM element references
└── README.md // This file
```

## How to Run

1.  Clone or download this repository.
2.  Open `index.html` in a modern web browser that supports ES6 Modules (most current browsers do).
    *   For local development, serving the files via a local web server (like VS Code's Live Server extension, Python's `http.server`, or `npx serve`) is recommended to avoid potential issues with ES6 modules being loaded via `file:///` protocol.

## Development

### Adding a New Upgrade

1.  **Define Data (`js/game/upgrades.js`):**
    *   Add a new entry to the `upgrades` object. Define its `id` (matching the button ID in HTML), `type`, `cost` (can be a function for dynamic cost), `textTemplate` for the button's text, `isAvailable`, `isPurchased` (functions that check `gameState`), and an `onPurchase` function that modifies `gameState` and triggers UI effects via `services.uiManager`.
    *   Use `services.gameState` and `services.uiManager` passed into `onPurchase`.
2.  **Update Game State (`js/core/gameState.js`):**
    *   If the upgrade introduces new flags or variables, add them to the `state` object.
3.  **HTML (`index.html`):**
    *   Add the corresponding button element with the correct `id`.
4.  **DOM Elements (`js/ui/domElements.js`):**
    *   If the new upgrade's button or related elements need to be frequently accessed, add them to the `elements` object and cache them in `cacheElements()`.
5.  **UI Manager (`js/ui/uiManager.js`):**
    *   The generic `updateGenericUpgradeButton` should handle most display logic.
    *   The generic event listener setup in `setupEventListeners` (using `gameLogic.attemptPurchaseUpgrade`) should handle the click.
    *   If the upgrade has unique UI visibility rules beyond the standard purchase flow, add logic to `updateUI` or create specific helper functions.
6.  **Game Logic (`js/game/gameLogic.js` or specific module):**
    *   The `attemptPurchaseUpgrade` should work for most standard upgrades. If the upgrade introduces new mechanics (e.g., a new type of passive income), you might create a new module in the `js/game/` directory to handle its specific logic, which can then be invoked by the `onPurchase` method of the upgrade.

### Key Modules

*   **`js/core/gameState.js`**: The single source of truth for all game data.
*   **`js/game/upgrades.js`**: Defines all available upgrades in a data-driven manner.
*   **`js/ui/uiManager.js`**: Controls all interactions with the HTML (DOM).
*   **`js/core/eventBus.js`**: Decouples modules by allowing them to publish and subscribe to events (e.g., `gameStateChanged`). `uiManager` subscribes to `gameStateChanged` to know when to refresh the display.

## Future Enhancements

*   **Save/Load Game:** Implement `saveState` and `loadState` in `js/core/gameState.js` using `localStorage`, and maybe let users download them as files too.
*   **More Complex Upgrades:** Introduce upgrades with ongoing effects, or upgrades that modify other upgrades.
*   **Visual Polish:** Add more sophisticated CSS, animations, and potentially images/icons.
*   **Balancing:** Adjust costs and income rates for better game progression.
*   **Achievements/Prestige System.**
*   **Unit Testing.**
