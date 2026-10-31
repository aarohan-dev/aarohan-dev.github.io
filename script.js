const images = [
  "assets/images/IMG_0383.jpg",
  "assets/images/IMG_0387.jpg",
  "assets/images/IMG_0386.jpg",
  "assets/images/IMG_0385.jpg",
  "assets/images/IMG_0384.jpg",
  "assets/images/IMG_0460.jpg",
];

let currentIndex = 0;
let autoRotateTimer = null;
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

  // 1. Set the background image to the target image
  backImg.src = images[index];

  // 2. Fade out front image to reveal the background
  frontImg.style.opacity = "0";

  setTimeout(function () {
    // 3. Swap front image and instantly restore opacity
    frontImg.style.transition = "none";
    frontImg.src = images[index];
    frontImg.style.opacity = "1";

    // 4. Re-enable transitions for the subsequent slide
    setTimeout(function () {
      frontImg.style.transition = "opacity 0.8s ease-in-out";
      isTransitioning = false;
    }, 50);
  }, 800);

  updateDots();
}

function resetTimer() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
  }
  // Restart the automatic 5-second interval
  autoRotateTimer = setInterval(function () {
    nextImage(false);
  }, 5000);
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
});