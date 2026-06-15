// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}

function sinDeg(x) { return Math.sin(x * Math.PI / 180); }
function cosDeg(x) { return Math.cos(x * Math.PI / 180); }
function tanDeg(x) { return Math.tan(x * Math.PI / 180); }
function asinDeg(x) { return Math.asin(x) * 180 / Math.PI; }
function acosDeg(x) { return Math.acos(x) * 180 / Math.PI; }
function atanDeg(x) { return Math.atan(x) * 180 / Math.PI; }


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
   
    let normalizedExpression = normalizeExpression(expression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);
 
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    return result;
  } catch (e) {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) return;
    const display = document.getElementById("result"); 
    // Calculate result
    let result = calculateExpression(currentExpression);
    result = String(result);

    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ===============================
// 🌍 NUMBER TRANSLATION
// ===============================

const englishNumberWords = {
  zero: "zero",
  units: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  teens: ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
  tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
  hundred: "hundred",
  thousand: "thousand",
  million: "million",
  billion: "billion",
  trillion: "trillion",
  and: "and",
  negative: "negative",
  point: "point",
};

const numberWords = {
  zero: "sifili",
  units: ["", "ɗaya", "biyu", "uku", "huɗu", "biyar", "shida", "bakwai", "takwas", "tara"],
  teens: ["goma", "goma sha ɗaya", "goma sha biyu", "goma sha uku", "goma sha huɗu", "goma sha biyar", "goma sha shida", "goma sha bakwai", "goma sha takwas", "goma sha tara"],
  tens: ["", "", "ashirin", "talatin", "arba'in", "hamsin", "sittin", "saba'in", "tamanin", "tsannin"],
  hundred: "ɗari",
  thousand: "dubu",
  million: "miliyan",
  billion: "biliyan",
  trillion: "tiriliyan",
  and: "da",
  negative: "ƙasa da sifili",
  point: "digo",
};

function convertToWords(num) {
  if (typeof num !== "number" || isNaN(num) || !isFinite(num)) return "";

  const w = numberWords;
  let isNegative = false;
  if (num < 0) { isNegative = true; num = Math.abs(num); }

  let decimalPart = null;
  const str = String(num);
  const dotIdx = str.indexOf(".");
  const eIdx = str.indexOf("e");
  if (dotIdx !== -1 && eIdx === -1) {
    decimalPart = str.slice(dotIdx + 1);
    num = parseInt(str.slice(0, dotIdx)) || 0;
  } else if (eIdx !== -1) {
    num = parseFloat(str);
    if (!isFinite(num)) return "";
  }

  const scales = [
    [1e12, w.trillion],
    [1e9, w.billion],
    [1e6, w.million],
    [1e3, w.thousand],
  ];

  function convertInt(n) {
    if (n === 0) return "";
    for (const [divisor, name] of scales) {
      if (n >= divisor) {
        const q = Math.floor(n / divisor);
        const r = n % divisor;
        let part = q === 1 ? name : convertInt(q) + " " + name;
        if (r > 0) part += " " + w.and + " " + convertInt(r);
        return part;
      }
    }
    let s = "";
    if (n >= 100) {
      const h = Math.floor(n / 100);
      s += h === 1 ? w.hundred : w.hundred + " " + w.units[h];
      n %= 100;
      if (n > 0) s += " " + w.and + " ";
    }
    if (n >= 20) {
      s += w.tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) s += " " + w.and + " ";
    } else if (n >= 10) {
      s += w.teens[n - 10];
      n = 0;
    }
    if (n > 0) s += w.units[n];
    return s;
  }

  let result;
  if (num === 0 && decimalPart === null) {
    result = w.zero;
  } else {
    result = convertInt(num) || "";
  }

  if (decimalPart !== null) {
    if (!result) result = w.zero;
    result += " " + w.point;
    for (const ch of decimalPart) {
      result += " " + (w.units[+ch] || w.units[0]);
    }
  }

  if (isNegative) result = w.negative + " " + result;
  return result.trim();
}

function convertToEnglishWords(num) {
  if (typeof num !== "number" || isNaN(num) || !isFinite(num)) return "";

  const w = englishNumberWords;
  let isNegative = false;
  if (num < 0) { isNegative = true; num = Math.abs(num); }

  let decimalPart = null;
  const str = String(num);
  const dotIdx = str.indexOf(".");
  const eIdx = str.indexOf("e");
  if (dotIdx !== -1 && eIdx === -1) {
    decimalPart = str.slice(dotIdx + 1);
    num = parseInt(str.slice(0, dotIdx)) || 0;
  } else if (eIdx !== -1) {
    num = parseFloat(str);
    if (!isFinite(num)) return "";
  }

  const scales = [
    [1e12, w.trillion],
    [1e9, w.billion],
    [1e6, w.million],
    [1e3, w.thousand],
  ];

  function convertInt(n) {
    if (n === 0) return "";
    for (const [divisor, name] of scales) {
      if (n >= divisor) {
        const q = Math.floor(n / divisor);
        const r = n % divisor;
        let part = q === 1 ? name : convertInt(q) + " " + name;
        if (r > 0) part += " " + w.and + " " + convertInt(r);
        return part;
      }
    }
    let s = "";
    if (n >= 100) {
      const h = Math.floor(n / 100);
      s += h === 1 ? w.hundred : w.units[h] + " " + w.hundred;
      n %= 100;
      if (n > 0) s += " " + w.and + " ";
    }
    if (n >= 20) {
      s += w.tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) s += " " + w.and + " ";
    } else if (n >= 10) {
      s += w.teens[n - 10];
      n = 0;
    }
    if (n > 0) s += w.units[n];
    return s;
  }

  let result;
  if (num === 0 && decimalPart === null) {
    result = w.zero;
  } else {
    result = convertInt(num) || "";
  }

  if (decimalPart !== null) {
    if (!result) result = w.zero;
    result += " " + w.point;
    for (const ch of decimalPart) {
      result += " " + (w.units[+ch] || w.units[0]);
    }
  }

  if (isNegative) result = w.negative + " " + result;
  return result.trim();
}

function translateHausa() {
  const display = document.getElementById("result");
  const wordDisplay = document.getElementById("word-display");
  const wordResult = document.getElementById("word-result");
  const langLabel = document.getElementById("lang-label");
  const speakBtn = document.getElementById("speak-btn");

  const rawValue = display.value;
  if (!rawValue || rawValue === "0" || rawValue === "Error") {
    wordDisplay.style.display = "none";
    return;
  }

  const num = parseFloat(rawValue);
  if (isNaN(num)) {
    wordDisplay.style.display = "none";
    return;
  }

  const words = convertToWords(num);
  wordResult.textContent = words || rawValue;
  langLabel.textContent = "Hausa";
  wordDisplay.style.display = "flex";
  speakBtn.disabled = false;
}

function speakHausa() {
  const wordResult = document.getElementById("word-result");
  const text = wordResult.textContent;
  if (!text) return;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ha";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function translateEnglish() {
  const display = document.getElementById("result");
  const wordDisplay = document.getElementById("word-display");
  const wordResult = document.getElementById("word-result");
  const langLabel = document.getElementById("lang-label");
  const speakBtn = document.getElementById("speak-btn");

  const rawValue = display.value;
  if (!rawValue || rawValue === "0" || rawValue === "Error") {
    wordDisplay.style.display = "none";
    return;
  }

  const num = parseFloat(rawValue);
  if (isNaN(num)) {
    wordDisplay.style.display = "none";
    return;
  }

  const words = convertToEnglishWords(num);
  wordResult.textContent = words || rawValue;
  langLabel.textContent = "English";
  wordDisplay.style.display = "flex";
  speakBtn.disabled = false;
}

function speakCurrentLang() {
  const langLabel = document.getElementById("lang-label");
  if (langLabel.textContent === "English") {
    speakEnglish();
  } else {
    speakHausa();
  }
}

function speakEnglish() {
  const wordResult = document.getElementById("word-result");
  const text = wordResult.textContent;
  if (!text) return;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}