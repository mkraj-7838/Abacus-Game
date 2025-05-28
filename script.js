const rodOrder = ['tenThousands', 'thousands', 'hundreds', 'tens', 'units'];
const rodMultipliers = {
    tenThousands: 10000,
    thousands: 1000,
    hundreds: 100,
    tens: 10,
    units: 1
};

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

let stats = JSON.parse(localStorage.getItem('abacusGameStats')) || {
    correctAnswers: 0,
    fastestTime: null,
    attempts: 0
};

const popSound = new Audio('./sounds/pop.mp3');
const tinkleSound = new Audio('./sounds/success.mp3');
const boopSound = new Audio('./sounds/failure.mp3');

function updateScoreDisplay() {
    document.getElementById('correctAnswers').textContent = stats.correctAnswers;
    document.getElementById('fastestTime').textContent = stats.fastestTime !== null ? stats.fastestTime : 'N/A';
    document.getElementById('attempts').textContent = stats.attempts;
}

function saveStats() {
    localStorage.setItem('abacusGameStats', JSON.stringify(stats));
    updateScoreDisplay();
}

function clearHistory() {
    stats = { correctAnswers: 0, fastestTime: null, attempts: 0 };
    localStorage.removeItem('abacusGameStats');
    updateScoreDisplay();
}

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

function generateTargetNumber() {
    const maxDigits = parseInt(document.getElementById('maxDigits').value) || 5;
    const maxNumber = Math.pow(10, maxDigits) - 1;
    return Math.floor(Math.random() * (maxNumber + 1));
}

function renderBeads(rodId, count) {
    const rodElement = document.getElementById(rodId);
    const rod = rodElement.closest('.rod');
    rod.classList.add('pulse');
    rodElement.innerHTML = '';
    if (rodElement.childElementCount !== count) {
        try {
            popSound.play();
        } catch (error) {
            console.error('Error playing pop sound:', error);
        }
    }
    for (let i = 0; i < count; i++) {
        const bead = document.createElement('div');
        bead.className = 'bead';
        rodElement.prepend(bead);
    }
    rod.classList.remove('pulse');
    updatePlusButtons();
}

function adjustBeads(rodId, change) {
    let currentValue = abacusState[rodId] + change;
    const rodIndex = rodOrder.indexOf(rodId);

    if (currentValue > 9) {
        currentValue = 0;
        if (rodIndex > 0) {
            const nextRodId = rodOrder[rodIndex - 1];
            renderBeads(rodId, currentValue);
            setTimeout(() => {
                adjustBeads(nextRodId, 1);
            }, 300);
        } else {
            renderBeads(rodId, currentValue);
        }
    } else if (currentValue < 0) {
        if (rodIndex > 0) {
            const nextRodId = rodOrder[rodIndex - 1];
            if (abacusState[nextRodId] > 0) {
                currentValue = 9;
                renderBeads(rodId, currentValue);
                setTimeout(() => {
                    adjustBeads(nextRodId, -1);
                }, 300);
            } else {
                currentValue = 0;
                renderBeads(rodId, currentValue);
            }
        } else {
            currentValue = 0;
            renderBeads(rodId, currentValue);
        }
    } else {
        renderBeads(rodId, currentValue);
    }
    abacusState[rodId] = currentValue;
    updateUI();
}

function updatePlusButtons() {
    const plusButtonIds = ['tenThousandsPlus', 'thousandsPlus', 'hundredsPlus', 'tensPlus', 'unitsPlus'];
    rodOrder.forEach((rodId, index) => {
        const plusButton = document.getElementById(plusButtonIds[index]);
        const shouldDisable = abacusState[rodId] === 9 && rodOrder.slice(0, index).every(higherRod => abacusState[higherRod] === 9);
        plusButton.disabled = shouldDisable;
    });
}

function calculateAbacusValue() {
    return rodOrder.reduce((total, rodId) => total + abacusState[rodId] * rodMultipliers[rodId], 0);
}

function celebrate() {
    if (isCelebrating) return;
    isCelebrating = true;
    const particleCount = Math.floor(Math.random() * 50) + 500;
    const spread = Math.floor(Math.random() * 20) + 150;
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
    saveStats();
    setTimeout(() => {
        isCelebrating = false;
    }, 2000);
}

function updateUI() {
    const currentValue = calculateAbacusValue();
    const currentValueElement = document.getElementById('currentValue');
    const targetElement = document.getElementById('targetNumber');
    const statusElement = document.getElementById('status');
    const platformElement = document.getElementById('abacusPlatform');
    currentValueElement.textContent = currentValue;
    statusElement.textContent = 'Keep adjusting the beads.';
    statusElement.classList.remove('correct');
    platformElement.classList.remove('correct');
    targetElement.classList.remove('matched');
    currentValueElement.classList.remove('matched');
    updatePlusButtons();
}

function submitAnswer() {
    stats.attempts++;
    const currentValue = calculateAbacusValue();
    if (currentValue === targetNumber) {
        const statusElement = document.getElementById('status');
        const platformElement = document.getElementById('abacusPlatform');
        const targetElement = document.getElementById('targetNumber');
        const currentValueElement = document.getElementById('currentValue');
        statusElement.textContent = 'You matched the number!';
        statusElement.classList.add('correct');
        platformElement.classList.add('correct');
        targetElement.classList.add('matched');
        currentValueElement.classList.add('matched');
        if (isTimerRunning && (stats.fastestTime === null || timerSeconds < stats.fastestTime)) {
            stats.fastestTime = timerSeconds;
        }
        saveStats();
        pauseTimer();
        celebrate();
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

function closePopup() {
    const popup = document.getElementById('tryAgainPopup');
    const overlay = document.getElementById('overlay');
    popup.classList.remove('show');
    overlay.classList.remove('show');
}

function clearAbacus() {
    rodOrder.forEach(rodId => {
        abacusState[rodId] = 0;
        renderBeads(rodId, 0);
    });
    updateUI();
}

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
    startTimer();
    updateUI();
    closePopup();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    const darkModeIcon = document.getElementById('darkModeIcon');
    darkModeIcon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
}

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

document.querySelectorAll('.adjust-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const rodId = event.target.closest('.flex-1').querySelector('.bead-container').id;
        const change = event.target.textContent === '+' ? 1 : -1;
        if (!event.target.disabled) {
            adjustBeads(rodId, change);
        }
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

loadDarkMode();
updateScoreDisplay();
newQuestion();