# Abacus Game


The **Abacus Game** is an interactive, web-based educational tool designed to help users practice number representation and arithmetic using a virtual abacus. Players match a target number by adjusting beads on the abacus, making it an engaging way to learn place value and basic math concepts. The game features a modern UI, child-friendly sound effects, dark mode, and score tracking, making it suitable for learners of all ages.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contact](#contact)

## Features

- **Interactive Abacus**: Adjust beads on five rods (Ten-Thousands, Thousands, Hundreds, Tens, Units) to represent numbers up to 99,999.
- **Target Number Matching**: Match a randomly generated target number using the abacus.
- **Score Tracking**: Tracks correct answers, fastest time, and total attempts, stored in local storage.
- **Clear History**: Reset score history with a delete icon in the score section.
- **Timer**: Optional timer to challenge players, with start, pause, and restart functionality.
- **Dark Mode**: Toggle between light and dark themes, with preferences saved in local storage.
- **Child-Friendly Sound Effects**: Distinct sounds for bead movements, correct answers, and incorrect submissions.
- **Animated UI**: Smooth bead animations, confetti celebration for correct answers, and a bouncing title animation.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Customizable Difficulty**: Adjust the maximum number of digits (1-5) for the target number.

## Demo

Try the Abacus Game live: [Abacus Game Demo]([#](https://abacus-game.vercel.app/)) *(Replace with actual deployment link)*

A screenshot of the game is shown above. For a live experience, follow the installation instructions below to run it locally or visit the demo link.

## Installation

To run the Abacus Game locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/abacus-game.git
   cd abacus-game
   ```

2. **Open the Project**:
   Since this is a static web application, no server setup is required. Simply open the `index.html` file in a web browser:
   ```bash
   open index.html
   ```
   Alternatively, you can use a local development server for a better experience (e.g., with VS Code's Live Server extension or a simple HTTP server).

3. **Dependencies**:
   The project uses CDN-hosted libraries, so no additional installations are needed. Ensure you have an internet connection to load:
   - Tailwind CSS
   - Font Awesome
   - Canvas Confetti

## Usage

1. **Start the Game**:
   - Open `index.html` in a web browser.
   - The game initializes with a random target number based on the selected max digits (default: 5).

2. **How to Play**:
   - Use the `+` and `-` buttons on each rod to add or remove beads.
   - Rods represent place values: Ten-Thousands (T-Th), Thousands (Th), Hundreds (H), Tens (T), and Units (O).
   - When a rod reaches 10 beads, it resets to 0, and the next rod increments by 1 (except for Ten-Thousands, which resets to 0).
   - Click **Submit** to check if the abacus matches the target number.
   - Use **New Question** to generate a new target number or **Clear Abacus** to reset all beads.
   - Toggle the timer with **Start/Pause** and reset it with **Restart**.
   - Adjust difficulty by setting **Max Digits** (1-5).
   - Clear score history by clicking the trash icon in the score section.
   - Toggle dark mode using the sun/moon icon.

3. **Score Tracking**:
   - Correct answers increment the "Correct Answers" count.
   - The fastest time to match a number is recorded.
   - Total attempts (submissions) are tracked.
   - Stats persist across sessions via local storage.

4. **Sound Effects**:
   - A pop sound plays when adding/removing beads.
   - A cheerful tinkle plays for correct answers.
   - A gentle boop plays for incorrect submissions.

## Technologies Used

- **HTML5**: Structure of the web application.
- **CSS3**: Styling with Tailwind CSS for responsive design and custom animations.
- **JavaScript**: Game logic, event handling, and local storage management.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Font Awesome**: Icons for dark mode toggle and clear history button.
- **Canvas Confetti**: Confetti animation for correct answers.
- **Pixabay Audio**: Child-friendly sound effects for bead movements and game events.

## Project Structure

```
abacus-game/
├── index.html        # Main HTML file
├── script.js         # JavaScript for game logic
├── styles.css        # Custom CSS styles
├── README.md         # Project documentation

```


## Contact

For questions, suggestions, or issues, please reach out:

- **Email**: mohit.work.mail9@gmail.com
- **GitHub**: [mkraj-7838](https://github.com/mkraj-7838)

---

*Built with ❤️ by Mohit Prajapati*
