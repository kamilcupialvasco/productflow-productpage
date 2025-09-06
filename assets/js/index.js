// --- MODULES for page initialization ---

const Nav = {
    init() {
        this.highlightActiveLink();
        this.initMobileMenu();
    },

    highlightActiveLink() {
        const currentPath = window.location.pathname.replace(/\/$/, ""); // Normalize path by removing trailing slash
        const navLinks = document.querySelectorAll('header nav a');

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

            let isMatch = (currentPath === linkPath) || (currentPath === '' && (linkPath.endsWith('/index.html') || linkPath === ''));
            if (currentPath.endsWith('/index.html') && linkPath === '') isMatch = true;
            
            if (currentPath.startsWith('/features') && link.getAttribute('href') === '/features.html') {
                 isMatch = true;
            }
            if (currentPath.startsWith('/use-cases') && link.getAttribute('href') === '/use-cases.html') {
                 isMatch = true;
            }
             if (currentPath.startsWith('/for-who') && link.getAttribute('href') === '/for-who.html') {
                 isMatch = true;
            }
            
            if (isMatch) {
                link.classList.add('active-nav-link');
                const dropdown = link.closest('.mega-menu-container');
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
                        const children = entry.target.querySelectorAll('.animate-on-scroll, .use-case-card');
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
        this.initUseCaseFilters();
        this.initMegaMenu();
    },
    
    initMegaMenu() {
        const megaMenuContainers = document.querySelectorAll('.mega-menu-container');
        megaMenuContainers.forEach(container => {
            const links = container.querySelectorAll('.mega-menu-nav-link');
            const detailsColumn = container.querySelector('.mega-menu-details-column .details-content');
            if (!detailsColumn) return;

            const titleEl = detailsColumn.querySelector('h4');
            const descEl = detailsColumn.querySelector('p');
            const linkEl = detailsColumn.querySelector('a.mega-menu-link');

            const originalState = {
                title: titleEl.innerHTML,
                description: descEl.innerHTML,
                href: linkEl.href
            };

            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const title = link.dataset.title;
                    const description = link.dataset.description;
                    const href = link.href;

                    detailsColumn.classList.add('fade-out-details');
                    setTimeout(() => {
                        titleEl.textContent = title;
                        descEl.textContent = description;
                        linkEl.href = href;
                        detailsColumn.classList.remove('fade-out-details');
                    }, 150);
                });
            });
            
            container.addEventListener('mouseleave', () => {
                 detailsColumn.classList.add('fade-out-details');
                 setTimeout(() => {
                    titleEl.innerHTML = originalState.title;
                    descEl.innerHTML = originalState.description;
                    linkEl.href = originalState.href;
                    detailsColumn.classList.remove('fade-out-details');
                }, 150);
            });
        });
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
        const diagram = document.getElementById('golden-thread-diagram-v2');
        if (!diagram) return;

        const nodes = diagram.querySelectorAll('.thread-node-v2');
        const hierarchy = ['vision', 'pillar', 'objective', 'kr', 'initiative', 'feedback'];

        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const currentId = node.dataset.threadId;
                const currentIndex = hierarchy.indexOf(currentId);
                
                diagram.classList.add('active');
                
                nodes.forEach((el, index) => {
                    el.classList.remove('active', 'in-path');
                    if (index === currentIndex) {
                        el.classList.add('active');
                    }
                    if (index <= currentIndex) {
                        el.classList.add('in-path');
                    }
                });
            });
        });
        
        diagram.addEventListener('mouseleave', () => {
             diagram.classList.remove('active');
             nodes.forEach(el => el.classList.remove('active', 'in-path'));
        });
    },

    initUseCaseFilters() {
        const container = document.querySelector('.interactive-workflow');
        if (!container) return;

        const filterButtons = container.querySelectorAll('.workflow-stage');
        const cardsContainer = document.getElementById('use-cases-grid');
        const cards = cardsContainer.querySelectorAll('.use-case-card');

        let activeFilter = 'all';

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.category;

                // Toggle behavior: if clicking the same filter again, show all
                if (activeFilter === filter) {
                    activeFilter = 'all';
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                } else {
                    activeFilter = filter;
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }
                
                cards.forEach(card => {
                    const cardCategories = card.dataset.usecaseCategory.split(' ');
                    const shouldShow = activeFilter === 'all' || cardCategories.includes(activeFilter);
                    
                    if (shouldShow) {
                        card.style.display = 'flex';
                        card.classList.remove('fade-out-card');
                    } else {
                        card.classList.add('fade-out-card');
                        setTimeout(() => {
                           if (!card.classList.contains('fade-out-card')) return; // Check if state changed
                           card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    },
};

const Forms = {
    init() {
        this.initContactForm();
        this.initNewsletterForm();
    },
    initContactForm() {
        const form = document.getElementById('contact-form');
        const successMessage = document.getElementById('form-success-message');
        if (!form || !successMessage) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd send data here.
            // For analytics, the button click is tracked.
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
        });
    },
    initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd send data here.
            // For analytics, the button click is tracked.
            form.querySelector('input').disabled = true;
            const button = form.querySelector('button');
            button.textContent = 'Subscribed!';
            button.disabled = true;
        });
    }
};

const Analytics = {
    init() {
        document.body.addEventListener('click', this.trackEvent.bind(this));
    },

    trackEvent(e) {
        const targetElement = e.target.closest('[data-ga-event]');
        if (targetElement) {
            const eventString = targetElement.dataset.gaEvent;
            const [category, action, label] = eventString.split(':');
            
            if (category && action) {
                // In a real implementation, you would send this to Google Analytics
                // For example: gtag('event', action, { 'event_category': category, 'event_label': label });
                console.log(`GA Event: { Category: '${category}', Action: '${action}', Label: '${label || 'not_set'}' }`);
            }
        }
    }
};


// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', () => {
    Nav.init();
    Animations.init();
    UI.init();
    Forms.init();
    Analytics.init(); // Initialize analytics tracking
});