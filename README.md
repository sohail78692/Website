## Sohail Akhtar – Interactive Portfolio

An interactive, single-page portfolio site built with modern HTML, Tailwind CSS, and vanilla JavaScript.  
It showcases my profile, skills, projects, Discord rich presence, a contact form powered by EmailJS, and a small Easter‑egg game.

### Features

- **Modern UI**: Responsive card‑style layout with smooth animations and particle background.
- **Sections**: About, Portfolio, Skills, Blog (placeholder), and Contact.
- **Theme & Effects**: Dark theme, parallax background, AOS scroll animations, and a hidden mini “guess the number” game.
- **Discord Status**: Live Discord presence via the Lanyard API, rendered in a custom status card.
- **Contact Form**: EmailJS‑powered contact form with validation and toast notifications.
- **Social Links**: Quick links to GitHub, LinkedIn, Reddit, Spotify, Dev.to, and more.

### Tech Stack

- **Frontend**: HTML5, Tailwind CSS, custom CSS (`main.css`, `output.css`), vanilla JavaScript (ES modules).
- **Libraries / Services**: AOS (scroll animations), Font Awesome, EmailJS, Lanyard (Discord status).
- **Tooling**: Node.js, `tailwindcss`, `@tailwindcss/cli`, simple Node script for config generation.

### Project Structure

- **`src/index.html`**: Main HTML page and layout.
- **`src/main.js`**: Application entry point; wires together navigation, theming, game, Discord, EmailJS, and utilities.
- **`src/particles.js`**: Particle background setup.
- **`src/navigation.js`**: Section switching and mobile navigation.
- **`src/theme.js`**: Theme toggle and “hacker mode” easter egg.
- **`src/game.js`**: Guess‑the‑number modal game.
- **`src/discord.js`**: Fetches and renders Discord status from Lanyard.
- **`src/utils.js`**: Small utilities (e.g., copyright year).
- **`src/input.css` / `src/output.css` / `src/main.css`**: Styling and Tailwind output.
- **`src/image used/`**: Static assets (profile image, tech icons, etc.).

### Getting Started

#### 1. Clone and install dependencies

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

#### 2. Run Tailwind (optional, if you want to change styles)

If you modify `src/input.css`, rebuild the Tailwind output:

```bash
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

#### 3. Start a local server

This is a static frontend project. You can either:

- **Option A – Simple static server (recommended)**  
  Serve the `src` directory with any static server (for example, using VS Code “Live Server” or a similar tool), then open:

```text
http://localhost:<port>/index.html
```

- **Option B – Open the file directly**  
  Open `src/index.html` in your browser (some features that depend on external APIs may work better when served over HTTP).

### EmailJS & Discord Configuration

- **EmailJS**
  - The contact form uses EmailJS via the `emailjs` browser SDK.
  - Update the `service_id` and `template_id` inside `src/main.js` to match your EmailJS setup.
  - For production, keep your public key out of the repo (for example via an env file and generated config).

- **Discord Status**
  - Discord presence is loaded using [Lanyard](https://github.com/Phineas/lanyard).
  - Update the Discord user ID in the configuration file if you want to display a different account.

### Useful NPM Scripts

Defined in `package.json`:

- **`npm run generate-config`**: Runs the Node script that generates/update config (e.g., for EmailJS keys).
- **`npm start`**: Entry point for Node‑side tooling (if you extend this project with a server or build step).

### Deployment

Because this is a purely static site, it can be deployed easily to:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- or any other static hosting service

Deploy the `src` directory (and any built CSS assets) as the web root.

### License

This project is available under the **MIT License**. Feel free to fork, customize, and build on top of it.

