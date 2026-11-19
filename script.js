document.documentElement.classList.add("js");

const yearLabel = document.querySelector("#current-year");
const philosophy = document.querySelector(".philosophy");
const philosophyArt = document.querySelector(".philosophy-art");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".projects-heading, .project-copy, .experience-heading, .timeline-card, .certifications, .contact-heading, .contact-form")
    .forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}

const updatePhilosophy = () => {
  if (!philosophy || !philosophyArt || reducedMotion) {
    return;
  }

  const bounds = philosophy.getBoundingClientRect();
  const travel = Math.max(1, philosophy.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -bounds.top / travel));
  const compact = window.innerWidth <= 640;
  const widthShift = window.innerWidth * (compact ? 0.08 : 0.12) * progress;
  const heightShift = window.innerHeight * (compact ? 0.14 : 0.18) * progress;
  const topShift = window.innerHeight * (compact ? 0.07 : 0.09) * progress;

  philosophyArt.style.setProperty("--art-width-shift", `${widthShift}px`);
  philosophyArt.style.setProperty("--art-height-shift", `${heightShift}px`);
  philosophyArt.style.setProperty("--art-top-shift", `${topShift}px`);
  philosophyArt.style.setProperty("--art-radius", `${24 * (1 - progress)}px`);
};

let scrollFrame = 0;
const schedulePhilosophyUpdate = () => {
  if (scrollFrame) {
    return;
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    updatePhilosophy();
  });
};

window.addEventListener("scroll", schedulePhilosophyUpdate, { passive: true });
window.addEventListener("resize", schedulePhilosophyUpdate);
updatePhilosophy();

const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    if (formNote) {
      formNote.textContent = "Opening your email app with your message ready to send.";
    }

    window.location.href = `mailto:jalandharmandra2@gmail.com?subject=${subject}&body=${body}`;
  });
}
