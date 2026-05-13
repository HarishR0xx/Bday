const openCard = document.getElementById("openCard");
const birthdayContent = document.getElementById("birthdayContent");
const moreContent = document.getElementById("moreContent");
const showMore = document.getElementById("showMore");
const backBtn = document.getElementById("backBtn");
const bgMusic = document.getElementById("bgMusic");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let lilies = [];
let started = false;
let bloomStart = null;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

/* ---------------- CONFIG ---------------- */

const LILY_COUNT = isMobile ? 35 : 110;
const PETALS = isMobile ? 3 : 6;

/* ---------------- INIT ---------------- */
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

window.addEventListener("resize", setVh);
setVh();
function resize() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 🔥 regenerate lilies on resize so layout stays good
  if (started) {
    createLilies();
  }
}

function createLilies() {
  lilies = [];

  for (let i = 0; i < LILY_COUNT; i++) {
    lilies.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      scale: 0.15 + Math.random() * 0.45,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  lilies.sort((a, b) => a.scale - b.scale);
}

/* ---------------- DRAW ---------------- */

function drawPetal(length, width) {
  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    width,
    -length * 0.25,
    width * 0.6,
    -length * 0.82,
    0,
    -length
  );

  ctx.bezierCurveTo(
    -width * 0.6,
    -length * 0.82,
    -width,
    -length * 0.25,
    0,
    0
  );

  ctx.strokeStyle = "rgba(245,220,255,0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLily(lily, time) {
  ctx.save();

  const sway = Math.sin(time * 0.001 + lily.swayOffset) * 0.05;

  ctx.translate(lily.x, lily.y);
  ctx.rotate(lily.rotation + sway);
  ctx.scale(lily.scale, lily.scale);

  /* STEM */
  ctx.strokeStyle = "rgba(120,255,180,0.7)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 180);
  ctx.stroke();

  /* MOBILE SIMPLE MODE */
  if (isMobile) {
    ctx.fillStyle = "#fff6b0";
    ctx.beginPath();
    ctx.arc(0, -10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  /* FULL PETALS (desktop only) */
  for (let i = 0; i < PETALS; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / PETALS) * i);
    drawPetal(95, 26);
    ctx.restore();
  }

  ctx.fillStyle = "#fff6b0";
  ctx.beginPath();
  ctx.arc(0, -10, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ---------------- ANIMATE ---------------- */

let lastFrame = 0;

function animate(time) {
  if (isMobile) {
    if (time - lastFrame < 33) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrame = time;
  }

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const lily of lilies) {
    drawLily(lily, time);
  }

  requestAnimationFrame(animate);
}

/* ---------------- START ---------------- */

function startExperience() {
  if (started) return;
  started = true;

  resize();
  createLilies();
  animate(0);
}

/* ---------------- EVENTS ---------------- */

window.addEventListener("resize", resize);

openCard.addEventListener("click", async () => {
  canvas.classList.remove("hidden");

  bloomStart = performance.now();

  openCard.style.transition = "opacity 1s ease";
  openCard.style.opacity = "0";

  startExperience();

  try {
    bgMusic.volume = 0.6;
    await bgMusic.play();
  } catch (e) { }

  setTimeout(() => {
    openCard.style.display = "none";
    birthdayContent.classList.remove("hidden");
  }, 1000);
});

showMore.addEventListener("click", (e) => {
  e.preventDefault();

  birthdayContent.classList.add("hidden");
  moreContent.classList.remove("hidden");

  backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  moreContent.classList.add("hidden");
  birthdayContent.classList.remove("hidden");

  backBtn.classList.add("hidden");
});

/* ---------------- INIT ---------------- */

resize();const openCard = document.getElementById("openCard");
const birthdayContent = document.getElementById("birthdayContent");
const moreContent = document.getElementById("moreContent");
const showMore = document.getElementById("showMore");
const backBtn = document.getElementById("backBtn");
const bgMusic = document.getElementById("bgMusic");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let lilies = [];
let started = false;
let bloomStart = null;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

/* ---------------- CONFIG ---------------- */

const LILY_COUNT = isMobile ? 35 : 110;
const PETALS = isMobile ? 3 : 6;

/* ---------------- INIT ---------------- */
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}

window.addEventListener("resize", setVh);
setVh();
function resize() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 🔥 regenerate lilies on resize so layout stays good
  if (started) {
    createLilies();
  }
}

function createLilies() {
  lilies = [];

  for (let i = 0; i < LILY_COUNT; i++) {
    lilies.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      scale: 0.15 + Math.random() * 0.45,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  lilies.sort((a, b) => a.scale - b.scale);
}

/* ---------------- DRAW ---------------- */

function drawPetal(length, width) {
  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    width,
    -length * 0.25,
    width * 0.6,
    -length * 0.82,
    0,
    -length
  );

  ctx.bezierCurveTo(
    -width * 0.6,
    -length * 0.82,
    -width,
    -length * 0.25,
    0,
    0
  );

  ctx.strokeStyle = "rgba(245,220,255,0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLily(lily, time) {
  ctx.save();

  const sway = Math.sin(time * 0.001 + lily.swayOffset) * 0.05;

  ctx.translate(lily.x, lily.y);
  ctx.rotate(lily.rotation + sway);
  ctx.scale(lily.scale, lily.scale);

  /* STEM */
  ctx.strokeStyle = "rgba(120,255,180,0.7)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 180);
  ctx.stroke();

  /* MOBILE SIMPLE MODE */
  if (isMobile) {
    ctx.fillStyle = "#fff6b0";
    ctx.beginPath();
    ctx.arc(0, -10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  /* FULL PETALS (desktop only) */
  for (let i = 0; i < PETALS; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / PETALS) * i);
    drawPetal(95, 26);
    ctx.restore();
  }

  ctx.fillStyle = "#fff6b0";
  ctx.beginPath();
  ctx.arc(0, -10, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ---------------- ANIMATE ---------------- */

let lastFrame = 0;

function animate(time) {
  if (isMobile) {
    if (time - lastFrame < 33) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrame = time;
  }

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const lily of lilies) {
    drawLily(lily, time);
  }

  requestAnimationFrame(animate);
}

/* ---------------- START ---------------- */

function startExperience() {
  if (started) return;
  started = true;

  resize();
  createLilies();
  animate(0);
}

/* ---------------- EVENTS ---------------- */

window.addEventListener("resize", resize);

openCard.addEventListener("click", async () => {
  canvas.classList.remove("hidden");

  bloomStart = performance.now();

  openCard.style.transition = "opacity 1s ease";
  openCard.style.opacity = "0";

  startExperience();

  try {
    bgMusic.volume = 0.6;
    await bgMusic.play();
  } catch (e) { }

  setTimeout(() => {
    openCard.style.display = "none";
    birthdayContent.classList.remove("hidden");
  }, 1000);
});

showMore.addEventListener("click", (e) => {
  e.preventDefault();

  birthdayContent.classList.add("hidden");
  moreContent.classList.remove("hidden");

  backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  moreContent.classList.add("hidden");
  birthdayContent.classList.remove("hidden");

  backBtn.classList.add("hidden");
});

/* ---------------- INIT ---------------- */

resize();
