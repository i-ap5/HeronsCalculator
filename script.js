// Get references to all interactive elements
const sideAInput = document.getElementById('sideA');
const sideBInput = document.getElementById('sideB');
const sideCInput = document.getElementById('sideC');
const areaEl = document.getElementById('area');
const perimeterEl = document.getElementById('perimeter');
const errorContainer = document.getElementById('error-container');
const resetButton = document.getElementById('reset-btn');

const inputs = [sideAInput, sideBInput, sideCInput];

// Attach 'input' event listener for real-time calculation
inputs.forEach(input => {
    input.addEventListener('input', calculate);
});

// Attach 'click' event listener for the reset button
resetButton.addEventListener('click', resetCalculator);

function calculate() {
    // Hide error container by default
    errorContainer.style.display = 'none';

    const sideA = parseFloat(sideAInput.value);
    const sideB = parseFloat(sideBInput.value);
    const sideC = parseFloat(sideCInput.value);

    // If any field is empty, just reset and exit
    if (isNaN(sideA) || isNaN(sideB) || isNaN(sideC)) {
        resetResults();
        return;
    }

    // Validation: Display errors inline
    if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
        showError('All side lengths must be positive numbers.');
        return;
    }

    if ((sideA + sideB <= sideC) || (sideA + sideC <= sideB) || (sideB + sideC <= sideA)) {
        showError('These side lengths do not form a valid triangle.');
        return;
    }

    // If validation passes, perform calculations
    const perimeter = sideA + sideB + sideC;
    const s = perimeter / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    perimeterEl.textContent = perimeter.toFixed(2);
    areaEl.textContent = area.toFixed(2);
}

function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block'; // Make the error visible
    resetResults();
}

function resetResults() {
    areaEl.textContent = '0.00';
    perimeterEl.textContent = '0.00';
}

function resetCalculator() {
    sideAInput.value = '';
    sideBInput.value = '';
    sideCInput.value = '';
    errorContainer.style.display = 'none';
    resetResults();
}