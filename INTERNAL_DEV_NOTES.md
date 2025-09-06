
# Internal Developer Notes for productflow.online Marketing Site

**Objective:** This document is for internal developers (human or AI) to understand the critical technical aspects of this static site. Read this before making changes to prevent common bugs.

---

## 1. Core Architecture

- **Static Site:** This is a pure HTML, CSS, and JavaScript project. There is no backend server or build step required.
- **Styling:** Primarily uses **Tailwind CSS** via a CDN. Custom overrides and new component styles are in `/assets/css/style.css`.
- **JavaScript:** All client-side logic is in `/assets/js/index.js`. It is loaded with `defer` on all pages and organized into logical modules.

---

## 2. CRITICAL ARCHITECTURAL NOTE: Embedded Header/Footer

Previous versions of this site used a JavaScript-based mechanism to dynamically load the header and footer into each page. This approach proved to be unreliable and was the source of a persistent bug where the navigation would fail to render.

**The new architecture permanently fixes this issue by embedding the header and footer HTML directly into each `.html` file.**

### **Rules for Modification:**

-   **DO NOT re-introduce dynamic loading.** The current method is intentional and prioritizes stability over DRY (Don't Repeat Yourself) principles for the layout.
-   To update the header or footer, you must update it in **all** `.html` files. A multi-file search and replace is recommended for this.
-   All scripts in `/assets/js/index.js` now safely assume that the header and footer elements exist in the DOM when they execute.

---

## 3. Key JavaScript Modules in `index.js`

The `index.js` file is organized into several modules for clarity.

-   `Nav`: Handles all navigation-related logic, including the mobile menu and **active link highlighting**. The mega menu is now handled primarily by CSS for reliability.
-   `Animations`: Manages all visual animations, including scroll-triggered effects, the hero headline, and "typing" code blocks.
-   `UI`: Initializes interactive UI components like tabs, carousels, and the pricing toggle.
-   `Forms`: Handles form-related logic, such as the submission feedback on the contact page.

---

## 4. Active Navigation Link

-   The `Nav.highlightActiveLink()` function in `index.js` is responsible for adding the `.active-nav-link` class to the current page's link in the header.
-   It compares the current `window.location.pathname` with the `href` of each navigation link.
-   It includes special logic to correctly highlight the "Features" parent link when viewing a sub-page like "Feedback Hub".
-   The corresponding styles are in `assets/css/style.css`.

---

## 5. Accessibility Best Practices

-   **Focus States:** All interactive elements (links, buttons, inputs) now have a highly visible `:focus-visible` state defined in `assets/css/style.css`. This is critical for users who navigate using a keyboard. Do not remove these styles.
-   **Semantic HTML:** Continue to use semantic HTML (e.g., `<nav>`, `<main>`, `<section>`, `aria-` attributes on interactive components) wherever possible.
-   **Image `alt` Tags:** Ensure all non-decorative images have descriptive `alt` tags for screen readers and SEO.

---

## 6. Adding New Pages or Content

-   **New Page:** Create a new `.html` file. Copy the full content from an existing page (like `about.html`) to ensure it includes the complete, embedded `<header>` and `<footer>`.
-   **New Blog Post:** Create a new file in the `/blog/` directory. Update the `knowledge-hub.html` page to include a card linking to it, with the correct `data-category="blog"`.
-   **New Interactive Component:**
    1.  Add the HTML for your component.
    2.  Add necessary styles to `assets/css/style.css`.
    3.  Create a new `initMyNewComponent()` function and add it to the appropriate module (e.g., `UI`) in `assets/js/index.js`.
    4.  Call your new function from within that module's `init()` method to ensure it runs at the correct time.
