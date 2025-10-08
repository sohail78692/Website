// game.js - Handles the "Guess the Number" mini-game logic.

// Import the showToast function from the main module
import { showToast } from './main.js'; 

let randomNumber;
let attempts = 0;
const maxAttempts = 10;
// NEW: Variable to store the element that opened the modal for focus return
let modalTriggerElement = null; 

/**
 * Utility function to get focusable elements within the modal.
 * @param {HTMLElement} gameModal - The modal element.
 * @returns {Array<HTMLElement>} List of focusable elements.
 */
function getFocusableElements(gameModal) {
    const selector = 'button:not([disabled]), input:not([disabled])';
    return [...gameModal.querySelectorAll(selector)].filter(el => 
        // Filter out elements that are hidden or have no size
        el.offsetWidth > 0 || el.offsetHeight > 0
    );
}

/**
 * Handles keyboard events for modal accessibility: Escape key and Focus Trap (Tab).
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function handleModalKeydown(e) {
    const gameModal = document.getElementById('game-modal');
    if (!gameModal || gameModal.classList.contains('is-hidden')) return;

    // 1. Handle Escape Key to close modal
    if (e.key === 'Escape') {
        e.preventDefault();
        hideModal(gameModal);
        return;
    }

    // 2. Handle Focus Trap (Tab key)
    if (e.key === 'Tab') {
        const focusableElements = getFocusableElements(gameModal);

        if (focusableElements.length === 0) {
            e.preventDefault(); // Nothing to focus on, trap focus on modal itself (preventing body focus)
            return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) { // Shift + Tab: Move focus backward
            if (document.activeElement === first || !gameModal.contains(document.activeElement)) {
                last.focus();
                e.preventDefault();
            }
        } else { // Tab: Move focus forward
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
}

/**
 * Shows the modal and sets up the keydown listener.
 * @param {HTMLElement} gameModal - The modal element.
 */
const showModal = (gameModal) => { 
    gameModal.classList.remove('is-hidden'); 
    document.addEventListener('keydown', handleModalKeydown);
};

/**
 * Hides the modal, cleans up the keydown listener, and returns focus.
 * @param {HTMLElement} gameModal - The modal element.
 */
const hideModal = (gameModal) => { 
    gameModal.classList.add('is-hidden'); 
    document.removeEventListener('keydown', handleModalKeydown);

    // NEW: Return focus to the element that opened the modal
    if (modalTriggerElement) {
        modalTriggerElement.focus();
        modalTriggerElement = null; // Clear the trigger element
    }
};

/**
 * Initializes the game state and opens the modal.
 * @param {HTMLElement} gameModal - The modal element.
 * @param {HTMLElement} gameInput - The input field.
 * @param {HTMLElement} gameMessage - The message area.
 * @param {HTMLElement} guessButton - The guess button.
 * @param {HTMLElement} triggerElement - The element that initiated the modal open (for focus return).
 */
const startGame = (gameModal, gameInput, gameMessage, guessButton, triggerElement) => {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    gameMessage.textContent = 'I\'m thinking of a number between 1 and 100. You have 10 attempts.';
    gameInput.value = '';
    gameInput.disabled = false;
    guessButton.disabled = false;
    
    // NEW: Store the trigger element
    modalTriggerElement = triggerElement;

    showModal(gameModal);
    gameInput.focus(); // Set initial focus to the input field
};

const checkGuess = (gameInput, gameMessage, guessButton) => {
    // ... (rest of checkGuess logic remains unchanged)
    const userGuess = parseInt(gameInput.value, 10);
    
    if (guessButton.disabled) return; // Prevent checks if game is over

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        gameMessage.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }
    
    attempts++;
    
    // ... (rest of checkGuess logic)
    
    // Check if the game is over (win or loss)
    if (userGuess === randomNumber) {
        gameMessage.textContent = `Correct! The number was ${randomNumber}. It took you ${attempts} attempts.`;
        gameInput.disabled = true;
        guessButton.disabled = true;
        showToast("You won the game! 🎉", 'success');
    } else if (attempts >= maxAttempts) {
        gameMessage.textContent = `Game Over! The number was ${randomNumber}. You ran out of attempts.`;
        gameInput.disabled = true;
        guessButton.disabled = true;
        showToast("Game Over. Try the secret trigger again!", 'error');
    } else if (userGuess < randomNumber) {
        gameMessage.textContent = `Too low. You have ${maxAttempts - attempts} attempts left.`;
    } else {
        gameMessage.textContent = `Too high. You have ${maxAttempts - attempts} attempts left.`;
    }
};

/**
 * Sets up all event listeners for the mini-game.
 */
export function setupGame(secretTrigger, gameModal, closeGameButton, guessButton, gameInput, gameMessage) {
    // NEW: Pass 'secretTrigger' to startGame so it can store it for focus return
    secretTrigger.addEventListener('click', () => startGame(gameModal, gameInput, gameMessage, guessButton, secretTrigger));
    
    closeGameButton.addEventListener('click', () => hideModal(gameModal));
    
    // Bind checkGuess function with necessary arguments
    guessButton.addEventListener('click', () => checkGuess(gameInput, gameMessage, guessButton));
    
    gameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !guessButton.disabled) {
            checkGuess(gameInput, gameMessage, guessButton);
        }
    });
}