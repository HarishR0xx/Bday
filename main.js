// ======================================================
// DOM ELEMENTS
// ======================================================
const openCard = document.getElementById("openCard");
const birthdayContent = document.getElementById("birthdayContent");
const moreContent = document.getElementById("moreContent");
const showMore = document.getElementById("showMore");
const bgMusic = document.getElementById("bgMusic");
const backBtn = document.getElementById("backBtn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ======================================================
// CONFIGURATION
// ======================================================
const TOTAL_LILIES = 90;
const BATCH_SIZE = 18;
const BATCH_LIFETIME = 4000; // Each batch lives for 4 seconds
const BATCH_COUNT = TOTAL_LILIES / BATCH_SIZE;
const CYCLE_DURATION = BATCH_COUNT * BATCH_LIFETIME;

const lilies = [];
let bloomStart = null;

// ======================================================
// CANVAS RESIZE
// ======================================================
function resize() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createLilies();
}

window.addEventListener("resize", resize);

// ======================================================
// CREATE LILIES
// ======================================================
function createLilies() {
  lilies.length = 0;
  bloomStart = performance.now();

  for (let i = 0; i < TOTAL_LILIES; i++) {
    const batchIndex = Math.floor(i / BATCH_SIZE);

    lilies.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      scale: 0.18 + Math.random() * 0.45,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2,
      appearAt: batchIndex * BATCH_LIFETIME,
      disappearAt: (batchIndex + 1) * BATCH_LIFETIME,
    });
  }

  // Draw smaller flowers first
  lilies.sort((a, b) => a.scale - b.scale);
}

// ======================================================
// DRAW PETAL
// ======================================================
function drawPetal(length, width, glow) {
  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    width,
    -length * 0.25,
    width * 0.6,
    -length * 0.82,
    0,
    -length,
  );

  ctx.bezierCurveTo(-width * 0.6, -length * 0.82, -width, -length * 0.25, 0, 0);

  ctx.strokeStyle = "rgba(245, 220, 255, 0.96)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#c85cff";
  ctx.shadowBlur = glow;
  ctx.stroke();
}

// ======================================================
// DRAW SINGLE LILY
// ======================================================
function drawLily(lily, time) {
  if (bloomStart === null) return;

  const elapsed = time - bloomStart;

  // Not visible yet
  if (elapsed < lily.appearAt) return;

  // Already disappeared
  if (elapsed >= lily.disappearAt) return;

  ctx.save();

  // Gentle sway
  const sway = Math.sin(time * 0.001 + lily.swayOffset) * 0.06;

  // ----------------------------
  // Bloom scale animation
  // ----------------------------
  const bloomDuration = 1200;
  const bloomElapsed = elapsed - lily.appearAt;
  const bloomProgress = Math.min(bloomElapsed / bloomDuration, 1);
  const bloomScale = 1 - Math.pow(1 - bloomProgress, 3);

  // ----------------------------
  // Fade in
  // ----------------------------
  const fadeInDuration = 1000;
  let fadeIn = 1;

  if (bloomElapsed < fadeInDuration) {
    const p = Math.max(0, bloomElapsed / fadeInDuration);
    fadeIn = p * p * (3 - 2 * p); // smoothstep
  }

  // ----------------------------
  // Fade out
  // ----------------------------
  const fadeOutDuration = 1000;
  const timeUntilDisappear = lily.disappearAt - elapsed;

  let fadeOut = 1;

  if (timeUntilDisappear < fadeOutDuration) {
    const p = Math.max(0, timeUntilDisappear / fadeOutDuration);
    fadeOut = p * p;
  }

  // Final opacity
  const opacity = fadeIn * fadeOut;

  // Apply opacity
  ctx.globalAlpha = opacity;

  // ----------------------------
  // Transform
  // ----------------------------
  ctx.translate(lily.x, lily.y);
  ctx.rotate(lily.rotation + sway);
  ctx.scale(lily.scale * bloomScale, lily.scale * bloomScale);

  // Stem
  ctx.strokeStyle = "rgb(191, 255, 182)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgb(62, 138, 62)";
  ctx.shadowBlur = 6 * opacity;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(12, 70, -10, 140, 0, 220);
  ctx.stroke();
  // Glow
  const glow = (16 + Math.sin(time * 0.003 + lily.swayOffset) * 8) * opacity;

  // Outer petals
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate(((Math.PI * 2) / 6) * i);
    drawPetal(105, 30, glow);
    ctx.restore();
  }

  // Inner petals
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate(((Math.PI * 2) / 6) * i + Math.PI / 6);
    drawPetal(72, 18, glow * 0.7);
    ctx.restore();
  }

  // Center
  ctx.fillStyle = "#fff6b0";
  ctx.shadowColor = "#fff6b0";
  ctx.shadowBlur = 25 * opacity;

  ctx.beginPath();
  ctx.arc(0, -8, 8, 0, Math.PI * 2);
  ctx.fill();

  // Stamens
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate(((Math.PI * 2) / 6) * i);

    ctx.strokeStyle = "#ffe27d";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#ffe27d";
    ctx.shadowBlur = 8 * opacity;

    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(0, -28);
    ctx.stroke();

    ctx.fillStyle = "#ffbf4d";
    ctx.beginPath();
    ctx.arc(0, -30, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

// ======================================================
// BACKGROUND SPARKLES
// ======================================================
function drawSparkles(time) {
  for (let i = 0; i < 25; i++) {
    const x = (Math.sin(time * 0.0002 + i) * 0.5 + 0.5) * innerWidth;
    const y = (Math.cos(time * 0.00016 + i * 2.7) * 0.5 + 0.5) * innerHeight;

    ctx.fillStyle = "rgba(210, 120, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

// ======================================================
// ANIMATION LOOP
// ======================================================
function animate(time) {
  if (bloomStart === null) {
    bloomStart = time;
  }

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  drawSparkles(time);

  // Restart cycle with new random lilies
  const elapsed = time - bloomStart;
  if (elapsed >= CYCLE_DURATION) {
    createLilies();
  }

  // Draw visible lilies
  for (const lily of lilies) {
    drawLily(lily, time);
  }

  requestAnimationFrame(animate);
}

// ======================================================
// AUDIO CONTROL
// ======================================================

// Stop music when page is closed, refreshed, or navigated away
window.addEventListener("beforeunload", () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});

window.addEventListener("beforeunload", () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});

// ======================================================
// UI EVENTS
// ======================================================
let hasOpenedCard = false;

// In your openCard click handler, set this flag BEFORE playing music.
openCard.addEventListener("click", async () => {
  hasOpenedCard = true;

  canvas.classList.remove("hidden");
  openCard.style.transition = "opacity 1s ease";
  openCard.style.opacity = "0";

  createLilies();

  try {
    bgMusic.volume = 0.6;
    await bgMusic.play();
  } catch (err) {
    console.log("Music could not be played.", err);
  }

  setTimeout(() => {
    openCard.style.display = "none";

    birthdayContent.classList.remove("hidden");
    birthdayContent.style.display = "flex";
  }, 1000);
});

// Pause when the tab is hidden.
// Resume only if the user has already opened the card.
document.addEventListener("visibilitychange", async () => {
  if (document.hidden) {
    bgMusic.pause();
  } else {
    // Do not autoplay while the open card screen is still visible.
    if (!hasOpenedCard) return;

    try {
      if (bgMusic.paused) {
        await bgMusic.play();
      }
    } catch (err) {
      console.log("Music could not resume automatically.", err);
    }
  }
});

// Stop and reset only when the page is closed or refreshed.
window.addEventListener("beforeunload", () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
});
showMore.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  createLilies();

  birthdayContent.classList.add("hidden");
  birthdayContent.style.display = "none";

  moreContent.classList.remove("hidden");
  moreContent.style.display = "flex";

  backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  createLilies();

  moreContent.classList.add("hidden");
  moreContent.style.display = "none";

  birthdayContent.classList.remove("hidden");
  birthdayContent.style.display = "flex";

  backBtn.classList.add("hidden");
});

// ======================================================
// INITIALIZE
// ======================================================
resize();
requestAnimationFrame(animate);
