const openCard = document.getElementById("openCard");
const birthdayContent = document.getElementById("birthdayContent");
const moreContent = document.getElementById("moreContent");
const showMore = document.getElementById("showMore");
const backBtn = document.getElementById("backBtn");
const bgMusic = document.getElementById("bgMusic");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let lilies = [];
let bloomStart = null;
let started = false;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

/* -------------------- LILIES -------------------- */

function createLilies() {
  lilies = [];

  const count = isMobile
    ? 60
    : Math.min(140, Math.floor((innerWidth * innerHeight) / 14000));

  for (let i = 0; i < count; i++) {
    lilies.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      scale: 0.15 + Math.random() * 0.5,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  lilies.sort((a, b) => a.scale - b.scale);
}

/* -------------------- RESIZE -------------------- */

function resize() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* -------------------- DRAWING -------------------- */

function drawPetal(length, width, glow) {
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

  ctx.strokeStyle = "rgba(245, 220, 255, 0.9)";
  ctx.lineWidth = 2;

  ctx.shadowColor = "#c85cff";
  ctx.shadowBlur = isMobile ? 0 : glow;

  ctx.stroke();
}

function drawLily(lily, time) {
  ctx.save();

  const sway = Math.sin(time * 0.001 + lily.swayOffset) * 0.08;

  let bloomScale = 1;
  if (bloomStart !== null) {
    const progress = Math.min((time - bloomStart) / 2000, 1);
    bloomScale = 1 - Math.pow(1 - progress, 3);
  }

  ctx.translate(lily.x, lily.y);
  ctx.rotate(lily.rotation + sway);
  ctx.scale(lily.scale * bloomScale, lily.scale * bloomScale);

  /* stem */
  ctx.strokeStyle = "rgba(90,255,150,0.7)";
  ctx.lineWidth = 3;
  ctx.shadowBlur = isMobile ? 0 : 10;
  ctx.shadowColor = "#6cff8e";

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(12, 70, -10, 140, 0, 220);
  ctx.stroke();

  /* petals */
  const glow = 12 + Math.sin(time * 0.003 + lily.swayOffset) * 6;

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i);
    drawPetal(100, 28, glow);
    ctx.restore();
  }

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i + Math.PI / 6);
    drawPetal(70, 16, glow * 0.7);
    ctx.restore();
  }

  /* center */
  ctx.shadowBlur = isMobile ? 8 : 25;
  ctx.shadowColor = "#fff6b0";
  ctx.fillStyle = "#fff6b0";

  ctx.beginPath();
  ctx.arc(0, -8, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* -------------------- SPARKLES -------------------- */

function drawSparkles(time) {
  if (isMobile) return;

  for (let i = 0; i < 25; i++) {
    const x =
      (Math.sin(time * 0.0002 + i) * 0.5 + 0.5) * innerWidth;
    const y =
      (Math.cos(time * 0.00016 + i * 2.7) * 0.5 + 0.5) * innerHeight;

    ctx.fillStyle = "rgba(210, 120, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

/* -------------------- ANIMATION -------------------- */

function animate(time) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  drawSparkles(time);

  for (const lily of lilies) {
    drawLily(lily, time);
  }

  requestAnimationFrame(animate);
}

/* -------------------- START SYSTEM -------------------- */

function startExperience() {
  if (started) return;
  started = true;

  resize();
  createLilies();
  animate(0);
}

/* -------------------- EVENTS -------------------- */

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
  } catch (e) {}

  setTimeout(() => {
    openCard.style.display = "none";
    birthdayContent.classList.remove("hidden");
  }, 1000);
});

showMore.addEventListener("click", (event) => {
  event.preventDefault();

  bloomStart = performance.now();

  birthdayContent.classList.add("hidden");
  birthdayContent.style.display = "none";

  moreContent.classList.remove("hidden");
  moreContent.style.display = "flex";

  backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  moreContent.classList.add("hidden");
  moreContent.style.display = "none";

  birthdayContent.classList.remove("hidden");
  birthdayContent.style.display = "flex";

  backBtn.classList.add("hidden");
});

/* -------------------- INIT -------------------- */

resize();
