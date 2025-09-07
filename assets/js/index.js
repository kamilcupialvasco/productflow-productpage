
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
// - Blog: Handles enhancements for blog post pages.
// - Analytics: Provides a lightweight event tracking system.
//
// Execution starts at the bottom with the DOMContentLoaded event listener.
// =================================================================================


// --- NAVIGATION MODULE ---
// Handles the main site navigation, including the mobile menu and mega menu.
const Nav = {
    init() {
        this.initMobileMenu();
        this.initClickMegaMenu();
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

    initClickMegaMenu() {
        const containers = document.querySelectorAll('.mega-menu-container');
        if (containers.length === 0) {
            return;
        }

        const triggers = document.querySelectorAll('.mega-menu-trigger');

        triggers.forEach(trigger => {
            const container = trigger.closest('.mega-menu-container');
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasOpen = container.classList.contains('is-open');
                
                // Close all other menus
                containers.forEach(c => c.classList.remove('is-open'));
                
                if (!wasOpen) {
                    container.classList.add('is-open');
                }
            });
        });

        document.addEventListener('click', () => {
            containers.forEach(container => container.classList.remove('is-open'));
        });
        
        containers.forEach((container) => {
            const links = container.querySelectorAll('.mega-menu-nav-link');
            const detailsColumn = container.querySelector('.mega-menu-details-column .details-content');
            
            if (detailsColumn && links.length > 0) {
                const titleEl = detailsColumn.querySelector('h4');
                const descEl = detailsColumn.querySelector('p');
                const linkEl = detailsColumn.querySelector('a.mega-menu-link');

                const originalState = {
                    title: titleEl.innerHTML,
                    description: descEl.innerHTML,
                    href: linkEl.href,
                    gaEvent: linkEl.dataset.gaEvent
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
                            // Update GA event for the main link
                            const baseEvent = linkEl.dataset.gaEvent.split('_')[0];
                            const newEvent = link.dataset.gaEvent.replace('Nav:Click:', '');
                            linkEl.dataset.gaEvent = `${baseEvent}_${newEvent}`;
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
                        linkEl.dataset.gaEvent = originalState.gaEvent;
                        detailsColumn.classList.remove('fade-out-details');
                    }, 150);
                });
            }
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
        this.initDeepLinking();
        this.initPresentationControls();
        this.initInteractiveTour();
        this.initKnowledgeHubFilters();
    },
    
    initTabs() {
        document.querySelectorAll('.tabs-container, #for-who-tabs, #built-for-you-tabs, #roadmap-tabs').forEach(container => {
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

    initDeepLinking() {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (!hash) return;
        
            const targetElement = document.querySelector(hash);
            if (!targetElement) return;
        
            const tabPane = targetElement.closest('.tab-pane');
            if (!tabPane) { // Not inside a tab, just scroll
                 setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                return;
            }
        
            const container = tabPane.closest('.tab-content').parentElement;
            if(!container) return;

            const tabId = tabPane.id;
            const correspondingButton = container.querySelector(`.tab-button[data-tab="${tabId}"]`);
        
            if (correspondingButton) {
                // Deactivate all buttons and panes in this group
                container.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                container.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
                // Activate the correct ones
                correspondingButton.classList.add('active');
                correspondingButton.setAttribute('aria-selected', 'true');
                tabPane.classList.add('active');
        
                // Scroll to the element
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run on initial load
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


// --- BLOG MODULE ---
// Handles enhancements for blog post pages.
const Blog = {
    init() {
        this.initProgressBar();
        this.initStickyTOC();
    },

    initProgressBar() {
        const progressBar = document.getElementById('reading-progress-bar');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    },

    initStickyTOC() {
        const toc = document.getElementById('blog-toc');
        const article = document.querySelector('article');
        if (!toc || !article) return;
        
        const headings = article.querySelectorAll('h2, h3');
        if(headings.length === 0) return;

        toc.innerHTML = '<h4 class="font-semibold mb-2">In this article</h4>'; // Clear and add header
        
        const observer = new IntersectionObserver(entries => {
            // Find the last intersecting element
            const intersectingEntries = entries.filter(e => e.isIntersecting);
            if (intersectingEntries.length > 0) {
                const lastIntersecting = intersectingEntries[intersectingEntries.length - 1];
                 const id = lastIntersecting.target.getAttribute('id');
                 const link = toc.querySelector(`a[href="#${id}"]`);
                if(link) {
                    document.querySelectorAll('#blog-toc a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
           
        }, { rootMargin: '0px 0px -80% 0px' });

        headings.forEach(heading => {
            const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[?]/g, '');
            heading.setAttribute('id', id);
            
            const link = document.createElement('a');
            link.setAttribute('href', `#${id}`);
            link.textContent = heading.textContent;
            link.classList.add('toc-link');
            if(heading.tagName === 'H3') {
                link.classList.add('toc-link-h3');
            }
            toc.appendChild(link);
            
            observer.observe(heading);
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
    Blog.init();
    Analytics.init();
});
