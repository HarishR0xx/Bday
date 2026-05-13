const openCard = document.getElementById("openCard");
const birthdayContent = document.getElementById("birthdayContent");
const moreContent = document.getElementById("moreContent");
const showMore = document.getElementById("showMore");
const bgMusic = document.getElementById("bgMusic");
const backBtn = document.getElementById("backBtn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const lilies = [];
let bloomStart = null;

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

function createLilies() {
  lilies.length = 0;
  const count = 35;
  for (let i = 0; i < count; i++) {
    lilies.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      scale: 0.18 + Math.random() * 0.45,
      rotation: Math.random() * Math.PI * 2,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  lilies.sort((a, b) => a.scale - b.scale);
}

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

  ctx.strokeStyle = "rgba(245, 220, 255, 0.96)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#c85cff";
  ctx.shadowBlur = 25;
  ctx.stroke();
}

function drawLily(lily, time) {
  ctx.save();

  const sway = Math.sin(time * 0.001 + lily.swayOffset) * 0.06;

  let bloomScale = 1;

  if (bloomStart !== null) {
    const elapsed = time - bloomStart;
    const duration = 2000;
    const progress = Math.min(elapsed / duration, 1);
    bloomScale = 1 - Math.pow(1 - progress, 3);
  }

  ctx.translate(lily.x, lily.y);
  ctx.rotate(lily.rotation + sway);
  ctx.scale(lily.scale * bloomScale, lily.scale * bloomScale);

  ctx.strokeStyle = "rgba(90, 255, 150, 0.85)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#6cff8e";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(12, 70, -10, 140, 0, 220);
  ctx.stroke();

  const glow = 16 + Math.sin(time * 0.003 + lily.swayOffset) * 8;

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i);
    drawPetal(105, 30, glow);
    ctx.restore();
  }

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i + Math.PI / 6);
    drawPetal(72, 18, glow * 0.7);
    ctx.restore();
  }

  ctx.fillStyle = "#fff6b0";
  ctx.shadowColor = "#fff6b0";
  ctx.shadowBlur = 25;

  ctx.beginPath();
  ctx.arc(0, -8, 8, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i);
    ctx.strokeStyle = "#ffe27d";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#ffe27d";
    ctx.shadowBlur = 8;
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

function animate(time) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  drawSparkles(time);

  for (const lily of lilies) {
    drawLily(lily, time);
  }

  requestAnimationFrame(animate);
}

openCard.addEventListener("click", async () => {
  const canvas = document.getElementById("canvas");
  canvas.classList.remove("hidden");
  bloomStart = performance.now();
  openCard.style.transition = "opacity 1s ease";
  openCard.style.opacity = "0";
  try {
    bgMusic.volume = 0.6;
    await bgMusic.play();
  } catch (error) {
    console.log("Music could not be played.");
  }
  setTimeout(() => {
    openCard.style.display = "none";
    birthdayContent.classList.remove("hidden");
  }, 1000);
});

showMore.addEventListener("click", (event) => {

  const canvas = document.getElementById("canvas");
  bloomStart = performance.now();

  event.preventDefault();
  event.stopPropagation();

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

  bloomStart = performance.now(); // optional: re-trigger bloom effect
});
resize();
animate(0);

