"use strict";

/* PERSONAL DETAIL: Portfolio interactions for Joshi Paladugu's website. */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();

/* Mobile navigation */
function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

/* Sticky header and back-to-top */
function handleScroll() {
  const scrollPosition = window.scrollY;
  header.classList.toggle("scrolled", scrollPosition > 20);
  backToTop.classList.toggle("visible", scrollPosition > 400);
}
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Active navigation based on the visible section */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const currentId = entry.target.id;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { root: null, rootMargin: "-25% 0px -60% 0px", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

/* Scroll reveal animations */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

revealElements.forEach((element) => revealObserver.observe(element));

/* Animated skill bars */
const skillSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".skill-fill");
const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    skillBars.forEach((bar) => {
      const level = Number(bar.dataset.level);
      if (Number.isFinite(level) && level >= 0 && level <= 100) {
        bar.style.width = `${level}%`;
      }
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.25 });

if (skillSection) skillObserver.observe(skillSection);

/* Rotating hero tagline.
   PERSONAL DETAIL: Phrases describe the user's DevOps/cloud focus. */
const taglines = [
  "real world.",
  "cloud at scale.",
  "delivery workflows.",
  "everyday operations."
];
const typedText = document.getElementById("typed-text");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let taglineIndex = 0;
let characterIndex = taglines[0].length;
let isDeleting = false;
let typingTimer;

function typeTagline() {
  if (!typedText || reduceMotion.matches) return;
  const currentTagline = taglines[taglineIndex];
  characterIndex += isDeleting ? -1 : 1;
  typedText.textContent = currentTagline.slice(0, characterIndex);
  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && characterIndex === currentTagline.length) {
    isDeleting = true;
    delay = 1600;
  } else if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    taglineIndex = (taglineIndex + 1) % taglines.length;
    delay = 350;
  }
  typingTimer = window.setTimeout(typeTagline, delay);
}

function startTaglineAnimation() {
  window.clearTimeout(typingTimer);
  if (reduceMotion.matches) {
    typedText.textContent = taglines[0];
    return;
  }
  taglineIndex = 0;
  characterIndex = taglines[0].length;
  isDeleting = false;
  typingTimer = window.setTimeout(typeTagline, 1600);
}
startTaglineAnimation();
reduceMotion.addEventListener("change", startTaglineAnimation);

/* Contact form:
   This prepares an email in the visitor's default email application.
   It does not transmit or store form data on a server. */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  const mailSubject = encodeURIComponent(subject);
  const mailBody = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );

  formStatus.textContent = "Opening your email application. If it does not open, email joshi.paladugu2000@gmail.com directly.";
  formStatus.style.color = "#54dfa0";

  window.location.href =
    `mailto:joshi.paladugu2000@gmail.com?subject=${mailSubject}&body=${mailBody}`;
});

/* Add a class if a remote placeholder image fails to load. */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.classList.add("image-unavailable");
    img.alt = img.alt || "Image unavailable";
  });
});
