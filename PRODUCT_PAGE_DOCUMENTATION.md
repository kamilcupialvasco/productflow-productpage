# productflow.online - Marketing Site Documentation

## 1. Introduction

This document provides a technical overview of the `productflow.online` static marketing website. The project is designed to be a fast, SEO-friendly, and easily maintainable site that serves as the public-facing "front door" for the main application.

This version has been significantly enhanced with visual upgrades, expanded content, a comprehensive analytics tracking system, and a more robust architecture.

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
├── blog/
│   ├── index.html              # Blog listing page
│   └── ... (post pages)
├── ... (other html pages)
|
├── index.html                  # Main landing page
├── DEPLOYMENT_GUIDE.md
└── PRODUCT_PAGE_DOCUMENTATION.md
```

## 3. Styling

-   **Framework:** Styling is primarily handled by **Tailwind CSS**, loaded via a CDN in the `<head>` of each HTML file.
-   **Custom CSS:** Custom styles, fonts, component designs (like the mega menu and Golden Thread diagram), and animations are located in `assets/css/style.css`.

## 4. Scripts & Interactivity

All client-side interactivity is contained within `assets/js/index.js`, which is organized into several modules for maintainability.

-   **Modules:** `Nav`, `Animations`, `UI`, `Forms`, and `Analytics` handle specific domains of functionality.
-   **Scroll-Triggered Animations:** An `IntersectionObserver` triggers fade-in animations on elements with the class `.animate-on-scroll`.
-   **Interactive Components:** The `UI` module initializes components like the mega menu, tabs, carousels, and interactive diagrams.
-   **Analytics Tracking:** A new `Analytics` module provides site-wide event tracking. See section 6 for details.

## 5. Key Components & Features

### 5.1. Embedded Layout (Header/Footer)
To ensure maximum reliability and fix previous rendering bugs, the site `<header>` and `<footer>` are now **embedded directly into every HTML file**. This eliminates the need for JavaScript-based dynamic loading. While this increases file size slightly, it guarantees that navigation is always present.

### 5.2. "Golden Thread" Diagram v2
The homepage features a visually rich and interactive "Golden Thread" diagram (`#golden-thread-diagram-v2`).
-   **Structure:** Built with semantic HTML and styled with CSS.
-   **Icons:** Uses inline SVG data URIs for fast loading without extra HTTP requests.
-   **Interactivity:** `assets/js/index.js` adds hover listeners to highlight the strategic path from top-level vision to bottom-level feedback, providing a visually engaging experience.

### 5.3. Expanded Content
Pages like `for-who.html` and `roadmap.html` have been expanded with new content sections (e.g., "Pain Points & Solutions" tables) to provide more value to users. These have corresponding styles in `style.css`.

## 6. Google Analytics Integration

A lightweight, non-blocking analytics system has been implemented.
-   **Attribute:** Tracking is enabled by adding a `data-ga-event` attribute to any clickable HTML element.
-   **Format:** The attribute value should be a string in the format `"Category:Action:Label"`, for example: `"CTA:Click:Hero_StartTrial"`.
-   **Implementation:** The `Analytics` module in `index.js` listens for clicks on the `body` and checks for this attribute on the event target or its parents. It then logs the parsed event data to the console. This can be easily hooked into a real `gtag()` or other analytics library function.

## 7. SEO & Deployment

-   **`noindex` by Default:** As per deployment requirements, all pages now contain a `<meta name="robots" content="noindex, nofollow">` tag. This should be removed before a public production launch.
-   **Deployment Guide:** A comprehensive `DEPLOYMENT_GUIDE.md` has been added to the repository with instructions for deploying the site privately with password protection.