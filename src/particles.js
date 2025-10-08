// particles.js - Handles the background particle animation effect.

import { getParticleColor } from './theme.js';

const canvas = document.getElementById('particles-js');
let ctx;
let particles = [];
const particleCount = 100;
let animationFrameId;

// Exported function used by theme.js to change particle colors on theme switch
export function updateParticleColor() {
    if (particles.length > 0) {
        const newColor = getParticleColor();
        particles.forEach(p => { p.color = newColor; });
    }
}

const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = getParticleColor(); // Get initial color
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const initParticlesArray = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
};

const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                // Connect particles with lines
                ctx.strokeStyle = getParticleColor().replace(/[^,]+(?=\))/, 1 - distance / 100); // Adjust opacity based on distance
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    animationFrameId = requestAnimationFrame(animateParticles);
};

/**
 * Initializes the particle system and starts the animation loop.
 */
export function initParticles() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    initParticlesArray();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticlesArray();
    });
}