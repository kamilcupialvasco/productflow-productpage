
# productflow.online - Marketing Site Documentation

## 1. Introduction

This document provides a technical overview of the `productflow.online` static marketing website. This project is designed to be a fast, SEO-friendly, and easily maintainable site that serves as the public-facing "front door" for the main application.

It has been intentionally separated from the core React application to allow for independent development, deployment, and hosting.

## 2. Project Structure

The repository contains a flat structure of static assets:

-   **`*.html`**: A collection of static HTML files representing each page of the website (e.g., `index.html`, `features.html`, `pricing.html`).
-   **`style.css`**: A single stylesheet for the entire website.
-   **`index.js`**: A single JavaScript file containing all client-side interactivity for the site.

```
/
├── index.html              # Main landing page
├── features.html           # Features overview
├── features-*.html         # Feature detail pages
├── pricing.html            # Pricing page
├── ... (other html pages)
├── style.css               # Main stylesheet
└── index.js                # Main javascript file
```

## 3. Styling

-   **Framework:** Styling is primarily handled by **Tailwind CSS**, loaded via a CDN in the `<head>` of each HTML file. This allows for rapid development using utility classes directly in the HTML markup.
-   **Custom CSS:** A small number of custom styles and animations are located in `style.css`. This file includes the `@import` for the 'Inter' font and defines styles for shared components like feature cards.

## 4. Scripts

All client-side interactivity is contained within `index.js`. This script is loaded with the `defer` attribute in all HTML files to ensure it does not block page rendering.

Current functionality includes:
-   **Dropdown Menus:** Logic for showing/hiding the "Features" dropdown menu in the main navigation on hover.
-   **Mobile Navigation:** Logic for toggling the visibility of the "hamburger" menu on smaller screen sizes.

The script is written in vanilla JavaScript and is lightweight to ensure fast performance.

## 5. SEO & Best Practices

The site has been optimized for search engines and performance:

-   **Unique Metadata:** Each HTML page has a unique and descriptive `<title>` and `<meta name="description">` tag.
-   **Keywords:** Relevant keywords have been added to help search engines understand the page content.
-   **Open Graph Tags:** `og:` meta tags are included to ensure rich previews when links are shared on social media platforms like Facebook, Twitter, and LinkedIn.
-   **Semantic HTML:** The markup uses semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) to improve accessibility and SEO.
-   **Deferred Scripts:** JavaScript is loaded asynchronously using `defer` to prevent render-blocking.
-   **Consolidated CSS:** All custom styles are in a single `style.css` file to minimize HTTP requests.

## 6. Deployment

As a fully static website, this project can be deployed easily and cost-effectively on various platforms:

-   **Recommended Providers:** Vercel, Netlify, GitHub Pages, AWS S3 with CloudFront.
-   **Build Process:** No build process is required. Simply upload the files to the hosting provider.
-   **Domain:** The "Get Started" and "Sign In" links are hardcoded to `https://app.productflow.online`. When deploying the main application, ensure it is available at this address for the links to work correctly.
