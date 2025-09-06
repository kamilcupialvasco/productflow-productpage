
async function loadLayout() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const headerPath = '/assets/html/_header.html';
    const footerPath = '/assets/html/_footer.html';

    try {
        const [headerResponse, footerResponse] = await Promise.all([
            fetch(headerPath),
            fetch(footerPath)
        ]);

        if (headerPlaceholder && headerResponse.ok) {
            headerPlaceholder.outerHTML = await headerResponse.text();
        }

        if (footerPlaceholder && footerResponse.ok) {
            footerPlaceholder.outerHTML = await footerResponse.text();
        }
    } catch (error) {
        console.error('Error loading layout:', error);
    }

    initializePageScripts();
}

function initializeHeroAnimation() {
    const headline = document.getElementById('hero-headline');
    if (!headline) return;

    const span = headline.querySelector('span');
    const text = span.dataset.text;
    span.textContent = '';
    span.classList.add('typing');

    let charIndex = 0;
    const intervalId = setInterval(() => {
        if (charIndex < text.length) {
            span.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(intervalId);
            span.classList.remove('typing');
        }
    }, 100);
}


function initializeCodeAnimations() {
    const codeBlocks = document.querySelectorAll('.code-block-animated');
    codeBlocks.forEach(block => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lines = Array.from(block.querySelectorAll('p'));
                    if (lines.length === 0) return;
                    
                    const originalTexts = lines.map(p => p.textContent);
                    lines.forEach(p => p.textContent = '');
                    block.classList.add('typing');

                    let lineIndex = 0;

                    function typeLine() {
                        if (lineIndex < lines.length) {
                            const line = lines[lineIndex];
                            const text = originalTexts[lineIndex];
                            let charIndex = 0;
                            const intervalId = setInterval(() => {
                                if (charIndex < text.length) {
                                    line.textContent += text.charAt(charIndex);
                                    charIndex++;
                                } else {
                                    clearInterval(intervalId);
                                    lineIndex++;
                                    typeLine();
                                }
                            }, 20);
                        } else {
                             setTimeout(() => block.classList.remove('typing'), 500);
                        }
                    }
                    typeLine();
                    observer.unobserve(block);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(block);
    });
}

function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const panes = container.querySelectorAll('.tab-pane');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                panes.forEach(pane => {
                    if (pane.id === tabId) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    });
}


function initializeCarousel() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        if (slides.length <= 1) return;
        
        let currentIndex = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
        
        showSlide(0); // Show initial slide
    });
}


function initializePageScripts() {
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

    // --- INITIALIZE NEW INTERACTIVE FEATURES ---
    initializeHeroAnimation();
    initializeCodeAnimations();
    initializeTabs();
    initializeCarousel();
}

document.addEventListener('DOMContentLoaded', loadLayout);