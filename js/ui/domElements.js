export const elements = {
    // Displays
    bpDisplay: null,
    factoryCountDisplay: null,
    h1Upgrade: null,
    subheading: null,

    // Buttons
    gain1BPButton: null, // Renamed to match convention
    buyFactoryButton: null,
    bulkBuyButton: null,
    changeTitleButton: null,
    purchaseCSSButton: null,
    buyCounterButton: null,
    purchaseH1Button: null,
    darkModeButton: null,
    bulkPurchaserButton: null,

    // Inputs
    bulkAmountInput: null,

    // Containers
    upgradesContainer: null,
    // Add other elements as needed
};

export function cacheElements() {
    // Displays
    elements.bpDisplay = document.getElementById('bpDisplay');
    elements.factoryCountDisplay = document.getElementById('factoryCountDisplay');
    elements.h1Upgrade = document.getElementById('h1upgrade');
    elements.subheading = document.getElementById('subheading');

    // Buttons - Ensure IDs in HTML match these
    elements.gain1BPButton = document.getElementById('gain1BP'); // ID from HTML
    elements.buyFactoryButton = document.getElementById('buyFactoryButton');
    elements.bulkBuyButton = document.getElementById('bulkBuyButton');
    elements.changeTitleButton = document.getElementById('changeTitleButton');
    elements.purchaseCSSButton = document.getElementById('purchaseCSSButton');
    elements.buyCounterButton = document.getElementById('buyCounterButton');
    elements.purchaseH1Button = document.getElementById('purchaseH1Button');
    elements.darkModeButton = document.getElementById('darkModeButton');
    elements.bulkPurchaserButton = document.getElementById('bulkPurchaserButton');

    // Inputs
    elements.bulkAmountInput = document.getElementById('bulkAmountInput');

    // Containers
    elements.upgradesContainer = document.getElementById('upgradesContainer');

    // Verify elements (optional, for debugging)
    for (const key in elements) {
        if (elements[key] === null) {
            // console.warn(`DOM element not found for key: ${key}. Expected ID: ${key.replace(/Button$/, '')} or similar.`);
        }
    }
}
