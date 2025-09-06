# productflow.online - Marketing Site Documentation

## 1. Introduction

This document provides a technical overview of the `productflow.online` static marketing website. The project is designed to be a fast, SEO-friendly, and easily maintainable site that serves as the public-facing "front door" for the main application.

This version has been refactored from a flat structure into a more organized, component-based architecture to improve maintainability and reduce code duplication.

## 2. Project Structure

The repository has been organized to separate assets from the root-level HTML pages. New content areas like the blog and success stories have their own subdirectories.

```
/
├── assets/
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── js/
│   │   └── index.js            # Main javascript file
│   └── html/
│       ├── _header.html        # Shared header component
│       └── _footer.html        # Shared footer component
│
├── blog/
│   ├── index.html              # Blog listing page
│   └── ... (post pages)
├── success-stories/
│   ├── index.html
│   └── ... (story pages)
├── use-cases/
│   └── ... (use case detail pages)
|
├── index.html                  # Main landing page
├── features.html               # Features overview
├── ... (other html pages)
└── PRODUCT_PAGE_DOCUMENTATION.md
```

## 3. Styling

-   **Framework:** Styling is primarily handled by **Tailwind CSS**, loaded via a CDN in the `<head>` of each HTML file.
-   **Custom CSS:** Custom styles, fonts, and animations are located in `assets/css/style.css`.

## 4. Scripts & Components

All client-side interactivity is contained within `assets/js/index.js`.

-   **Dynamic Layout Loading:** On page load, the script fetches the shared header (`_header.html`) and footer (`_footer.html`) partials and injects them into placeholder `<div>` elements. This eliminates markup duplication.
-   **Pathing:** All assets (`.css`, `.js`) and internal page links (`.html`) now use **root-relative absolute paths** (e.g., `/assets/css/style.css`, `/features.html`). This ensures that links work correctly regardless of the page's depth in the directory structure.
-   **Scroll-Triggered Animations:** An `IntersectionObserver` triggers fade-in animations on elements with the class `.animate-on-scroll`.
-   **Dynamic Code Block Animation:** A new feature has been added to animate text content within specific elements. To use it, add the class `.code-block-animated` to a container. The script will find all `<p>` tags inside, and "type" out their content character-by-character when the element scrolls into view.

## 5. SEO & Best Practices

-   **Unique Metadata:** Each HTML page has unique `<title>` and `<meta name="description">` tags.
-   **Open Graph Tags:** `og:` meta tags are included for rich social media previews.
-   **Semantic HTML:** Placeholders are replaced by semantic `<header>` and `<footer>` tags, preserving the site's accessibility and SEO structure.
-   **Deferred Scripts:** JavaScript is loaded with `defer` to prevent render-blocking.

## 6. Deployment

As a fully static website, this project can be deployed on any modern static hosting platform (Vercel, Netlify, GitHub Pages, etc.). The root-relative pathing requires a web server (which all these platforms provide) and may not work as expected if files are opened directly from the local filesystem (`file:///...`).