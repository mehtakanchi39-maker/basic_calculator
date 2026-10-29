const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;

function updateDisplay() {
    display.value = current;
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) {
                throw new Error("Cannot divide by zero");
            }
            return a / b;
    }
}

function formatNumber(number) {
    return String(Number(number.toPrecision(10)));
}

buttons.addEventListener("click", function (event) {
    const button = event.target;

    if (button.tagName !== "BUTTON") return;

    const number = button.dataset.number;
    const op = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
        if (waitingForNumber) {
            current = number === "." ? "0." : number;
            waitingForNumber = false;
        } else if (number === ".") {
            if (!current.includes(".")) current += ".";
        } else {
            current = current === "0" ? number : current + number;
        }
    }

    else if (action === "clear") {
        current = "0";
        previous = null;
        operator = null;
        waitingForNumber = false;
    }

    else if (action === "delete") {
        if (!waitingForNumber) {
            current = current.length > 1
                ? current.slice(0, -1)
                : "0";
        }
    }

    else if (op !== undefined) {
        if (operator && !waitingForNumber) {
            try {
                current = formatNumber(
                    calculate(Number(previous), Number(current), operator)
                );
            } catch {
                current = "Error";
                previous = null;
                operator = null;
                waitingForNumber = true;
                updateDisplay();
                return;
            }
        }

        previous = current;
        operator = op;
        waitingForNumber = true;
    }

    else if (action === "equals") {
        if (operator && previous !== null && !waitingForNumber) {
            try {
                current = formatNumber(
                    calculate(Number(previous), Number(current), operator)
                );
            } catch {
                current = "Error";
            }

            previous = null;
            operator = null;
            waitingForNumber = true;
        }
    }

    updateDisplay();
});