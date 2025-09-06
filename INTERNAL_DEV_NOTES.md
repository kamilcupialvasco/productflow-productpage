# Internal Developer Notes for productflow.online Marketing Site

**Objective:** This document is for internal developers (human or AI) to understand the critical technical aspects of this static site. Read this before making changes to prevent common bugs.

---

## 1. Core Architecture

- **Static Site:** This is a pure HTML, CSS, and JavaScript project. There is no backend server or build step required.
- **Styling:** Primarily uses **Tailwind CSS** via a CDN. Custom overrides and new component styles are in `/assets/css/style.css`.
- **JavaScript:** All client-side logic is in `/assets/js/index.js`. It is loaded with `defer` on all pages.

---

## 2. CRITICAL WARNING: Header/Footer Loading Mechanism

This is the most important and fragile part of the site's architecture. Previous versions of the site were plagued by a bug where the header and footer would not load.

### How it Works:

1.  Every HTML page has two placeholder divs: `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`.
2.  The script `/assets/js/index.js` contains a `loadLayout()` function that is executed on `DOMContentLoaded`.
3.  This function `async` fetches the contents of `/assets/html/_header.html` and `/_footer.html`.
4.  It then **replaces** the placeholder divs with the fetched HTML content using `outerHTML`.
5.  **Crucially**, only *after* this replacement is complete does the `initializePageScripts()` function run. This function is responsible for attaching all event listeners (mobile menu, dropdowns, animations, etc.).

### **Rules for Modification (DO NOT BREAK THESE):**

-   **DO NOT** move the call to `initializePageScripts()` outside of the main `DOMContentLoaded` event listener's `async` block. It **MUST** run after `await loadLayout()` has completed.
-   **DO NOT** add other `<script>` tags to the HTML files that might execute before `index.js` has finished its layout injection, especially if they need to access header or footer elements.
-   **ALWAYS** use root-relative paths (e.g., `/assets/js/index.js`, `/features.html`) for all assets and links. This ensures they work correctly from any page, including nested ones like `/blog/post1.html`.

**If the header/footer disappear after a change, it is almost certainly because the JavaScript execution order was broken.**

---

## 3. Key JavaScript Functions in `index.js`

-   `loadLayout()`: **(Critical)** Fetches and injects the header/footer. See warning above.
-   `initializePageScripts()`: A wrapper function that initializes all interactive components. This is the safe place to add new initialization calls.
-   `initializeHeroAnimation()`: Controls the multi-stage typing and fading animation on the homepage hero.
-   `initializeCodeAnimations()`: Animates the "code blocks" to look like they are being typed out when they scroll into view.
-   `initializeTabs()`: Powers the tabbed interfaces.
-   `initializeCarousel()`: Powers the testimonial carousel.
-   `initializeKnowledgeHubFilters()`: Controls the filtering logic on the Knowledge Hub page.

---

## 4. Adding New Pages or Content

-   **New Page:** Create a new `.html` file at the root level. Copy the boilerplate from an existing page (like `about.html`) which includes the `<head>` section, placeholders, and deferred script tag.
-   **New Blog Post:** Create a new file in the `/blog/` directory. Update the `knowledge-hub.html` page to include a card linking to it, with the correct `data-category="blog"`.
-   **New Success Story:** Create a new file in the `/success-stories/` directory. Update `knowledge-hub.html` with a card and `data-category="success"`.
-   **New Interactive Component:**
    1.  Add the HTML for your component.
    2.  Add necessary styles to `assets/css/style.css`.
    3.  Create a new `initializeMyNewComponent()` function in `assets/js/index.js`.
    4.  **Important:** Add a call to your new function inside `initializePageScripts()` to ensure it runs *after* the layout is loaded.
