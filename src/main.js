// main.js - The primary application entry point and controller.
import { initParticles, updateParticleColor } from './particles.js';
import { setupNavigation } from './navigation.js';
import { setupThemeToggle, setupHackerTheme } from './theme.js';
import { setupGame } from './game.js';
import { updateDiscordStatus } from './discord.js';
import { updateCopyrightYear } from './utils.js';
import { EMAIL_JS_KEY } from './emailjs-config.js';



// --- Element Selectors ---
const ELEMENT_SELECTORS = {
    // General
    navButtons: document.querySelectorAll('.nav-button'),
    sections: document.querySelectorAll('.content-section'),
    parallaxBg: document.body,
    // Theme
    themeToggleBtn: document.getElementById('theme-toggle'),
    // Navigation
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileNav: document.getElementById('mobile-nav'),
    mobileMenuClose: document.getElementById('mobile-menu-close'),
    // Game
    secretTrigger: document.getElementById('secret-trigger'),
    gameModal: document.getElementById('game-modal'),
    closeGameButton: document.getElementById('close-game'),
    guessButton: document.getElementById('guess-button'),
    gameInput: document.getElementById('game-input'),
    gameMessage: document.getElementById('game-message'),
    // Contact/Toast
    contactForm: document.getElementById('contact-form'),
    toastNotification: document.getElementById('toast-notification'),
    toastMessage: document.getElementById('toast-message'),
    copyEmailElement: document.getElementById('copy-email'),
    copyLocationElement: document.getElementById('copy-location'),
    // Typing
    typingTextElement: document.getElementById('typing-text'),
};

// --- Exported Function to show toast notifications (used by Contact and Game) ---
export function showToast(message, type = 'info') {
    ELEMENT_SELECTORS.toastMessage.textContent = message;
    ELEMENT_SELECTORS.toastNotification.classList.remove('is-hidden', 'bg-red-500', 'bg-green-500', 'bg-gray-800');
    
    // Remove all specific color classes before adding the correct one
    ELEMENT_SELECTORS.toastNotification.classList.remove('bg-red-500', 'bg-green-500', 'bg-gray-800');

    if (type === 'error') {
        ELEMENT_SELECTORS.toastNotification.classList.add('bg-red-500');
    } else if (type === 'success') {
        ELEMENT_SELECTORS.toastNotification.classList.add('bg-green-500');
    } else {
        ELEMENT_SELECTORS.toastNotification.classList.add('bg-gray-800');
    }

    setTimeout(() => {
        ELEMENT_SELECTORS.toastNotification.classList.add('is-hidden');
    }, 3000);
}

// --- Function to set up contact info copying ---
function setupCopyContactInfo() {
    // Function to handle the actual copy operation
    const handleCopy = async (element, message) => {
        const copySpan = element.querySelector('[data-copy-value]');
        const valueToCopy = copySpan ? copySpan.getAttribute('data-copy-value') : null;
        
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                showToast(`${message} copied! ✅`, 'success');
            } catch (err) {
                console.error(`Failed to copy ${message.toLowerCase()}: `, err);
                showToast(`Failed to copy ${message.toLowerCase()}. Please try manually.`, 'error');
            }
        }
    };

    // Attach event listeners to the copy blocks
    if (ELEMENT_SELECTORS.copyEmailElement) {
        ELEMENT_SELECTORS.copyEmailElement.addEventListener('click', () => handleCopy(ELEMENT_SELECTORS.copyEmailElement, 'Email'));
    }
    
    if (ELEMENT_SELECTORS.copyLocationElement) {
        ELEMENT_SELECTORS.copyLocationElement.addEventListener('click', () => handleCopy(ELEMENT_SELECTORS.copyLocationElement, 'Location'));
    }
}

// --- Parallax Effect (Kept in main for simplicity of imports) ---
function setupParallax() {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * -10;
        const y = (e.clientY / window.innerHeight - 0.5) * -10;
        ELEMENT_SELECTORS.parallaxBg.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    });
}


// --- Contact Form Submission Logic for EmailJS ---
function setupContactForm() {
    ELEMENT_SELECTORS.contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showToast("Please fill in all required fields.", 'error');
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast("Please enter a valid email address.", 'error');
            return;
        }

        showToast("Sending...", 'info');
        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');

        // NOTE: The service and template IDs below must be correctly configured in your EmailJS account.
        // It relies on the emailjs library being loaded in index.html
        emailjs.sendForm('service_id', 'template_id', this)
            .then(function() {
                showToast("Message sent successfully!", 'success');
                ELEMENT_SELECTORS.contactForm.reset();
            }, function(error) {
                showToast("Failed to send the message. Please try again.", 'error');
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            });
    });
}

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("%cHey there, curious developer! Welcome to my modular portfolio.", "color: #f59e0b; font-size: 18px; font-weight: bold; font-family: 'Inter', sans-serif;");
    
    // --- External Library Initialization ---
    // AOS is loaded via <script> tag in index.html, so it's globally available
    AOS.init({ duration: 1000, once: true });
    
    // Initialize EmailJS (library loaded via <script> tag in index.html)
    
    // Initialize EmailJS using the key generated from src/.env
    // Note: the generated file `src/emailjs-config.js` is created by the `scripts/generate-config.js` script
    // and is ignored by git via .gitignore to avoid accidental commits.
    if (typeof EMAIL_JS_KEY === 'string' && EMAIL_JS_KEY.length > 0) {
        emailjs.init(EMAIL_JS_KEY);
    } else {
        console.warn('EmailJS key not available. Make sure to run `npm run generate-config`.');
    }
    
    // --- Setup all modules, passing required elements/functions ---
    // Particle Effect
    initParticles(); // Particles module handles its own canvas lookup and color dependency (via import)

    // Theme and Konami Code
    setupThemeToggle(ELEMENT_SELECTORS.themeToggleBtn, updateParticleColor);
    setupHackerTheme(updateParticleColor);

    // Navigation and Hero Animation
    setupNavigation(
        ELEMENT_SELECTORS.navButtons, 
        ELEMENT_SELECTORS.sections, 
        ELEMENT_SELECTORS.mobileMenuToggle, 
        ELEMENT_SELECTORS.mobileNav, 
        ELEMENT_SELECTORS.mobileMenuClose, 
        ELEMENT_SELECTORS.typingTextElement
    );
    
    // Game
    setupGame(
        ELEMENT_SELECTORS.secretTrigger, 
        ELEMENT_SELECTORS.gameModal, 
        ELEMENT_SELECTORS.closeGameButton, 
        ELEMENT_SELECTORS.guessButton, 
        ELEMENT_SELECTORS.gameInput, 
        ELEMENT_SELECTORS.gameMessage
    );

    // Utilities/Other Features
    setupParallax();
    setupCopyContactInfo();
    setupContactForm();
    updateCopyrightYear(); 
    updateDiscordStatus(); // Also calls setInterval internally
});

