const screens = {
  intro: document.getElementById("screen-intro"),
  quiz: document.getElementById("screen-quiz"),
  finale: document.getElementById("screen-finale"),
};

const startBtn = document.getElementById("startBtn");
const questionText = document.getElementById("questionText");
const progress = document.getElementById("progress");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const finaleMessage = document.getElementById("finaleMessage");

// Mixed-energy questions (cute → playful → build-up)
const questions = [
  { q: "Are you one of the kindest humans I know?", yes: "Exactly. 💗", no: "Lies detected 😭" },
  { q: "Do you make people feel safe just by being you?", yes: "You really do. 🫶", no: "Be serious pls 😤" },
  { q: "Are you basically the main character?", yes: "As you should. ✨", no: "Wrong answer 😂" },
  { q: "Do you deserve the biggest birthday ever?", yes: "YESSS. 🎂", no: "No button doesn't agree 😌" },
  { q: "Okay last one… ready for your surprise?", yes: "Let’s gooo!!", no: "Too late 😈" },
];

let i = 0;

// helper
function show(which) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[which].classList.add("active");
}

// Start
startBtn.addEventListener("click", () => {
  i = 0;
  show("quiz");
  renderQ();
});

function renderQ() {
  progress.textContent = `Question ${i + 1} / ${questions.length}`;
  questionText.textContent = questions[i].q;
  hint.textContent = "";
  // reset no button position
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
}

// YES click
yesBtn.addEventListener("click", () => {
  hint.textContent = questions[i].yes;
  i++;
  if (i >= questions.length) {
    // go finale
    show("finale");
    finaleMessage.textContent = "Happy Birthday to one of the greatest people I’ve ever met in my life.";
    window.startFinale?.(); // trigger p5 intensity
    return;
  }
  setTimeout(renderQ, 520);
});

// NO click: playful “run away” on last 2 questions
noBtn.addEventListener("mouseenter", () => {
  if (i < 3) return;
  dodgeNoButton();
});
noBtn.addEventListener("click", () => {
  hint.textContent = questions[i].no;
  if (i >= 3) dodgeNoButton();
});

function dodgeNoButton() {
  // move within card area
  const dx = (Math.random() * 220 - 110);
  const dy = (Math.random() * 120 - 60);
  noBtn.style.position = "relative";
  noBtn.style.left = `${dx}px`;
  noBtn.style.top = `${dy}px`;
}
