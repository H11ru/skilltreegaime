export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function formatNumber(num, decimals = 2) {
    if (typeof num !== 'number') return 'N/A';
    return num.toFixed(decimals);
}
