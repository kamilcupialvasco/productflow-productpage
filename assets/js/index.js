
// =================================================================================
// productflow.online - Main JavaScript File
//
// This file contains all the client-side logic for the marketing website.
// It's organized into modules to handle different aspects of the site's
// interactivity, animations, and analytics.
//
// Modules:
// - Nav: Handles navigation, including mobile menu and the new click-driven mega menu.
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
        console.log("Nav.init() called.");
        this.initMobileMenu();
        this.initClickMegaMenu();
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

    initClickMegaMenu() {
        console.log("Nav.initClickMegaMenu() called.");
        const containers = document.querySelectorAll('.mega-menu-container');
        if (containers.length === 0) {
            console.log("No mega menu containers found.");
            return;
        }
        console.log(`${containers.length} mega menu containers found.`);

        const triggers = document.querySelectorAll('.mega-menu-trigger');

        triggers.forEach(trigger => {
            const container = trigger.closest('.mega-menu-container');
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasOpen = container.classList.contains('is-open');
                
                // Close all other menus
                containers.forEach(c => c.classList.remove('is-open'));
                
                // If it wasn't open, open it
                if (!wasOpen) {
                    container.classList.add('is-open');
                    console.log("Mega menu opened.");
                } else {
                    console.log("Mega menu closed by clicking trigger.");
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            containers.forEach(container => {
                if (!container.contains(event.target)) {
                    container.classList.remove('is-open');
                }
            });
        });
        
        // Handle details panel interactivity
        containers.forEach((container, index) => {
            const links = container.querySelectorAll('.mega-menu-nav-link');
            const detailsColumn = container.querySelector('.mega-menu-details-column .details-content');
            
            if (detailsColumn && links.length > 0) {
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
                
                const megaMenu = container.querySelector('.mega-menu');
                megaMenu.addEventListener('mouseleave', () => {
                     detailsColumn.classList.add('fade-out-details');
                     setTimeout(() => {
                        titleEl.innerHTML = originalState.title;
                        descEl.innerHTML = originalState.description;
                        linkEl.href = originalState.href;
                        detailsColumn.classList.remove('fade-out-details');
                    }, 150);
                });
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
            const originalText = element.innerText;
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

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
        
        nextPhrase();
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
        this.initUseCaseFilters();
        this.initGoldenThread();
        this.initForms();
        this.initDeepLinking();
        this.initPresentationControls();
        this.initInteractiveTour();
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
                    if(shouldShow) {
                        item.classList.add('is-visible', 'animate-up');
                    } else {
                         item.classList.remove('is-visible', 'animate-up');
                    }
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

    initDeepLinking() {
        const hash = window.location.hash;
        if (!hash) return;
    
        const targetElement = document.querySelector(hash);
        if (!targetElement) return;
    
        const parentTabContainer = targetElement.closest('.tab-content');
        if (!parentTabContainer) return;

        const parentTabs = parentTabContainer.closest('section');
        if (!parentTabs) return;
    
        const tabPane = targetElement.closest('.tab-pane');
        if (!tabPane) return;
    
        const tabId = tabPane.id;
        const correspondingButton = parentTabs.querySelector(`.tab-button[data-tab="${tabId}"]`);
    
        if (correspondingButton) {
            // Deactivate all buttons and panes in this group
            parentTabs.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            parentTabContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
            // Activate the correct ones
            correspondingButton.classList.add('active');
            tabPane.classList.add('active');
    
            // Scroll to the element
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    },

    initPresentationControls() {
        const printButton = document.querySelector('[data-action="print"]');
        if(printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }
    },

    initInteractiveTour() {
        const tourContainer = document.getElementById('interactive-tour');
        if (!tourContainer) return;

        const steps = tourContainer.querySelectorAll('.tour-step');
        const nextButtons = tourContainer.querySelectorAll('[data-action="next-step"]');
        const prevButtons = tourContainer.querySelectorAll('[data-action="prev-step"]');
        const progressFill = tourContainer.querySelector('.tour-progress-fill');
        let currentStep = 0;

        const updateTourState = () => {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            const progressPercentage = ((currentStep + 1) / steps.length) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateTourState();
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateTourState();
                }
            });
        });

        updateTourState(); // Initialize first step
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
    console.log("DOM fully loaded. Initializing scripts for productflow.online.");
    Nav.init();
    Animations.init();
    UI.init();
    Analytics.init();
});
