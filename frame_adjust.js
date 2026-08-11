const header = document.querySelector('.site-header');
const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

const els = document.querySelectorAll('[data-animate]');
const navLinks = document.querySelectorAll('.site-header nav a[href^="#"]');

const linkById = {};

navLinks.forEach((link) => {
  const hash = link.getAttribute('href');
  if (!hash || !hash.startsWith('#')) return;
  const id = hash.slice(1);
  linkById[id] = link;
});

const setActiveLink = (id) => {
  const correspondingLink = linkById[id];
  if (!correspondingLink) return;

  navLinks.forEach((link) => {
    link.closest('li')?.classList.toggle('is-active', link === correspondingLink);
  });
};

document.querySelectorAll('a[href^="#section-"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.hash);
    if (!target) return;

    target.classList.remove('in-view');
    setActiveLink(target.id);

    const targetBounds = target.getBoundingClientRect();
    const targetIsVisible = targetBounds.bottom > headerHeight
      && targetBounds.top < window.innerHeight * 0.85;

    if (targetIsVisible) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => target.classList.add('in-view'));
      });
    }
  });
});

const updateSections = () => {
  const revealBottom = window.innerHeight * 0.85;
  const navigationLine = headerHeight + Math.min(200, window.innerHeight * 0.2);
  let activeSection = null;

  els.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    const isVisible = bounds.bottom > headerHeight && bounds.top < revealBottom;

    section.classList.toggle('in-view', isVisible);

    if (bounds.top <= navigationLine && bounds.bottom > navigationLine) {
      activeSection = section;
    }
  });

  if (activeSection?.id) {
    setActiveLink(activeSection.id);
  }
};

let updateScheduled = false;

const scheduleSectionUpdate = () => {
  if (updateScheduled) return;

  updateScheduled = true;
  requestAnimationFrame(() => {
    updateSections();
    updateScheduled = false;
  });
};

window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
window.addEventListener('resize', scheduleSectionUpdate);
window.addEventListener('load', scheduleSectionUpdate);

updateSections();
