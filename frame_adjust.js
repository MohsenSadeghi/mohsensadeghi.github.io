const header = document.querySelector('.site-header'); // or '#header'
const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

const els = document.querySelectorAll('[data-animate]');
//console.log('Animate targets found:', els.length); // sanity check

const navLinks = document.querySelectorAll('.site-header nav a[href^="#"]');

// Build a quick map: sectionId -> <a>
const linkById = {};

navLinks.forEach((link) => {
  const hash = link.getAttribute('href');
  if (!hash || !hash.startsWith('#')) return;
  const id = hash.slice(1);
  linkById[id] = link;
  
  //console.log(hash);
});

const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
          
        // Toggle on enter/leave (use only add() if you want it to animate once)
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
        
      if (entry.isIntersecting && entry.target.id) {
          
        const id = entry.target.id;
        const correspondingLink = linkById[id];
        if (!correspondingLink) return;

        // Remove active from all
        navLinks.forEach((link) => {
          const li = link.closest('li');
          if (li) li.classList.remove('is-active');
        });

        // Add active to the matching <li>
        const li = correspondingLink.closest('li');
        if (li) li.classList.add('is-active');
      }
          
  });
},
{
  root: null,
  threshold: 0.1,
  // Offset the top edge by the header height so intersection happens earlier
  rootMargin: `-${headerHeight}px 0px 0px 0px`,
}
);

els.forEach((el, i) => {
observer.observe(el);
// Extra debug: see which ones are actually being observed
el.dataset._observedIndex = i;
});
