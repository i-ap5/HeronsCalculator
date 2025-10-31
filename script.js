// === ELEMENT REFERENCES (Unchanged) ===
const sideAInput = document.getElementById('sideA');
const sideBInput = document.getElementById('sideB');
const sideCInput = document.getElementById('sideC');
const areaEl = document.getElementById('area');
const perimeterEl = document.getElementById('perimeter');
const errorContainer = document.getElementById('error-container');
const resetButton = document.getElementById('reset-btn');
const trianglePolygon = document.getElementById('triangle-svg');
const labelA = document.getElementById('label-a');
const labelB = document.getElementById('label-b');
const labelC = document.getElementById('label-c');

const inputs = [sideAInput, sideBInput, sideCInput];
const labels = [labelA, labelB, labelC];

// === EVENT LISTENERS (Unchanged) ===
inputs.forEach(input => input.addEventListener('input', calculate));
resetButton.addEventListener('click', resetCalculator);

// Initialize the view on page load
resetCalculator();

// === MAIN CALCULATION FUNCTION (Unchanged) ===
function calculate() {
    errorContainer.style.display = 'none';
    const sideA = parseFloat(sideAInput.value);
    const sideB = parseFloat(sideBInput.value);
    const sideC = parseFloat(sideCInput.value);

    if (isNaN(sideA) || isNaN(sideB) || isNaN(sideC)) {
        resetResults();
        updateTriangleSVG(5, 5, 5, false); // Draw default triangle
        return;
    }
    if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
        showError('All side lengths must be positive numbers.');
        return;
    }
    if ((sideA + sideB <= sideC) || (sideA + sideC <= sideB) || (sideB + sideC <= sideA)) {
        showError('These side lengths do not form a valid triangle.');
        return;
    }

    const perimeter = sideA + sideB + sideC;
    const s = perimeter / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
    perimeterEl.textContent = perimeter.toFixed(2);
    areaEl.textContent = area.toFixed(2);
    updateTriangleSVG(sideA, sideB, sideC, true);
}


// === REWRITTEN SVG DRAWING LOGIC (FIXES ZOOM/CUTOFF) ===
function updateTriangleSVG(a, b, c, showValues = true) {
    const svgWidth = 300;
    const svgHeight = 150;
    const padding = 20;

    // Law of Cosines to find angle A (between sides b and c)
    const angleA_rad = Math.acos((b**2 + c**2 - a**2) / (2 * b * c));

    // Raw vertex coordinates
    let p1_raw = { x: 0, y: 0 };
    let p2_raw = { x: c, y: 0 };
    let p3_raw = { x: b * Math.cos(angleA_rad), y: -b * Math.sin(angleA_rad) };

    // Find bounding box of raw coordinates
    const minX_raw = Math.min(p1_raw.x, p2_raw.x, p3_raw.x);
    const maxX_raw = Math.max(p1_raw.x, p2_raw.x, p3_raw.x);
    const minY_raw = Math.min(p1_raw.y, p2_raw.y, p3_raw.y);
    const maxY_raw = Math.max(p1_raw.y, p2_raw.y, p3_raw.y);

    const rawWidth = maxX_raw - minX_raw;
    const rawHeight = maxY_raw - minY_raw;

    // Determine scale factor to fit within padded SVG area
    const scaleX = (svgWidth - 2 * padding) / rawWidth;
    const scaleY = (svgHeight - 2 * padding) / rawHeight;
    const scaleFactor = Math.min(scaleX, scaleY);

    // Apply scale to all points
    let p1 = { x: p1_raw.x * scaleFactor, y: p1_raw.y * scaleFactor };
    let p2 = { x: p2_raw.x * scaleFactor, y: p2_raw.y * scaleFactor };
    let p3 = { x: p3_raw.x * scaleFactor, y: p3_raw.y * scaleFactor };

    // Recalculate bounding box of scaled points to find offset for centering
    const minX_scaled = Math.min(p1.x, p2.x, p3.x);
    const maxX_scaled = Math.max(p1.x, p2.x, p3.x);
    const minY_scaled = Math.min(p1.y, p2.y, p3.y);
    const maxY_scaled = Math.max(p1.y, p2.y, p3.y);

    const scaledWidth = maxX_scaled - minX_scaled;
    const scaledHeight = maxY_scaled - minY_scaled;

    const xOffset = (svgWidth - scaledWidth) / 2 - minX_scaled;
    const yOffset = (svgHeight - scaledHeight) / 2 - minY_scaled;

    // Apply offset to center the scaled triangle
    p1 = { x: p1.x + xOffset, y: p1.y + yOffset };
    p2 = { x: p2.x + xOffset, y: p2.y + yOffset };
    p3 = { x: p3.x + xOffset, y: p3.y + yOffset };

    const pointsString = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    trianglePolygon.setAttribute('points', pointsString);

    // Update labels
    const textA = showValues ? `a = ${a.toFixed(1)}` : 'a';
    const textB = showValues ? `b = ${b.toFixed(1)}` : 'b';
    const textC = showValues ? `c = ${c.toFixed(1)}` : 'c';

    positionLabel(labelA, p2, p3, textA);
    positionLabel(labelB, p3, p1, textB);
    positionLabel(labelC, p1, p2, textC);

    labels.forEach(label => label.style.display = 'block');
}

// === REWRITTEN LABEL POSITIONING (FIXES INVERTED TEXT) ===
function positionLabel(label, point1, point2, text) {
    const offset = 15;

    const midX = (point1.x + point2.x) / 2;
    const midY = (point1.y + point2.y) / 2;

    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Fix for inverted text: if angle is upside down, flip it
    if (angle > 90 || angle < -90) {
        angle += 180;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    const labelX = midX + nx * offset;
    const labelY = midY + ny * offset;

    label.setAttribute('x', labelX);
    label.setAttribute('y', labelY);
    label.setAttribute('transform', `rotate(${angle}, ${labelX}, ${labelY})`);
    label.textContent = text;
}


// === HELPER FUNCTIONS (Modified slightly for better reset) ===
function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    resetResults();
    updateTriangleSVG(5, 5, 5, false); // Reset to default on error
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
    updateTriangleSVG(5, 5, 5, false); // Draw default triangle with letter labels
}