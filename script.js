function calculate() {
    const sideA = parseFloat(document.getElementById('sideA').value);
    const sideB = parseFloat(document.getElementById('sideB').value);
    const sideC = parseFloat(document.getElementById('sideC').value);

    if (isNaN(sideA) || isNaN(sideB) || isNaN(sideC) || sideA <= 0 || sideB <= 0 || sideC <= 0) {
        alert("Please enter valid positive numbers for all sides.");
        return;
    }

    if ((sideA + sideB <= sideC) || (sideA + sideC <= sideB) || (sideB + sideC <= sideA)) {
        alert("The entered side lengths do not form a valid triangle.");
        return;
    }

    const perimeter = sideA + sideB + sideC;
    const s = perimeter / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    document.getElementById('perimeter').textContent = perimeter.toFixed(2);
    document.getElementById('area').textContent = area.toFixed(2);
}