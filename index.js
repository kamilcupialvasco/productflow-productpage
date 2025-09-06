
document.addEventListener('DOMContentLoaded', () => {
    // --- DROPDOWN LOGIC ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            dropdown.addEventListener('mouseenter', () => menu.classList.remove('hidden'));
            dropdown.addEventListener('mouseleave', () => menu.classList.add('hidden'));
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu && closeButton) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
        closeButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    // --- SCROLL ANIMATIONS ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });
});
