// theme.js - Handles theme toggling and the secret Konami code.

// --- Theme Initialization and Persistence ---

// NEW LOGIC: Check system preference before setting a default theme.
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (storedTheme) {
    // 1. If a theme is stored in localStorage, use it.
    document.documentElement.classList.add(storedTheme);
} else if (prefersDark) {
    // 2. If no theme is stored, but the system prefers dark, use dark mode initially.
    document.documentElement.classList.add('dark');
}
// Note: If no theme is stored and system preference is light, the site defaults to light (no class).


/**
 * Determines the color for the particles based on the current theme.
 * @returns {string} RGBA color string.
 */
export const getParticleColor = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const isHacker = document.documentElement.classList.contains('hacker-theme');
    return isHacker ? 'rgba(0, 255, 0, 0.4)' : (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)');
};

/**
 * Sets up the event listener for the theme toggle button.
 * @param {HTMLElement} themeToggleBtn - The button to toggle the theme.
 * @param {function} updateParticleColor - Function from particles.js to update colors.
 */
export function setupThemeToggle(themeToggleBtn, updateParticleColor) {
    themeToggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const html = document.documentElement.classList;
        
        if (html.contains('hacker-theme')) {
            // If in hacker mode, exit to dark mode (which will now *look* light)
            html.remove('hacker-theme');
            html.add('dark');
            localStorage.setItem('theme', 'dark'); // User perceives they are in Dark Mode
        } else if (html.contains('dark')) {
            // FIX: Toggle from 'dark' (which now looks light) to 'light' (which will now look dark)
            // Remove the 'dark' class to get the new visual "light mode" (which looks dark)
            html.remove('dark');
            // We set 'dark' in storage because this state (no class) is now the visual dark mode
            localStorage.setItem('theme', 'dark');
        } else {
            // FIX: Toggle from 'light' (which now looks dark) to 'dark' (which will now look light)
            // Add the 'dark' class to get the new visual "dark mode" (which looks light)
            html.add('dark');
            // We set 'light' in storage because this state (.dark class) is now the visual light mode
            localStorage.setItem('theme', 'light');
        }
        updateParticleColor();
    });
}

/* --- Hidden Konami Code / Hacker Theme Feature --- */
const secretKeys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'];
let keyIndex = 0;

/**
 * Sets up the Konami code listener to toggle the hacker theme.
 * @param {function} updateParticleColor - Function from particles.js to update colors.
 */
export function setupHackerTheme(updateParticleColor) {
    document.addEventListener('keydown', (e) => {
        if (e.key === secretKeys[keyIndex]) {
            keyIndex++;
            if (keyIndex === secretKeys.length) {
                document.documentElement.classList.toggle('hacker-theme');
                
                // Ensure 'dark' mode is removed when 'hacker-theme' is active
                if (document.documentElement.classList.contains('hacker-theme')) {
                    document.documentElement.classList.remove('dark');
                    // We don't save 'hacker-theme' to localStorage as it's a transient state
                }
                
                keyIndex = 0;
                updateParticleColor();
            }
        } else {
            // Reset sequence if the wrong key is pressed
            keyIndex = 0;
        }
    });
}