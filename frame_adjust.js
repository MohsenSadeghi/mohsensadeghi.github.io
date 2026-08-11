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

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('in-view');
    observer.unobserve(entry.target);
  });
}, {
  rootMargin: `-${headerHeight}px 0px 0px 0px`,
  threshold: 0,
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

    target.classList.add('in-view');
    setActiveLink(target.id);
  });
});

const navigationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.id) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: `-${headerHeight}px 0px -70% 0px`,
  threshold: 0,
});

els.forEach((el) => {
  revealObserver.observe(el);
  navigationObserver.observe(el);
});
