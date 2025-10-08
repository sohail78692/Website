// discord.js - Handles fetching and displaying real-time Discord status.

const DISCORD_ID = '999542874163138690'; // Replace with YOUR Discord User ID

// Helper function to capitalize the first letter
function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Fetches the user's Discord status and updates the HTML card.
 */
export async function updateDiscordStatus() {
    const card = document.getElementById('discord-status');
    if (!card) return;
    
    const userDisplayNameEl = card.querySelector('.user-display-name');
    const activityTypeEl = card.querySelector('.activity-type-simple');
    const activityTitleEl = card.querySelector('.activity-title-simple');
    const activityLineEl = card.querySelector('.activity-line-simple');
    
    // Set loading state
    card.classList.add('loading');
    activityLineEl.textContent = ''; // Clear previous activity line

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        if (!response.ok) {
            // If the response is not OK (e.g., 404, 500), throw an error to be caught
            throw new Error(`API responded with status: ${response.status}`);
        }
        const { data } = await response.json();
        
        // Remove all status classes first
        card.classList.remove('loading', 'online', 'idle', 'dnd', 'offline', 'invisible');
        
        if (!data || !data.discord_user) {
            card.classList.add('offline');
            userDisplayNameEl.textContent = 'Sohail Akhtar';
            activityTypeEl.textContent = 'STATUS';
            activityTitleEl.textContent = 'Currently Offline';
            return;
        }

        const { discord_status, activities, global_name, discord_user } = data;
         
        card.classList.add(discord_status || 'offline');
        userDisplayNameEl.textContent = global_name || discord_user.username || 'Sohail Akhtar';

        let currentActivityType = 'STATUS';
        let currentActivityTitle = `Currently ${capitalize(discord_status === 'invisible' ? 'offline' : discord_status)}`;
        let currentActivityLine = '';

        // 1. Prioritize Game/Streaming Activity (type 0 or 1)
        const liveActivity = activities.find(a => a.type === 0 || a.type === 1);
        if (liveActivity) {
            const isStreaming = liveActivity.type === 1;
            currentActivityType = isStreaming ? 'STREAMING' : 'PLAYING A GAME';
            currentActivityTitle = liveActivity.name;
            currentActivityLine = liveActivity.details || liveActivity.state || '';
        } 
        // 2. Fallback to Spotify Activity
        else if (data.listening_to_spotify && data.spotify) {
            currentActivityType = 'LISTENING TO SPOTIFY';
            const { song, artist } = data.spotify;
            currentActivityTitle = song;
            currentActivityLine = `by ${artist}`;
        }
        // 3. If no specific activity, use status text (already set by default)
        
        // Update the HTML elements
        activityTypeEl.textContent = currentActivityType;
        activityTitleEl.textContent = currentActivityTitle;
        activityLineEl.textContent = currentActivityLine; // Will be empty if no specific line

    } catch (error) {
        // --- THIS IS THE MODIFIED PART ---
        // Instead of showing an error, gracefully display an offline status.
        console.error("Could not fetch Discord status, showing offline:", error);
        
        // Ensure all other status classes are removed before adding 'offline'
        card.classList.remove('loading', 'online', 'idle', 'dnd', 'invisible');
        card.classList.add('offline');

        userDisplayNameEl.textContent = 'Sohail Akhtar'; // Set a default name
        activityTypeEl.textContent = 'STATUS';
        activityTitleEl.textContent = 'Currently Offline';
        activityLineEl.textContent = ''; // Ensure this is empty
    } finally {
        card.classList.remove('loading');
    }
}

// Call once and then set the interval
updateDiscordStatus();
setInterval(updateDiscordStatus, 30000); // Update every 30 seconds