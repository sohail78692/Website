// navigation.js - Handles section switching, mobile menu, and the typing animation.

/**
 * Controls the visibility of content sections and manages focus for accessibility.
 * @param {string} sectionId - The ID of the section to show.
 * @param {NodeListOf<HTMLElement>} sections - All content sections.
 */
const showSection = (sectionId, sections) => {
    sections.forEach(section => { section.classList.add('hidden'); });
    const activeSection = document.getElementById(sectionId);
    
    if (activeSection) {
        activeSection.classList.remove('hidden');
        
        // AOS is loaded in index.html, so it's globally available
        AOS.refresh(); 

        // -----------------------------------------------------
        // NEW: Accessibility - Set focus on the main heading
        // -----------------------------------------------------
        const mainHeading = activeSection.querySelector('h2');
        if (mainHeading) {
            // Set tabindex="-1" to make it focusable programmatically without
            // interfering with the natural tab order.
            mainHeading.setAttribute('tabindex', '-1');
            mainHeading.focus();
            // Remove tabindex after focus is set (optional, but cleaner)
            mainHeading.removeAttribute('tabindex');
        } else {
            // Fallback: Set focus to the section itself if no <h2> is found
            activeSection.setAttribute('tabindex', '-1');
            activeSection.focus();
            activeSection.removeAttribute('tabindex');
        }
    }
};

/**
 * Initializes the hero typing animation.
 * @param {HTMLElement} typingTextElement - The element for the typing text.
 */
function setupTypingAnimation(typingTextElement) {
    const textToType = 'About Me';
    const textLength = textToType.length;
    typingTextElement.style.setProperty('--typing-steps', textLength);
    typingTextElement.textContent = textToType;
    typingTextElement.classList.add('is-typing');
    // Manage cursor blinking after animation
    setTimeout(() => {
        setTimeout(() => {
            typingTextElement.style.borderRightColor = 'transparent';
        }, 1200); // Wait for one more blink cycle before hiding
    }, 4500); // Match this to the animation-duration in CSS (e.g., 4s)
}

/**
 * Sets up all navigation and menu event listeners.
 * @param {NodeListOf<HTMLElement>} navButtons - All navigation buttons.
 * @param {NodeListOf<HTMLElement>} sections - All content sections.
 * @param {HTMLElement} mobileMenuToggle - The hamburger icon button.
 * @param {HTMLElement} mobileNav - The mobile navigation container.
 * @param {HTMLElement} mobileMenuClose - The mobile menu close button.
 * @param {HTMLElement} typingTextElement - The element for the typing animation.
 */
export function setupNavigation(navButtons, sections, mobileMenuToggle, mobileNav, mobileMenuClose, typingTextElement) {
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const sectionId = button.getAttribute('data-section');
            if (sectionId) {
                // Deactivate all buttons
                document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active', 'bg-yellow-500', 'text-gray-900'));
                // Activate all matching buttons (desktop and mobile)
                document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(btn => btn.classList.add('active', 'bg-yellow-500', 'text-gray-900'));
                
                showSection(sectionId, sections);
                
                // Close mobile menu if open
                mobileNav.classList.add('translate-x-full');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Mobile menu toggling
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileNav.classList.toggle('translate-x-full');
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileNav.classList.add('translate-x-full');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
    
    // Initial setup
    setupTypingAnimation(typingTextElement);
    showSection('about-section', sections);
}