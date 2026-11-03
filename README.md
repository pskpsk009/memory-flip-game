# Memory Flip Game

Build a modern, mobile-first responsive web application for a memory matching game called "Memory Flip".

Design & Aesthetic:

- Mobile-first portrait layout centered on the screen with a light pastel blue-to-indigo theme.

- Modern rounded UI elements, subtle card shadows, and smooth hover/tap animations.

- Background: Light pastel blue base with decorative floating memory card graphics in the background corners (tilted card icons with subtle grid patterns and gold coin details).

Screen 1: Landing Page (scrMenu)

- Top/Header: App logo featuring a stylized blue folded/flipped card icon with a yellow star badge, next to bold title text "Memory Flip".

- Subtitle Text: Dark indigo text underneath reading: "a game to learn new words and increase memory capability".

- Action: A prominent, centered primary button styled in deep indigo blue with rounded corners labeled "Play". Clicking "Play" navigates to the Level Select screen.

Navigation & Screens Structure:

- Include navigation state management to switch smoothly between screens:

  1. Menu Screen (scrMenu) - Current main view.

  2. Level Select Screen (scrLevelSelect) - Grid showing choices like Level 1, Level 2, and Custom/Manual Set.

  3. Game Screen (Level_1 / Level_2) - A memory matching card grid (e.g., 4x4 or 4x3) where users flip cards to match pairs of words/images.

  4. Create Custom Set Screen (scrCreateSet / manualLevel) - Form to let users add custom word/image pairs.

  5. Game Over Screen (scrGameOver) - Displays score, time taken, and options to replay or go back to menu.

Interactive Features:

- Clean card flip flip-card animations using CSS transitions for the game board.

- Score counter and timer header during active gameplay.

- Toast notifications or simple celebration dialog upon level completion.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5355f661-365f-4505-8660-519c46b65483).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
