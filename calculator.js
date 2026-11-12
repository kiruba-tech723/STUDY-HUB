// ===== calculator.js : simple calculator + GPA calculator =====

const screen = document.getElementById("calcScreen");
let expression = "";

function updateScreen(text) {
  screen.textContent = text === "" ? "0" : text;
}

function calculate() {
  if (expression === "") return;
  // Only allow digits, operators and dot
  if (!/^[0-9+\-*/.]+$/.test(expression)) {
    updateScreen("Error");
    expression = "";
    return;
  }
  // Zero-division check: a "/" followed by 0 (like /0 or /0.0)
  if (/\/\s*0+(\.0*)?(?![0-9.])/.test(expression)) {
    updateScreen("Cannot divide by 0");
    expression = "";
    return;
  }
  try {
    // Function() is used here only for a simple demo; the input is already filtered above
    let result = Function("return " + expression)();
    if (!isFinite(result) || isNaN(result)) {
      updateScreen("Error");
      expression = "";
      return;
    }
    result = Math.round(result * 1000000) / 1000000;
    expression = String(result);
    updateScreen(expression);
  } catch (err) {
    updateScreen("Error");
    expression = "";
  }
}

if (screen) {
  document.querySelectorAll(".calc-keys button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.dataset.key;
      if (key === "C") {
        expression = "";
        updateScreen("");
      } else if (key === "=") {
        calculate();
      } else {
        // clear an old error message before typing again
        if (screen.textContent === "Error" || screen.textContent.startsWith("Cannot")) {
          expression = "";
        }
        expression += key;
        updateScreen(expression);
      }
    });
  });
}

// ----- GPA calculator (uses the same idea: sum(credit x grade point) / sum(credits)) -----
const gpaBtn = document.getElementById("gpaBtn");
if (gpaBtn) {
  gpaBtn.addEventListener("click", function () {
    const rows = document.querySelectorAll(".gpa-row");
    let totalPoints = 0;
    let totalCredits = 0;
    rows.forEach(function (row) {
      const credit = parseFloat(row.querySelector(".credit").value);
      const grade = parseFloat(row.querySelector(".grade").value);
      if (!isNaN(credit) && credit > 0 && !isNaN(grade)) {
        totalPoints += credit * grade;
        totalCredits += credit;
      }
    });
    const out = document.getElementById("gpaResult");
    if (totalCredits === 0) {
      out.textContent = "Enter credits and select grades first.";
    } else {
      out.textContent = "Your GPA: " + (totalPoints / totalCredits).toFixed(2);
    }
  });
}
