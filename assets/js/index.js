
// =================================================================================
// productflow.online - Main JavaScript File
//
// This file contains all the client-side logic for the marketing website.
// It's organized into modules to handle different aspects of the site's
// interactivity, animations, and analytics.
//
// Modules:
// - Nav: Handles navigation, including mobile menu and active link highlighting.
// - Animations: Manages all visual effects, like scroll-triggered animations.
// - UI: Initializes interactive components like tabs, carousels, and forms.
// - Analytics: Provides a lightweight event tracking system.
//
// Execution starts at the bottom with the DOMContentLoaded event listener.
// =================================================================================


// --- NAVIGATION MODULE ---
// Handles the main site navigation, including the mobile menu and mega menu.
const Nav = {
    init() {
        this.initMobileMenu();
        this.initMegaMenu();
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
    
    // Reworked Mega Menu logic for improved reliability.
    // Uses JS to toggle a class instead of pure CSS :hover.
    initMegaMenu() {
        console.log("Attempting to initialize Mega Menus...");
        const containers = document.querySelectorAll('.mega-menu-container');
        console.log(`Found ${containers.length} mega menu containers.`);

        if (containers.length === 0) {
            console.error("No mega menu containers found. Desktop menu will not be interactive.");
            return;
        }

        containers.forEach((container, index) => {
            const trigger = container.querySelector('a');
            const menu = container.querySelector('.mega-menu');

            if (!trigger || !menu) {
                console.warn(`Mega menu container ${index + 1} is missing a trigger or a menu panel.`);
                return;
            }
            
            console.log(`Attaching listeners to menu container ${index + 1}`);

            const openMenu = () => menu.classList.add('is-open');
            const closeMenu = () => menu.classList.remove('is-open');

            container.addEventListener('mouseenter', openMenu);
            container.addEventListener('mouseleave', closeMenu);
            trigger.addEventListener('focus', openMenu);

            const focusableElements = menu.querySelectorAll('a, button');
            if (focusableElements.length > 0) {
                const lastFocusableElement = focusableElements[focusableElements.length - 1];
                lastFocusableElement.addEventListener('blur', (e) => {
                    if (!container.contains(e.relatedTarget)) {
                        closeMenu();
                    }
                });
            }

            // Interactive Details Panel Logic (if it exists)
            const links = container.querySelectorAll('.mega-menu-nav-link');
            const detailsColumn = container.querySelector('.mega-menu-details-column .details-content');
            
            if (detailsColumn && links.length > 0) {
                console.log(`Found details panel for menu ${index + 1}. Initializing interactivity.`);
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
                        detailsColumn.classList.add('fade-out-details');
                        setTimeout(() => {
                            titleEl.textContent = title;
                            descEl.textContent = description;
                            linkEl.href = link.href;
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
            } else {
                 console.log(`No details panel or links found for menu ${index + 1}.`);
            }
        });
    },
};

// --- ANIMATIONS MODULE ---
// Manages all visual animations on the site.
const Animations = {
    init() {
        this.initScrollAnimations();
        this.initHeroAnimation();
        this.initHeroParallax();
        this.initCodeAnimations();
        this.initCounterAnimation();
    },

    // Initializes scroll-triggered animations for elements with `.animate-on-scroll`.
    // Supports staggered animations and different directions.
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
        const headline = document.getElementById('hero-headline');
        if (!headline) return;

        const mainText = "The Command Center for";
        const rotatingTexts = ["Modern B2B SaaS.", "Outcome-Driven Teams.", "High-Stakes FinTech."];
        
        headline.innerHTML = `${mainText}<br/><span class="text-emerald-400 transition-opacity duration-500"></span>`;
        const newSpan = headline.querySelector('span');
        let textIndex = 0;
        
        const rotate = () => {
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
        document.querySelectorAll('.code-block-animated').forEach(block => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    block.classList.add('is-visible');
                    observer.unobserve(block);
                }
            }, { threshold: 0.5 });
            observer.observe(block);
        });
    },
    
    initCounterAnimation() {
        const counters = document.querySelectorAll('[data-animate-counter]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.dataset.animateCounter;
                    let current = 0;
                    const increment = target / 100;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            el.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target;
                        }
                    };
                    updateCounter();
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
        this.initFilters();
        this.initGoldenThread();
        this.initForms();
    },
    
    initTabs() {
        document.querySelectorAll('.tabs-container').forEach(container => {
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

    initFilters() {
        const filterContainers = document.querySelectorAll('[data-filter-container]');
        filterContainers.forEach(container => {
            const buttons = container.querySelectorAll('[data-filter]');
            const items = document.querySelectorAll(container.dataset.filterContainer);

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    items.forEach(item => {
                        const itemCategories = item.dataset.category.split(' ');
                        const shouldShow = (filter === 'all' || itemCategories.includes(filter));
                        item.classList.toggle('hidden', !shouldShow);
                    });
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
    }
};

// --- ANALYTICS MODULE ---
// Handles lightweight event tracking for analytics.
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
                // In a real implementation, you would send this to an analytics service.
                // e.g., gtag('event', action, { 'event_category': category, 'event_label': label });
                console.log(`GA Event: { Category: '${category}', Action: '${action}', Label: '${label || 'not_set'}' }`);
            }
        }
    }
};

// --- MAIN EXECUTION ---
// Initializes all modules after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing scripts for productflow.online.");
    Nav.init();
    Animations.init();
    UI.init();
    Analytics.init();
});
