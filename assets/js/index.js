
// --- CRITICAL LAYOUT LOADER ---
// This function MUST run first and complete before any other scripts that rely on the full DOM are initialized.
async function loadLayout() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Use root-relative paths to ensure they work from any page depth
    const headerPath = '/assets/html/_header.html';
    const footerPath = '/assets/html/_footer.html';

    try {
        const [headerResponse, footerResponse] = await Promise.all([
            fetch(headerPath),
            fetch(footerPath)
        ]);

        if (headerPlaceholder && headerResponse.ok) {
            headerPlaceholder.outerHTML = await headerResponse.text();
        } else if (!headerPlaceholder) {
            console.error('CRITICAL: Header placeholder not found in HTML.');
        } else if (!headerResponse.ok) {
            console.error('CRITICAL: Failed to load header HTML partial:', headerResponse.statusText);
        }

        if (footerPlaceholder && footerResponse.ok) {
            footerPlaceholder.outerHTML = await footerResponse.text();
        } else if (!footerPlaceholder) {
             console.error('CRITICAL: Footer placeholder not found in HTML.');
        } else if (!footerResponse.ok) {
            console.error('CRITICAL: Failed to load footer HTML partial:', footerResponse.statusText);
        }
        
    } catch (error) {
        console.error('CRITICAL: Error loading layout partials. Header/footer will be missing.', error);
    }
}


function initializeHeroAnimation() {
    const headline = document.getElementById('hero-headline');
    if (!headline) return;

    const span = headline.querySelector('span');
    const rotatingTexts = ["Outcome-Driven Product Teams.", "Modern B2B SaaS.", "High-Stakes FinTech."];
    const initialText = rotatingTexts[0];
    span.textContent = '';
    span.classList.add('typing');

    let charIndex = 0;
    
    // 1. Type out the initial text
    const typingInterval = setInterval(() => {
        if (charIndex < initialText.length) {
            span.textContent += initialText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            span.classList.remove('typing');
            // 2. Wait, then start the rotating animation
            setTimeout(startRotation, 2000); 
        }
    }, 80);

    // 3. Loop through the rotating texts
    let textIndex = 1; // Start from the second item
    function startRotation() {
        setInterval(() => {
            span.classList.add('fade-out'); // Start fade out
            setTimeout(() => {
                span.textContent = rotatingTexts[textIndex];
                textIndex = (textIndex + 1) % rotatingTexts.length;
                span.classList.remove('fade-out'); // End fade out, which triggers fade in
            }, 500); // Must match CSS transition duration
        }, 3000); // Time each phrase is visible
    }
}


function initializeCodeAnimations() {
    const codeBlocks = document.querySelectorAll('.code-block-animated');
    codeBlocks.forEach(block => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lines = Array.from(block.querySelectorAll('p, div.font-mono > div'));
                    if (lines.length === 0) return;
                    
                    const originalHTMLs = lines.map(p => p.innerHTML);
                    lines.forEach(p => p.innerHTML = '');
                    block.classList.add('typing');

                    let lineIndex = 0;

                    function typeLine() {
                        if (lineIndex < lines.length) {
                            const line = lines[lineIndex];
                            const html = originalHTMLs[lineIndex];
                            line.innerHTML = html; // Set the full HTML to preserve styling/icons
                            line.style.width = '0';
                            line.style.whiteSpace = 'nowrap';
                            line.style.overflow = 'hidden';
                            line.style.transition = `width ${Math.max(0.5, html.length / 50)}s steps(${html.length})`;
                            
                            // Trigger the animation
                            setTimeout(() => {
                                line.style.width = '100%';
                                lineIndex++;
                                setTimeout(typeLine, 200); // Delay before typing next line
                            }, 10);
                            
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

function initializeTabs(containerSelector) {
    const tabContainers = document.querySelectorAll(containerSelector);
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const panes = container.querySelectorAll('.tab-pane');
        if (!buttons.length || !panes.length) return;

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
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let autoplayInterval = null;

        if (slides.length <= 1) {
            if (nextButton) nextButton.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        
        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                showSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateDots() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function showSlide(index) {
            currentIndex = index;
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            updateDots();
        }

        function nextSlide() {
            showSlide((currentIndex + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        }
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 7000); // 7 seconds
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
        
        showSlide(0);
        startAutoplay();
    });
}

function initializeKnowledgeHubFilters() {
    const filterContainer = document.getElementById('knowledge-hub-filters');
    if (!filterContainer) return;

    const filterButtons = filterContainer.querySelectorAll('button');
    const contentItems = document.querySelectorAll('.knowledge-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update button styles
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content visibility
            contentItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// --- INITIALIZATION SEQUENCE ---
// This function initializes all scripts that depend on the dynamic header/footer.
// It is called ONLY after the layout has been loaded.
function initializePageScripts() {
    // Dropdown Logic
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const trigger = dropdown.querySelector('a'); // Assuming the link is the trigger
        if (menu && trigger) {
            dropdown.addEventListener('mouseenter', () => menu.classList.remove('hidden'));
            dropdown.addEventListener('mouseleave', () => menu.classList.add('hidden'));
        }
    });

    // Mobile Menu Toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu && closeButton) {
        menuButton.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
        closeButton.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    }

    // Scroll Animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // Page-specific interactive features
    initializeHeroAnimation();
    initializeCodeAnimations();
    initializeTabs('.tabs-container'); // Original tabs
    initializeTabs('#built-for-you-tabs'); // New tabs on homepage
    initializeCarousel();
    initializeKnowledgeHubFilters();
}

// --- MAIN EXECUTION ---
// On DOMContentLoaded, load the layout first, then initialize all other scripts.
// This new sequence prevents race conditions where scripts try to access DOM elements that haven't been loaded yet.
document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    initializePageScripts();
});
