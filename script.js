const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const heartButton = document.getElementById("heartButton");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
const letterButton = document.getElementById("letterButton");
const letterModal = document.getElementById("letterModal");
const closeModal = document.getElementById("closeModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");

let particles = [];
let w = 0, h = 0;

function resize() {
  w = canvas.width = window.innerWidth * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
window.addEventListener("resize", resize);

function addParticle(x, y, amount = 55) {
  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 2 + Math.random() * 3,
      symbol: Math.random() > .35 ? "♥" : "✦"
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= .985;
    p.vy *= .985;
    p.vy += .018;
    p.life -= .012;

    ctx.globalAlpha = Math.max(0, p.life);
    ctx.font = `${p.size * 4}px serif`;
    ctx.fillStyle = Math.random() > .5 ? "#ff72ad" : "#ffd0e8";
    ctx.fillText(p.symbol, p.x, p.y);
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();

function sparkBurst(x, y) {
  addParticle(x, y, 75);

  const rect = heartButton.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.textContent = Math.random() > .3 ? "♥" : "✦";
    s.style.left = `${rect.left + rect.width / 2}px`;
    s.style.top = `${rect.top + rect.height / 2}px`;
    s.style.setProperty("--x", `${(Math.random() - .5) * 280}px`);
    s.style.setProperty("--y", `${(Math.random() - .5) * 280}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }

  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
}

heartButton.addEventListener("click", (e) => {
  sparkBurst(e.clientX, e.clientY);
});

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicBtn.textContent = "♫ Lagu sedang diputar";
    } catch {
      musicBtn.textContent = "Tambahkan assets/lagu.mp3";
    }
  } else {
    music.pause();
    musicBtn.textContent = "♫ Putar lagu";
  }
});

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    addParticle(innerWidth / 2, innerHeight / 2, 25);
  });
});

letterButton.addEventListener("click", () => {
  letterButton.classList.toggle("open");
  setTimeout(() => {
    letterModal.classList.add("show");
    letterModal.setAttribute("aria-hidden", "false");
  }, 450);
});

function closeLetter() {
  letterModal.classList.remove("show");
  letterModal.setAttribute("aria-hidden", "true");
  letterButton.classList.remove("open");
}

closeModal.addEventListener("click", closeLetter);
modalBackdrop.addEventListener("click", closeLetter);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLetter();
});

// Ambient particles: small floating points
setInterval(() => {
  if (particles.length < 180) {
    particles.push({
      x: Math.random() * innerWidth,
      y: innerHeight + 10,
      vx: (Math.random() - .5) * .2,
      vy: -.25 - Math.random() * .45,
      life: .3 + Math.random() * .7,
      size: 1 + Math.random() * 1.8,
      symbol: "·"
    });
  }
}, 90);
