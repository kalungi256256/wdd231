// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('active');
        });
    }

    // Close navigation when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 768 && nav && hamburger) {
            if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
});