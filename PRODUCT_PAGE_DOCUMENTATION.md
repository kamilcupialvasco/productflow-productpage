# productflow.online - Marketing Site Documentation

## 1. Introduction

This document provides a technical overview of the `productflow.online` static marketing website. The project is designed to be a fast, SEO-friendly, and easily maintainable site that serves as the public-facing "front door" for the main application.

This version has been significantly enhanced with visual upgrades, expanded content, a comprehensive analytics tracking system, and a more robust architecture, making it ready for a public launch.

## 2. Project Structure

The repository is organized to separate assets from the root-level HTML pages. All pages are self-contained with embedded headers and footers.

```
/
├── assets/
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   └── js/
│       └── index.js            # Main javascript file
│
├── ... (html pages like index.html, features.html, etc.)
|
├── DEPLOYMENT_GUIDE.md
└── PRODUCT_PAGE_DOCUMENTATION.md
```

## 3. Styling

-   **Framework:** Styling is primarily handled by **Tailwind CSS**, loaded via a CDN in the `<head>` of each HTML file.
-   **Custom CSS:** Custom styles, fonts, component designs (like the mega menu and breadcrumbs), and animations are located in `assets/css/style.css`. The file is organized with a table of contents for maintainability.

## 4. Scripts & Interactivity

All client-side interactivity is contained within `assets/js/index.js`, which is organized into several modules. The script is loaded with `defer` on all pages for optimal performance.

-   **Modules:** `Nav`, `Animations`, `UI`, and `Analytics` handle specific domains of functionality.
-   **Scroll-Triggered Animations:** An `IntersectionObserver` triggers animations on elements with the class `.animate-on-scroll`. This system has been enhanced to support directional animations (e.g., `data-animation-direction="left"`).
-   **Interactive Components:** The `UI` module initializes components like the mega menu, tabs, carousels, and interactive diagrams.
-   **Analytics Tracking:** A lightweight `Analytics` module provides site-wide event tracking.

## 5. Key Components & Features

### 5.1. Universal Breadcrumbs
For enhanced user navigation and SEO, a breadcrumb component has been added to the top of every page (except the homepage). This component is styled in `style.css` and includes `BreadcrumbList` Schema.org structured data for search engines.

### 5.2. "Golden Thread" Diagram v2
The homepage features a visually rich and interactive "Golden Thread" diagram (`#golden-thread-diagram-v2`).
-   **Structure:** Built with semantic HTML and styled with CSS.
-   **Icons:** Uses inline SVG data URIs for fast loading.
-   **Interactivity:** `assets/js/index.js` adds hover listeners to highlight the strategic path, providing a visually engaging experience.

### 5.3. Enhanced Animations
-   **Counter Animation:** Elements with a `data-animate-counter` attribute will have their numerical content count up when scrolled into view.
-   **Animated Workflow:** A new animated diagram on the `features-upstream.html` page visually represents a card moving through a Kanban-style workflow.

## 6. Google Analytics Integration

A lightweight, non-blocking analytics system has been implemented.
-   **Attribute:** Tracking is enabled by adding a `data-ga-event` attribute to any clickable HTML element.
-   **Format:** The attribute value should be a string in the format `"Category:Action:Label"`, for example: `"CTA:Click:Hero_StartTrial"`.
-   **Implementation:** The `Analytics` module in `index.js` listens for clicks and logs the parsed event data to the console. This can be easily hooked into a real `gtag()` or other analytics library function.

## 7. SEO & Deployment

-   **Production Ready:** All `noindex, nofollow` meta tags have been removed. The site is fully prepared for search engine indexing.
-   **On-Page SEO:** Every page includes a unique `<title>`, `<meta name="description">`, and a canonical URL to prevent duplicate content issues.
-   **Structured Data:** Schema.org data (`SoftwareApplication` on the homepage, `BreadcrumbList` on all subpages) is implemented to enhance search engine result listings.
-   **Deployment Guide:** A comprehensive `DEPLOYMENT_GUIDE.md` has been updated with instructions for a public deployment.