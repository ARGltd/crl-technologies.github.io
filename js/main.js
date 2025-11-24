// Mobile navigation toggle
const hamb = document.querySelector('.hamb');
const navLinks = document.querySelector('.nav-links');

if (hamb && navLinks) {
  hamb.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamb.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Optional: smooth scroll for internal anchors on the same page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
