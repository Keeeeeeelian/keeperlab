(() => {
  const carousel = document.querySelector(".gear-carousel");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll(".gear-slide")];
  const track = carousel.querySelector(".gear-slides");
  const toggle = carousel.querySelector(".gear-toggle");
  const count = carousel.querySelector(".gear-count");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let timer;

  function schedule() {
    window.clearTimeout(timer);
    const rotating = !paused && !hovered && !document.hidden;
    track.setAttribute("aria-live", rotating ? "off" : "polite");
    toggle.textContent = paused ? "Reprendre le défilement" : "Mettre en pause";
    if (rotating) timer = window.setTimeout(() => show(index + 1), 5000);
  }

  function show(next) {
    const focusInSlide = slides[index].contains(document.activeElement);
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
    });
    if (focusInSlide) slides[index].querySelector("a").focus();
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    schedule();
  }

  carousel.querySelector(".gear-controls").hidden = false;
  carousel
    .querySelector(".gear-prev")
    .addEventListener("click", () => show(index - 1));
  carousel
    .querySelector(".gear-next")
    .addEventListener("click", () => show(index + 1));
  toggle.addEventListener("click", () => {
    paused = !paused;
    schedule();
  });
  carousel.addEventListener("mouseenter", () => {
    hovered = true;
    schedule();
  });
  carousel.addEventListener("mouseleave", () => {
    hovered = false;
    schedule();
  });
  // Keyboard focus stops rotation until the visitor explicitly restarts it.
  carousel.addEventListener("focusin", () => {
    paused = true;
    schedule();
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    paused = true;
    show(index + (event.key === "ArrowRight" ? 1 : -1));
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) paused = true;
    schedule();
  });
  schedule();
})();
