# Internal Developer Notes for productflow.online Marketing Site

**Objective:** This document is for internal developers (human or AI) to understand the critical technical aspects of this static site. Read this before making changes to prevent common bugs.

---

## 1. Core Architecture

-   **Static Site:** This is a pure HTML, CSS, and JavaScript project. There is no backend server or build step required.
-   **Styling:** Primarily uses **Tailwind CSS** via a CDN. Custom overrides and new component styles are in `/assets/css/style.css`.
-   **JavaScript:** All client-side logic is in `/assets/js/index.js`. It is loaded with `defer` on all pages and organized into logical modules.

---

## 2. CRITICAL ARCHITECTURAL NOTE: Embedded Header/Footer

Previous versions of this site used a JavaScript-based mechanism to dynamically load the header and footer into each page. This approach was unreliable and has been **permanently removed**.

**The current architecture embeds the header and footer HTML directly into each `.html` file.**

### **Rules for Modification:**

-   **DO NOT re-introduce dynamic loading.** The current method is intentional and prioritizes stability and performance over DRY principles for the layout.
-   To update the header or footer, you must update it in **all** `.html` files. A multi-file search and replace is the required and recommended method.
-   All scripts in `/assets/js/index.js` now safely assume that the header and footer elements exist in the DOM when they execute.

---

## 3. Key JavaScript Modules in `index.js`

The `index.js` file is organized into several modules for clarity.

-   `Nav`: Handles all navigation-related logic, including the mobile menu and the interactive mega menu.
-   `Animations`: Manages all visual animations, including scroll-triggered effects, the hero headline, and new additions like the counter and workflow animations.
-   `UI`: Initializes interactive UI components like tabs, carousels, pricing toggles, and forms.
-   `Analytics`: Manages event tracking for analytics services.

---

## 4. New Components & Features

### 4.1. Interactive Product Tour (`interactive-tour.html`)

-   **Mechanism:** A multi-step guided tour controlled by the `initInteractiveTour` function in the `UI` module of `index.js`.
-   **State Management:** The current step is managed by a `currentStep` variable within the function. `updateTourState()` is called to toggle the `.active` class on the appropriate `.tour-step` container.
-   **Hotspots:** Hotspots are simply `<button>` elements with absolute positioning. They are placed within each step's image container. Their `data-action` attributes (`next-step`, `prev-step`) are used as selectors to attach event listeners.
-   **Modification:** To add a step, simply create a new `.tour-step` div in the HTML, add your content and image, and the script will automatically include it in the tour progression.

### 4.2. Animated SVG Logo

-   **Mechanism:** The logo animation is pure CSS and is applied to any SVG with the class `.animated-logo`.
-   **How it Works:** The key is the `stroke-dasharray` and `stroke-dashoffset` properties. We set them both to a high value (e.g., 100) to make the path's stroke effectively "invisible." The `@keyframes draw-logo` animation then transitions `stroke-dashoffset` to `0`, which "draws" the line.
-   **Staggering:** The animation for each `<path>` inside the SVG is staggered using `animation-delay` in `style.css`. To adjust the timing, modify these delay values.

---

## 5. Google Analytics Event Tracking

A lightweight event tracking system has been implemented.

-   **Mechanism:** An event listener on the `document.body` checks for a `data-ga-event` attribute on clicked elements.
-   **Attribute:** To make an element trackable, add the `data-ga-event` attribute.
-   **Format:** The attribute value is a string with three parts separated by colons: `Category:Action:Label`.
    -   **Example:** `data-ga-event="CTA:Click:Hero_StartTrial"`
-   **Output:** The `Analytics` module logs a structured object to the console, designed to be easily piped into a proper analytics service like Google Analytics (`gtag`).

---

## 6. SEO & Site Structure

-   **Production Ready:** The site has been audited for SEO and is ready for public launch. All `noindex` tags have been removed.
-   **Breadcrumbs:** A breadcrumb component has been added to every page for improved navigation and SEO. This includes `BreadcrumbList` schema.org structured data.
-   **Core Vitals:** The use of `defer` on scripts, optimized images (placeholders), and a static architecture are intended to produce good Core Web Vitals scores.

---

## 7. Adding New Pages or Content

-   **New Page:** Create a new `.html` file. Copy the full content from an existing page (like `about.html`) to ensure it includes the complete, embedded `<header>` and `<footer>`, breadcrumbs, and script reference. **Remember to update the breadcrumb links and text, title, meta description, and canonical URL for the new page.**
-   **New Interactive Component:**
    1.  Add the HTML for your component.
    2.  Add necessary styles to `assets/css/style.css` in the appropriate section.
    3.  Create a new `initMyNewComponent()` function and add it to the `UI` module in `assets/js/index.js`.
    4.  Call your new function from within the `UI.init()` method to ensure it runs on page load.