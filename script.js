const images = [
  "assets/images/IMG_0383.jpg",
  "assets/images/IMG_0387.jpg",
  "assets/images/IMG_0386.jpg",
  "assets/images/IMG_0385.jpg",
  "assets/images/IMG_0384.jpg",
  "assets/images/IMG_0460.jpg",
];

let currentIndex = 0;
let isTransitioning = false;

function createDots() {
  const dotsContainer = document.getElementById("carouselDots");
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";

  images.forEach((_, idx) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.onclick = () => goToImage(idx);
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll(".carousel-dots .dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
  });
}

function showImage(index) {
  const frontImg = document.getElementById("bannerImageFront");
  const backImg = document.getElementById("bannerImageBack");
  if (!frontImg || !backImg || isTransitioning) return;

  isTransitioning = true;
  updateDots();

  // Preload so the fade never reveals a half-loaded image
  const loader = new Image();
  let started = false;
  function runTransition() {
    if (started) return;
    started = true;

    backImg.src = images[index];
    frontImg.style.opacity = "0";

    setTimeout(function () {
      frontImg.style.transition = "none";
      frontImg.src = images[index];
      frontImg.style.opacity = "1";

      setTimeout(function () {
        frontImg.style.transition = "opacity 0.8s ease-in-out";
        isTransitioning = false;
      }, 50);
    }, 800);
  }
  loader.onload = runTransition;
  loader.onerror = runTransition;
  loader.src = images[index];
}

// Auto-rotation: a frame-based timer so the progress bar and the
// rotation always agree, and so pausing keeps the elapsed time.
const ROTATE_MS = 5000;
let elapsed = 0;
let lastFrame = null;
let isPaused = false;

function updateProgress() {
  const fill = document.getElementById("carouselProgress");
  if (fill) fill.style.transform = "scaleX(" + Math.min(elapsed / ROTATE_MS, 1) + ")";
}

function tick(now) {
  if (lastFrame === null) lastFrame = now;
  // Clamp so a background tab doesn't dump a huge time jump into the bar
  const dt = Math.min(now - lastFrame, 100);
  lastFrame = now;

  if (!isPaused) {
    elapsed = Math.min(elapsed + dt, ROTATE_MS);
    // If a fade is still running, wait with a full bar until it finishes
    if (elapsed >= ROTATE_MS && !isTransitioning) {
      elapsed = 0;
      nextImage(false);
    }
    updateProgress();
  }
  requestAnimationFrame(tick);
}

function resetTimer() {
  elapsed = 0;
  updateProgress();
}

function toggleAutoRotate() {
  isPaused = !isPaused;
  const btn = document.getElementById("carouselToggle");
  if (btn) {
    btn.classList.toggle("paused", isPaused);
    btn.setAttribute("aria-label", isPaused ? "Play slideshow" : "Pause slideshow");
  }
}

function goToImage(index) {
  if (isTransitioning || index === currentIndex) return;
  currentIndex = index;
  showImage(currentIndex);
  resetTimer();
}

function nextImage(manual = true) {
  if (isTransitioning) return;
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
  if (manual) {
    resetTimer();
  }
}

function prevImage() {
  if (isTransitioning) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
  resetTimer();
}

document.addEventListener("DOMContentLoaded", function () {
  createDots();
  resetTimer();
  requestAnimationFrame(tick);
});