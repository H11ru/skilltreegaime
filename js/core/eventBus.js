// js/core/eventBus.js
const events = {};

export function subscribe(eventName, callback) {
    if (!events[eventName]) {
        events[eventName] = [];
    }
    events[eventName].push(callback);
    // console.log(`Subscribed to ${eventName}`);
}

export function publish(eventName, data) {
    if (events[eventName]) {
        // console.log(`Publishing ${eventName} with data:`, data);
        events[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in subscriber for ${eventName}:`, error);
            }
        });
    } else {
        // console.warn(`No subscribers for event: ${eventName}`);
    }
}
