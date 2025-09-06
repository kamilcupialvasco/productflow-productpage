// --- CRITICAL LAYOUT LOADER ---
// This function MUST run first and complete before any other scripts that rely on the full DOM are initialized.
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


// --- MODULES for page initialization ---

const Nav = {
    init() {
        this.highlightActiveLink();
        this.initMobileMenu();
        this.initDropdowns();
        this.initStickyNav();
    },

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('header nav a');

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            // Exact match or matches index.html for root path
            let isMatch = (linkPath === currentPath) || (currentPath === '/' && linkPath.endsWith('/index.html'));

            // Special case for features parent link
            if (currentPath.startsWith('/features') && linkPath.endsWith('/features.html')) {
                 isMatch = true;
            }
             // Special case for use cases parent link
            if (currentPath.startsWith('/use-cases') && linkPath.endsWith('/use-cases.html')) {
                 isMatch = true;
            }
            
            if (isMatch) {
                link.classList.add('active-nav-link');
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.querySelector('a').classList.add('active-nav-link');
                }
            }
        });
    },

    initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const closeButton = document.getElementById('mobile-menu-close-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuButton && mobileMenu && closeButton) {
            menuButton.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
            closeButton.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        }
    },

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                dropdown.addEventListener('mouseenter', () => menu.classList.remove('hidden'));
                dropdown.addEventListener('mouseleave', () => menu.classList.add('hidden'));
            }
        });
    },

    initStickyNav() {
        const nav = document.querySelector('.quick-links-nav');
        const sentinel = document.querySelector('#sticky-nav-sentinel');
        if (!nav || !sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => nav.classList.toggle('is-stuck', !entry.isIntersecting),
            { rootMargin: `-100px`, threshold: 0 }
        );
        observer.observe(sentinel);
    }
};

const Animations = {
    init() {
        this.initScrollAnimations();
        this.initHeroAnimation();
        this.initHeroParallax();
        this.initCodeAnimations();
    },

    initScrollAnimations() {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.dataset.staggerGroup !== undefined) {
                        const children = entry.target.querySelectorAll('.animate-on-scroll');
                        children.forEach((child, i) => {
                            child.style.transitionDelay = `${i * 100}ms`;
                        });
                    }
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('[data-stagger-group], .animate-on-scroll:not([data-stagger-group] .animate-on-scroll)').forEach(el => {
            scrollObserver.observe(el);
        });
    },

    initHeroAnimation() {
        const headline = document.getElementById('hero-headline');
        if (!headline) return;

        const mainText = headline.childNodes[0].nodeValue.trim();
        const rotatingTexts = ["Outcome-Driven Product Teams.", "Modern B2B SaaS.", "High-Stakes FinTech."];
        
        headline.innerHTML = `${mainText}<br/><span class="text-emerald-400 transition-opacity duration-500"></span>`;
        const newSpan = headline.querySelector('span');
        let textIndex = 0;
        
        function rotate() {
            newSpan.classList.add('fade-out');
            setTimeout(() => {
                newSpan.textContent = rotatingTexts[textIndex];
                textIndex = (textIndex + 1) % rotatingTexts.length;
                newSpan.classList.remove('fade-out');
            }, 500);
        }
        rotate();
        setInterval(rotate, 3000);
    },

    initHeroParallax() {
        const parallaxBg = document.getElementById('hero-parallax-bg');
        if (!parallaxBg) return;

        window.addEventListener('scroll', () => {
            const offset = window.pageYOffset;
            parallaxBg.style.transform = `translateY(${offset * 0.3}px)`;
        });
    },

    initCodeAnimations() {
        const codeBlocks = document.querySelectorAll('.code-block-animated');
        codeBlocks.forEach(block => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lines = Array.from(block.querySelectorAll('p, div.font-mono > div, div.font-mono > p, .font-mono > strong'));
                        if (lines.length === 0) return;
                        
                        const originalHTMLs = lines.map(p => p.innerHTML);
                        lines.forEach(p => p.innerHTML = '');
                        block.classList.add('typing');

                        let lineIndex = 0;
                        function typeLine() {
                            if (lineIndex < lines.length) {
                                const line = lines[lineIndex];
                                const html = originalHTMLs[lineIndex];
                                line.innerHTML = html;
                                line.style.width = '0';
                                line.style.whiteSpace = 'nowrap';
                                line.style.overflow = 'hidden';
                                line.style.animation = `typing-effect ${Math.max(0.5, line.textContent.length / 50)}s steps(${line.textContent.length}) forwards`;
                                lineIndex++;
                                setTimeout(typeLine, 150);
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
};

const UI = {
    init() {
        this.initTabs('.tabs-container');
        this.initTabs('#built-for-you-tabs');
        this.initTabs('#for-who-tabs');
        this.initTabs('#roadmap-tabs');
        this.initCarousel();
        this.initPricingToggle();
        this.initKnowledgeHubFilters();
        this.initGoldenThread();
    },

    initTabs(containerSelector) {
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
                    panes.forEach(pane => pane.classList.toggle('active', pane.id === tabId));
                });
            });
        });
    },

    initCarousel() {
        const carousels = document.querySelectorAll('.carousel-container');
        carousels.forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const nextButton = carousel.querySelector('.carousel-next');
            const prevButton = carousel.querySelector('.carousel-prev');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            let autoplayInterval = null;

            if (slides.length <= 1) {
                if(nextButton) nextButton.style.display = 'none';
                if(prevButton) prevButton.style.display = 'none';
                if(dotsContainer) dotsContainer.style.display = 'none';
                return;
            }

            let currentIndex = 0;
            
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => { showSlide(i); resetAutoplay(); });
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll('.carousel-dot');

            function updateDots() { dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex)); }
            function showSlide(index) { currentIndex = index; slides.forEach((s, i) => s.classList.toggle('active', i === index)); updateDots(); }
            function nextSlide() { showSlide((currentIndex + 1) % slides.length); }
            function prevSlide() { showSlide((currentIndex - 1 + slides.length) % slides.length); }
            function startAutoplay() { autoplayInterval = setInterval(nextSlide, 7000); }
            function resetAutoplay() { clearInterval(autoplayInterval); startAutoplay(); }

            nextButton.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
            prevButton.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
            
            showSlide(0);
            startAutoplay();
        });
    },

    initPricingToggle() {
        const toggle = document.getElementById('pricing-toggle');
        if (!toggle) return;

        const monthlyPrices = document.querySelectorAll('[data-price-monthly]');
        const annualPrices = document.querySelectorAll('[data-price-annually]');
        const annualLabel = document.getElementById('annual-label');
        const monthlyLabel = document.getElementById('monthly-label');

        toggle.addEventListener('change', () => {
            const isAnnual = toggle.checked;
            monthlyPrices.forEach(p => p.classList.toggle('hidden', isAnnual));
            annualPrices.forEach(p => p.classList.toggle('hidden', !isAnnual));
            monthlyLabel.classList.toggle('text-white', !isAnnual);
            monthlyLabel.classList.toggle('text-gray-500', isAnnual);
            annualLabel.classList.toggle('text-white', isAnnual);
            annualLabel.classList.toggle('text-gray-500', !isAnnual);
        });
    },

    initKnowledgeHubFilters() {
        const container = document.getElementById('knowledge-hub-filters');
        if (!container) return;
        const buttons = container.querySelectorAll('button');
        const items = document.querySelectorAll('.knowledge-item');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                items.forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
                });
            });
        });
    },

    initGoldenThread() {
        const diagram = document.getElementById('golden-thread-diagram');
        if (!diagram) return;
        const nodes = diagram.querySelectorAll('.thread-node');
        
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const id = node.dataset.threadId;
                diagram.querySelectorAll('.thread-line, .thread-node').forEach(el => el.classList.add('dimmed'));
                diagram.querySelectorAll(`[data-thread-id="${id}"]`).forEach(el => el.classList.remove('dimmed'));
            });
            node.addEventListener('mouseleave', () => {
                 diagram.querySelectorAll('.thread-line, .thread-node').forEach(el => el.classList.remove('dimmed'));
            });
        });
    }
};

const Forms = {
    init() {
        this.initContactForm();
    },
    initContactForm() {
        const form = document.getElementById('contact-form');
        const successMessage = document.getElementById('form-success-message');
        if (!form || !successMessage) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
        });
    }
};

// --- INITIALIZATION SEQUENCE ---
function initializePageScripts() {
    Nav.init();
    Animations.init();
    UI.init();
    Forms.init();
}

// --- MAIN EXECUTION ---
// This new structure guarantees that initializePageScripts() is ONLY called
// after the layout has been fetched and injected into the DOM.
loadLayout().then(() => {
    // We use a minimal timeout to push the initialization to the end of the event loop.
    // This gives the browser a moment to process the newly injected DOM,
    // preventing race conditions where scripts try to access elements that aren't ready yet.
    setTimeout(initializePageScripts, 0);
}).catch(error => {
    console.error("Layout loading failed, page scripts will not be initialized.", error);
});
