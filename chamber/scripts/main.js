// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Set last modified date
    document.getElementById('last-modified').textContent = document.lastModified;

    // Mobile menu functionality
    const hamburger = document.getElementById('hamburger');
    const navigation = document.getElementById('navigation');

    if (hamburger && navigation) {
        hamburger.addEventListener('click', function() {
            navigation.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav')) {
                navigation.classList.remove('show');
            }
        });
    }
});