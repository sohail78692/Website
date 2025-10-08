// utils.js - Contains general utility functions.

/**
 * Updates the copyright year dynamically in the footer.
 */
export function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
}