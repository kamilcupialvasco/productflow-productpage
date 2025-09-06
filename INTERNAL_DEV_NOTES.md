# Internal Developer Notes for productflow.online Marketing Site

**Objective:** This document is for internal developers (human or AI) to understand the critical technical aspects of this static site. Read this before making changes to prevent common bugs.

---

## 1. Core Architecture

- **Static Site:** This is a pure HTML, CSS, and JavaScript project. There is no backend server or build step required.
- **Styling:** Primarily uses **Tailwind CSS** via a CDN. Custom overrides and new component styles are in `/assets/css/style.css`.
- **JavaScript:** All client-side logic is in `/assets/js/index.js`. It is loaded with `defer` on all pages and organized into logical modules.

---

## 2. CRITICAL WARNING: Header/Footer Loading Mechanism

This is the most important and fragile part of the site's architecture. Previous versions of the site were plagued by a bug where the header and footer would not load.

### How it Works:

1.  Every HTML page has two placeholder divs: `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`.
2.  The script `/assets/js/index.js` contains a `loadLayout()` function that is executed on `DOMContentLoaded`.
3.  This function `async` fetches the contents of `/assets/html/_header.html` and `/_footer.html`.
4.  It then **replaces** the placeholder divs with the fetched HTML content using `outerHTML`.
5.  **Crucially**, only *after* this replacement is complete (and after a `setTimeout(..., 0)` to allow the browser to render) does the `initializePageScripts()` function run. This function is responsible for attaching all event listeners (mobile menu, dropdowns, animations, etc.).

### **Rules for Modification (DO NOT BREAK THESE):**

-   **DO NOT** move the call to `initializePageScripts()` outside of the main `DOMContentLoaded` event listener's `async` block. It **MUST** run after `await loadLayout()` has completed.
-   **DO NOT** add other `<script>` tags to the HTML files that might execute before `index.js` has finished its layout injection, especially if they need to access header or footer elements.
-   **ALWAYS** use root-relative paths (e.g., `/assets/js/index.js`, `/features.html`) for all assets and links. This ensures they work correctly from any page, including nested ones like `/blog/post1.html`.

**If the header/footer disappear after a change, it is almost certainly because the JavaScript execution order was broken.**

---

## 3. Key JavaScript Modules in `index.js`

The `index.js` file is organized into several modules for clarity.

-   `Nav`: Handles all navigation-related logic, including the mobile menu, dropdowns, and **active link highlighting**.
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

-   **New Page:** Create a new `.html` file at the root level. Copy the boilerplate from an existing page (like `about.html`) which includes the `<head>` section, placeholders, and deferred script tag.
-   **New Blog Post:** Create a new file in the `/blog/` directory. Update the `knowledge-hub.html` page to include a card linking to it, with the correct `data-category="blog"`.
-   **New Interactive Component:**
    1.  Add the HTML for your component.
    2.  Add necessary styles to `assets/css/style.css`.
    3.  Create a new `initMyNewComponent()` function and add it to the appropriate module (e.g., `UI`) in `assets/js/index.js`.
    4.  **Important:** Call your new function from within that module's `init()` method to ensure it runs at the correct time.
