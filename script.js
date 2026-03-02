// ---------- Screen refs ----------
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

// Meme popup refs (from index.html)
const memePop = document.getElementById("memePop");
const memeImg = document.getElementById("memeImg");

// Runner canvas refs (from index.html)
const runnerCanvas = document.getElementById("runnerCanvas");
const rctx = runnerCanvas?.getContext("2d");

// Finale drifting photos container (from index.html)
const photoGallery = document.getElementById("photoGallery");

// ---------- Customize these ----------
const questions = [
  { q: "Are you one of the kindest humans I know?", yes: "Exactly. 💗", no: "Lies detected 😭" },
  { q: "Do you make people feel safe just by being you?", yes: "You really do. 🫶", no: "Be serious pls 😤" },
  { q: "Are you basically the main character?", yes: "As you should. ✨", no: "Wrong answer 😂" },
  { q: "Do you deserve the biggest birthday ever?", yes: "YESSS. 🎂", no: "No button doesn't agree 😌" },
  { q: "Okay last one… ready for your surprise?", yes: "Let’s gooo!!", no: "Too late 😈" },
];

// Memes folder (you already have these!)
const memeList = [
  "memes/no1.jpeg",
  "memes/no2.jpeg",
  "memes/no3.jpeg",
];

// Photos folder
const photoSources = [
  "images/hiba1.jpeg",
  "images/hiba2.jpeg",
  "images/hiba3.jpeg",
];

// ---------- YES burst layer (hearts + sparkles) ----------
const burstLayer = document.createElement("div");
burstLayer.className = "burst-layer";
document.body.appendChild(burstLayer);

function yesBurst() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const icons = ["✨","💖","💘","⭐","💞","✨","💗","🌟","💝"];
  const count = 18;

  for (let k = 0; k < count; k++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];

    const sx = cx + rand(-40, 40);
    const sy = cy + rand(-30, 30);

    const tx = sx + rand(-240, 240);
    const ty = sy + rand(-200, 200);

    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);

    burstLayer.appendChild(el);
    setTimeout(() => el.remove(), 780);
  }
}

// ---------- State ----------
let i = 0;

// ---------- Helpers ----------
function show(which) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[which].classList.add("active");
}

function renderQ() {
  progress.textContent = `Question ${i + 1} / ${questions.length}`;
  questionText.textContent = questions[i].q;
  hint.textContent = "";

  // reset no button position
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
}

// ---------- Start ----------
startBtn.addEventListener("click", () => {
  i = 0;
  show("quiz");
  renderQ();
});

// ---------- YES click ----------
yesBtn.addEventListener("click", () => {
  hint.textContent = questions[i].yes;

  // NEW: sparkly hearts burst
  yesBurst();

  i++;

  if (i >= questions.length) {
    show("finale");

    finaleMessage.textContent =
      "Happy Birthday to one of the greatest people I’ve ever met in my life.";

    // start p5 finale animation (from animation.js)
    window.startFinale?.();

    // start drifting duplicated photos
    startFloatingPhotos();

    return;
  }

  setTimeout(renderQ, 520);
});

// ---------- NO behavior ----------
noBtn.addEventListener("mouseenter", () => {
  // only dodge after question 3
  if (i < 3) return;
  dodgeNoButton();
});

noBtn.addEventListener("click", () => {
  hint.textContent = questions[i].no;

  // NEW: shake + meme pop
  showMeme();

  // dodge after question 3
  if (i >= 3) dodgeNoButton();
});

function dodgeNoButton() {
  const dx = (Math.random() * 220 - 110);
  const dy = (Math.random() * 120 - 60);
  noBtn.style.position = "relative";
  noBtn.style.left = `${dx}px`;
  noBtn.style.top = `${dy}px`;
}

// ---------- Meme popup (dramatic + shake) ----------
function showMeme() {
  if (!memePop || !memeImg || memeList.length === 0) return;

  const src = memeList[Math.floor(Math.random() * memeList.length)];
  memeImg.src = src;

  // Shake the whole app
  const app = document.getElementById("app");
  app?.classList.remove("shake");
  void app?.offsetWidth; // restart animation
  app?.classList.add("shake");

  // Meme popup
  memePop.classList.add("show");

  // auto close
  setTimeout(() => memePop.classList.remove("show"), 950);
  setTimeout(() => app?.classList.remove("shake"), 450);
}

memePop?.addEventListener("click", () => memePop.classList.remove("show"));

// ---------- Pixel runner (brown hair) ----------
let runnerT = 0;

function runnerLoop() {
  if (!rctx || !runnerCanvas) return;

  const W = runnerCanvas.width;
  const H = runnerCanvas.height;

  rctx.clearRect(0, 0, W, H);

  // ground blocks
  for (let x = 0; x < W; x += 18) {
    rctx.fillStyle = "rgba(255,255,255,.14)";
    rctx.fillRect((x - (runnerT * 2) % 18), H - 16, 16, 10);
  }

  // sparkles
  for (let k = 0; k < 7; k++) {
    const sx = (k * 80 + (runnerT * 3)) % W;
    const sy = 14 + (k % 3) * 10;
    rctx.fillStyle = "rgba(255,255,255,.35)";
    rctx.fillRect(sx, sy, 3, 3);
  }

  // moving runner
  const stepPhase = runnerT * 0.18;
  const x = 20 + ((runnerT * 2.2) % (W - 120));
  const y = 18;

  drawPixelGirl(rctx, x, y, stepPhase);

  runnerT++;
  requestAnimationFrame(runnerLoop);
}

function drawPixelGirl(ctx, x, y, stepPhase) {
  const p = 5;

  const hair = "#6b3f2a"; // brown hair
  const skin = "#ffd1b8";
  const dress = "#ff6fae";
  const shoe = "#2a1c2a";

  function px(col, gx, gy, w = 1, h = 1) {
    ctx.fillStyle = col;
    ctx.fillRect(x + gx * p, y + gy * p, w * p, h * p);
  }

  const bob = Math.round(Math.sin(stepPhase) * 1);
  const armSwing = Math.round(Math.sin(stepPhase) * 1);
  const legA = Math.round(Math.sin(stepPhase) * 1);
  const legB = -legA;

  // hair + head
  px(hair, 2, 0 + bob, 4, 1);
  px(hair, 1, 1 + bob, 6, 2);
  px(skin, 2, 2 + bob, 4, 2);
  px(hair, 1, 3 + bob, 1, 1);
  px(hair, 6, 3 + bob, 1, 1);

  // body
  px(dress, 3, 4 + bob, 2, 3);
  px(dress, 2, 6 + bob, 4, 2);

  // arms
  px(skin, 1, 5 + bob + armSwing, 1, 2);
  px(skin, 6, 5 + bob - armSwing, 1, 2);

  // legs
  px(skin, 3, 8 + bob, 1, 2);
  px(skin, 4, 8 + bob, 1, 2);

  // shoes
  px(shoe, 3 + legA, 10 + bob, 2, 1);
  px(shoe, 3 + legB, 10 + bob, 2, 1);
}

if (runnerCanvas) runnerLoop();

// ---------- Finale drifting photos (duplicates) ----------
let photoNodes = [];
let photoAnimRunning = false;

function startFloatingPhotos() {
  if (!photoGallery || photoAnimRunning) return;
  photoAnimRunning = true;

  photoGallery.innerHTML = "";
  photoNodes = [];

  const COPIES_PER_PHOTO = 4; // 3 photos * 4 = 12 floating photos

  for (let src of photoSources) {
    for (let k = 0; k < COPIES_PER_PHOTO; k++) {
      const img = document.createElement("img");
      img.src = src;
      img.className = "photo-float";
      img.style.animationDelay = `${rand(0, 900)}ms`;

      const node = {
        el: img,
        x: rand(140, window.innerWidth - 140),
        y: rand(140, window.innerHeight - 140),
        vx: rand(-0.28, 0.28),
        vy: rand(-0.22, 0.22),
        amp: rand(6, 18),
        freq: rand(0.006, 0.016),
        phase: rand(0, Math.PI * 2),
        rot: rand(-12, 12),
        rotSpeed: rand(-0.05, 0.05),
        scale: rand(0.78, 1.06),
      };

      photoGallery.appendChild(img);
      photoNodes.push(node);
    }
  }

  requestAnimationFrame(tickPhotos);
}

function tickPhotos(t) {
  const onFinale = screens.finale.classList.contains("active");
  if (!onFinale) {
    photoAnimRunning = false;
    return;
  }

  const W = window.innerWidth;
  const H = window.innerHeight;

  for (let n of photoNodes) {
    n.x += n.vx;
    n.y += n.vy;

    const pad = 120;
    if (n.x < pad || n.x > W - pad) n.vx *= -1;
    if (n.y < pad || n.y > H - pad) n.vy *= -1;

    const bob = n.amp * Math.sin((t * n.freq) + n.phase);
    n.rot += n.rotSpeed;

    n.el.style.transform =
      `translate(${n.x}px, ${n.y + bob}px) translate(-50%, -50%) scale(${n.scale}) rotate(${n.rot}deg)`;
  }

  requestAnimationFrame(tickPhotos);
}

// ---------- utils ----------
function rand(a, b) {
  return a + Math.random() * (b - a);
}
