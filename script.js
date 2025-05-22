// Constants
const rodOrder = ['tenThousands', 'thousands', 'hundreds', 'tens', 'units'];
const rodMultipliers = {
    tenThousands: 10000,
    thousands: 1000,
    hundreds: 100,
    tens: 10,
    units: 1
};

// State of the abacus
const abacusState = {
    tenThousands: 0,
    thousands: 0,
    hundreds: 0,
    tens: 0,
    units: 0
};

let targetNumber = 0;
let isCelebrating = false;
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// Score Tracking
let stats = JSON.parse(localStorage.getItem('abacusGameStats')) || {
    correctAnswers: 0,
    fastestTime: null,
    attempts: 0
};

// Sound Effects (Child-Friendly)
const popSound = new Audio('https://cdn.pixabay.com/audio/2022/01/25/03-24-07-260_48k.mp3'); // Soft pop for beads
const tinkleSound = new Audio('https://cdn.pixabay.com/audio/2022/12/01/14-34-47-573_48k.mp3'); // Cheerful tinkle for success
const boopSound = new Audio('https://cdn.pixabay.com/audio/2023/02/22/14-19-36-175_48k.mp3'); // Gentle boop for try again

// Update Score Display
function updateScoreDisplay() {
    document.getElementById('correctAnswers').textContent = stats.correctAnswers;
    document.getElementById('fastestTime').textContent = stats.fastestTime !== null ? stats.fastestTime : 'N/A';
    document.getElementById('attempts').textContent = stats.attempts;
}

// Save Stats to Local Storage
function saveStats() {
    localStorage.setItem('abacusGameStats', JSON.stringify(stats));
    updateScoreDisplay();
}

// Clear History
function clearHistory() {
    stats = { correctAnswers: 0, fastestTime: null, attempts: 0 };
    localStorage.removeItem('abacusGameStats');
    updateScoreDisplay();
}

// Timer Functions
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds++;
            document.getElementById('timer').textContent = timerSeconds;
        }, 1000);
        const timerButton = document.getElementById('timerToggle');
        timerButton.textContent = 'Pause';
        timerButton.classList.add('running');
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        const timerButton = document.getElementById('timerToggle');
        timerButton.textContent = 'Start';
        timerButton.classList.remove('running');
    }
}

function toggleTimer() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function restartTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 0;
    document.getElementById('timer').textContent = timerSeconds;
    const timerButton = document.getElementById('timerToggle');
    timerButton.textContent = 'Start';
    timerButton.classList.remove('running');
}

// Generate a random target number based on max digits
function generateTargetNumber() {
    const maxDigits = parseInt(document.getElementById('maxDigits').value) || 5;
    const maxNumber = Math.pow(10, maxDigits) - 1;
    return Math.floor(Math.random() * (maxNumber + 1));
}

// Render beads on a rod
function renderBeads(rodId, count, animateNew = false) {
    const rodElement = document.getElementById(rodId);
    const rod = rodElement.closest('.rod');
    rod.classList.add('pulse');
    const existingBeads = rodElement.querySelectorAll('.bead');
    existingBeads.forEach(bead => {
        bead.classList.add('fade-out');
    });
    if (existingBeads.length !== count) {
        try {
            popSound.play();
        } catch (error) {
            console.error('Error playing pop sound:', error);
        }
    }
    setTimeout(() => {
        rodElement.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';
            rodElement.appendChild(bead);
            if (animateNew && i === count - 1) {
                setTimeout(() => bead.classList.add('pop-in'), 10);
            } else {
                setTimeout(() => bead.classList.add('visible'), 10);
            }
        }
        rod.classList.remove('pulse');
    }, 300);
}

// Adjust beads on a rod with carry-over logic
function adjustBeads(rodId, change) {
    let currentValue = abacusState[rodId] + change;
    if (currentValue > 9) {
        currentValue = 0;
        const rodIndex = rodOrder.indexOf(rodId);
        if (rodIndex > 0) { // Only carry over if not tenThousands
            const nextRodId = rodOrder[rodIndex - 1];
            renderBeads(rodId, currentValue);
            setTimeout(() => {
                adjustBeads(nextRodId, 1);
            }, 300);
        } else {
            // For tenThousands, reset to 0 without carry-over
            renderBeads(rodId, currentValue);
        }
    } else if (currentValue < 0) {
        currentValue = 0;
        renderBeads(rodId, currentValue);
    } else {
        renderBeads(rodId, currentValue, change > 0);
    }
    abacusState[rodId] = currentValue;
    updateUI();
}

// Calculate the current value of the abacus
function calculateAbacusValue() {
    return rodOrder.reduce((total, rodId) => total + abacusState[rodId] * rodMultipliers[rodId], 0);
}

// Trigger confetti celebration with variety
function celebrate() {
    if (isCelebrating) return;
    isCelebrating = true;
    const particleCount = Math.floor(Math.random() * 50) + 100;
    const spread = Math.floor(Math.random() * 20) + 60;
    confetti({
        particleCount,
        spread,
        origin: { y: 0.6 }
    });
    try {
        tinkleSound.play();
    } catch (error) {
        console.error('Error playing tinkle sound:', error);
    }
    stats.correctAnswers++;
    if (stats.fastestTime === null || timerSeconds < stats.fastestTime) {
        stats.fastestTime = timerSeconds;
    }
    saveStats();
    setTimeout(() => {
        isCelebrating = false;
    }, 2000);
}

// Update the UI with the current abacus value and status
function updateUI() {
    const currentValue = calculateAbacusValue();
    const currentValueElement = document.getElementById('currentValue');
    const targetElement = document.getElementById('targetNumber');
    const statusElement = document.getElementById('status');
    const platformElement = document.getElementById('abacusPlatform');
    currentValueElement.textContent = currentValue;
    if (currentValue === targetNumber) {
        statusElement.textContent = 'You matched the number!';
        statusElement.classList.add('correct');
        platformElement.classList.add('correct');
        targetElement.classList.add('matched');
        currentValueElement.classList.add('matched');
        pauseTimer();
        celebrate();
    } else {
        statusElement.textContent = 'Keep adjusting the beads.';
        statusElement.classList.remove('correct');
        platformElement.classList.remove('correct');
        targetElement.classList.remove('matched');
        currentValueElement.classList.remove('matched');
    }
}

// Submit answer
function submitAnswer() {
    stats.attempts++;
    saveStats();
    const currentValue = calculateAbacusValue();
    if (currentValue === targetNumber) {
        updateUI();
    } else {
        const popup = document.getElementById('tryAgainPopup');
        const overlay = document.getElementById('overlay');
        popup.classList.add('show');
        overlay.classList.add('show');
        try {
            boopSound.play();
        } catch (error) {
            console.error('Error playing boop sound:', error);
        }
    }
}

// Close the popup
function closePopup() {
    const popup = document.getElementById('tryAgainPopup');
    const overlay = document.getElementById('overlay');
    popup.classList.remove('show');
    overlay.classList.remove('show');
}

// Clear abacus without changing target number
function clearAbacus() {
    rodOrder.forEach(rodId => {
        abacusState[rodId] = 0;
        renderBeads(rodId, 0);
    });
    updateUI();
}

// Reset the abacus and generate a new target number
function newQuestion() {
    rodOrder.forEach(rodId => {
        abacusState[rodId] = 0;
        renderBeads(rodId, 0);
    });
    targetNumber = generateTargetNumber();
    const targetElement = document.getElementById('targetNumber');
    targetElement.classList.remove('fade-in');
    void targetElement.offsetWidth;
    targetElement.textContent = targetNumber;
    targetElement.classList.add('fade-in');
    restartTimer();
    updateUI();
    closePopup();
}

// Dark Mode Toggle with Icon Switch
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    const darkModeIcon = document.getElementById('darkModeIcon');
    darkModeIcon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
}

// Load Dark Mode Preference
function loadDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (isDarkMode) {
        document.body.classList.add('dark');
        darkModeIcon.className = 'fas fa-moon';
    } else {
        darkModeIcon.className = 'fas fa-sun';
    }
}

// Attach event listeners
document.querySelectorAll('.adjust-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const rodId = event.target.closest('.flex-1').querySelector('.bead-container').id;
        const change = event.target.textContent === '+' ? 1 : -1;
        adjustBeads(rodId, change);
    });
});

document.getElementById('submitButton').addEventListener('click', submitAnswer);
document.getElementById('newQuestionButton').addEventListener('click', newQuestion);
document.getElementById('clearAbacusButton').addEventListener('click', clearAbacus);
document.getElementById('continueButton').addEventListener('click', closePopup);
document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('timerToggle').addEventListener('click', toggleTimer);
document.getElementById('restartTimer').addEventListener('click', restartTimer);
document.getElementById('maxDigits').addEventListener('change', () => {
    const maxDigits = parseInt(document.getElementById('maxDigits').value);
    if (maxDigits < 1 || isNaN(maxDigits)) document.getElementById('maxDigits').value = 1;
    if (maxDigits > 5) document.getElementById('maxDigits').value = 5;
    newQuestion();
});

// Initialize the game
loadDarkMode();
updateScoreDisplay();
newQuestion();