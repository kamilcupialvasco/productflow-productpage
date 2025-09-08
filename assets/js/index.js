
// =================================================================================
// productflow.online - Main JavaScript File
//
// This file contains all the client-side logic for the marketing website.
// It's organized into modules to handle different aspects of the site's
// interactivity, animations, and analytics.
//
// Modules:
// - Nav: Handles all navigation, including the mobile menu and the new,
//        click-driven mega menus.
// - Animations: Manages all visual effects, like scroll-triggered animations.
// - UI: Initializes interactive components like tabs, carousels, and forms.
// - Analytics: Provides a lightweight event tracking system.
//
// Execution starts at the bottom with the DOMContentLoaded event listener.
// =================================================================================


// --- NAVIGATION MODULE ---
// Handles the main site navigation, including the mobile menu and dropdowns.
const Nav = {
    init() {
        this.initMobileMenu();
        this.initDropdowns(); // Use the new mega menu logic
        this.initStickySubNav();
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
        const dropdowns = document.querySelectorAll('.mega-menu-container');

        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.mega-menu-trigger');
            if (trigger) {
                trigger.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const wasOpen = dropdown.classList.contains('is-open');
                    // Close all other dropdowns
                    dropdowns.forEach(d => d.classList.remove('is-open'));
                    // If it wasn't open, open it
                    if (!wasOpen) {
                        dropdown.classList.add('is-open');
                    }
                });
            }

            // Add hover effect for details panel
            const links = dropdown.querySelectorAll('.mega-menu-nav-link');
            const detailsTitle = dropdown.querySelector('.details-content h4');
            const detailsDescription = dropdown.querySelector('.details-content p');
            const detailsLink = dropdown.querySelector('.details-content a');

            if (links.length > 0 && detailsTitle && detailsDescription && detailsLink) {
                // Store default values
                const defaultTitle = detailsTitle.textContent;
                const defaultDescription = detailsDescription.textContent;
                const defaultLinkHref = detailsLink.href;

                links.forEach(link => {
                    link.addEventListener('mouseenter', () => {
                        if (link.dataset.title && link.dataset.description) {
                            detailsTitle.textContent = link.dataset.title;
                            detailsDescription.textContent = link.dataset.description;
                            detailsLink.href = link.href;
                        }
                    });
                });
                
                // Reset to default when mouse leaves the entire menu content area
                const menuContent = dropdown.querySelector('.mega-menu-content');
                if(menuContent) {
                    menuContent.addEventListener('mouseleave', () => {
                         detailsTitle.textContent = defaultTitle;
                         detailsDescription.textContent = defaultDescription;
                         detailsLink.href = defaultLinkHref;
                    });
                }
            }
        });

        // Add a click listener to the whole document to close dropdowns when clicking outside
        document.addEventListener('click', (event) => {
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('is-open');
                }
            });
        });
    },

    initStickySubNav() {
        const nav = document.querySelector('.quick-links-nav');
        const sentinel = document.getElementById('sticky-nav-sentinel');
        if (!nav || !sentinel) return;

        const links = nav.querySelectorAll('a');
        const sections = Array.from(links).map(link => document.getElementById(link.hash.substring(1)));

        const observer = new IntersectionObserver(
            ([entry]) => {
                nav.classList.toggle('is-sticky', !entry.isIntersecting);
            },
            { rootMargin: '-89px 0px 0px 0px' } // 88px header height + 1px
        );

        observer.observe(sentinel);

        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(link => {
                        link.classList.toggle('active', link.hash === `#${entry.target.id}`);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });

        sections.forEach(section => {
            if (section) sectionObserver.observe(section);
        });
    }
};

// --- ANIMATIONS MODULE ---
// Manages all visual animations on the site.
const Animations = {
    init() {
        this.initScrollAnimations();
        this.initHeroAnimation();
        this.initHeroParallax();
        this.initCounterAnimation();
    },

    initScrollAnimations() {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const direction = entry.target.dataset.animationDirection || 'up';
                    entry.target.classList.add('is-visible', `animate-${direction}`);
                    
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
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            scrollObserver.observe(el);
        });
    },

    initHeroAnimation() {
        const headlineSpan = document.querySelector('#hero-headline span');
        if (!headlineSpan) return;
        
        const phrases = ["Outcome-Driven Teams.", "Data-Informed Products.", "Strategic Alignment."];
        let counter = 0;
        
        const scramble = (element, newText) => {
            let iteration = 0;
            const letters = "!<>-_\\/[]{}—=+*^?#________";

            const interval = setInterval(() => {
                element.innerText = newText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return newText[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= newText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };
        
        const nextPhrase = () => {
            scramble(headlineSpan, phrases[counter]);
            counter = (counter + 1) % phrases.length;
        };
        
        setTimeout(nextPhrase, 100);
        setInterval(nextPhrase, 4000);
    },

    initHeroParallax() {
        const parallaxBg = document.getElementById('hero-parallax-bg');
        if (!parallaxBg) return;

        window.addEventListener('scroll', () => {
            const offset = window.pageYOffset;
            parallaxBg.style.transform = `translateY(${offset * 0.3}px)`;
        });
    },
    
    initCounterAnimation() {
        const counters = document.querySelectorAll('[data-animate-counter]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.dataset.animateCounter;
                    const duration = 1500;
                    let start = null;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        el.textContent = Math.floor(progress * target) + (el.textContent.includes('%') ? '%' : '');
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.8 });

        counters.forEach(counter => observer.observe(counter));
    }
};

// --- UI MODULE ---
// Initializes all interactive UI components.
const UI = {
    init() {
        this.initTabs();
        this.initCarousel();
        this.initPricingToggle();
        this.initUseCaseFilters();
        this.initGoldenThread();
        this.initForms();
        this.initKnowledgeHubFilters();
    },
    
    initTabs() {
        document.querySelectorAll('.tabs-container, #for-who-tabs, #built-for-you-tabs').forEach(container => {
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
        document.querySelectorAll('.carousel-container').forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            if (slides.length <= 1) return;

            const nextButton = carousel.querySelector('.carousel-next');
            const prevButton = carousel.querySelector('.carousel-prev');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            let currentIndex = 0;
            
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            const showSlide = (index) => {
                currentIndex = index;
                slides.forEach((s, i) => s.classList.toggle('active', i === index));
                dots.forEach((d, i) => d.classList.toggle('active', i === index));
            };
            
            nextButton.addEventListener('click', () => showSlide((currentIndex + 1) % slides.length));
            prevButton.addEventListener('click', () => showSlide((currentIndex - 1 + slides.length) % slides.length));
            
            showSlide(0);
        });
    },

    initPricingToggle() {
        const toggle = document.getElementById('pricing-toggle');
        if (!toggle) return;

        const monthly = document.querySelectorAll('[data-price-monthly]');
        const annually = document.querySelectorAll('[data-price-annually]');
        
        toggle.addEventListener('change', () => {
            const isAnnual = toggle.checked;
            monthly.forEach(p => p.classList.toggle('hidden', isAnnual));
            annually.forEach(p => p.classList.toggle('hidden', !isAnnual));
            document.getElementById('monthly-label').classList.toggle('text-white', !isAnnual);
            document.getElementById('monthly-label').classList.toggle('text-gray-500', isAnnual);
            document.getElementById('annual-label').classList.toggle('text-white', isAnnual);
            document.getElementById('annual-label').classList.toggle('text-gray-500', !isAnnual);
        });
    },

    initUseCaseFilters() {
        const container = document.querySelector('.interactive-workflow');
        if (!container) return;

        const buttons = container.querySelectorAll('.workflow-stage');
        const items = document.querySelectorAll('.use-case-card');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.category;
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                items.forEach(item => {
                    const itemCategories = item.dataset.usecaseCategory.split(' ');
                    const shouldShow = (filter === 'all' || itemCategories.includes(filter));
                    item.style.display = shouldShow ? '' : 'none';
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
                const currentIndex = hierarchy.indexOf(node.dataset.threadId);
                diagram.classList.add('active');
                nodes.forEach((el, index) => {
                    el.classList.toggle('active', index === currentIndex);
                    el.classList.toggle('in-path', index <= currentIndex);
                });
            });
        });
        
        diagram.addEventListener('mouseleave', () => {
             diagram.classList.remove('active');
             nodes.forEach(el => el.classList.remove('active', 'in-path'));
        });
    },

    initForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();
                contactForm.style.display = 'none';
                document.getElementById('form-success-message').classList.remove('hidden');
            });
        }

        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', e => {
                e.preventDefault();
                newsletterForm.querySelector('input').disabled = true;
                const button = newsletterForm.querySelector('button');
                button.textContent = 'Subscribed!';
                button.disabled = true;
            });
        }
    },

    initKnowledgeHubFilters() {
        const container = document.getElementById('knowledge-hub-filters');
        if(!container) return;

        const buttons = container.querySelectorAll('.filter-button');
        const items = document.querySelectorAll('.knowledge-item');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                items.forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
                });
            });
        });
    }
};

// --- ANALYTICS MODULE ---
// Handles lightweight event tracking for analytics.
const Analytics = {
    init() {
        document.body.addEventListener('click', this.trackEvent.bind(this));
        document.body.addEventListener('submit', this.trackEvent.bind(this));
    },

    trackEvent(e) {
        const targetElement = e.target.closest('[data-ga-event]');
        if (targetElement) {
            const eventString = targetElement.dataset.gaEvent;
            const [category, action, label] = eventString.split(':');
            
            if (category && action) {
                console.log(`GA Event: { Category: '${category}', Action: '${action}', Label: '${label || 'not_set'}' }`);
                // Example of real integration:
                // if (typeof gtag === 'function') {
                //     gtag('event', action, {
                //         'event_category': category,
                //         'event_label': label
                //     });
                // }
            }
        }
    }
};

// --- MAIN EXECUTION ---
// Initializes all modules after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    Nav.init();
    Animations.init();
    UI.init();
    Analytics.init();
});
