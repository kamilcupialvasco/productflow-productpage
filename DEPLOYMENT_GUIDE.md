# Deployment Guide: productflow.online Marketing Site

This guide provides instructions for deploying the static marketing site with password protection and ensuring it is not indexed by search engines. This is ideal for a staging or private preview environment.

We will use Netlify as the example hosting provider due to its simplicity for static sites.

---

## 1. Prerequisites

1.  **Project in a Git Repository:** Your project code should be hosted in a Git repository (e.g., GitHub, GitLab, Bitbucket).
2.  **Netlify Account:** You will need a free Netlify account.

---

## 2. Deploying to Netlify

1.  **Log in to Netlify:** Go to [app.netlify.com](https://app.netlify.com).
2.  **New Site from Git:** From your dashboard, click "Add new site" -> "Import an existing project".
3.  **Connect to Git Provider:** Choose your Git provider and authorize Netlify to access your repositories.
4.  **Select Repository:** Search for and select the repository for `productflow.online`.
5.  **Configure Build Settings:**
    -   **Branch to deploy:** `main` (or your primary branch).
    -   **Build command:** Leave this **blank**. Since our site is pure static HTML, no build step is needed.
    -   **Publish directory:** Leave this **blank** or set to the root directory (`/`). Netlify will deploy all files from the root.
6.  **Deploy Site:** Click the "Deploy site" button. Netlify will now deploy your site and provide you with a random URL (e.g., `random-name-12345.netlify.app`).

---

## 3. Adding Password Protection

Netlify's "Visitor Access" feature is perfect for this.

1.  **Go to Site Settings:** From your site's dashboard in Netlify, navigate to "Site settings".
2.  **Visitor Access:** In the left-hand menu, find and click on "Visitor access".
3.  **Set Password:** Click the "Set a password" button. Enter a secure password that you will share with your team or stakeholders.
4.  **Save:** Click "Save".

Your site is now protected. Any visitor will be prompted to enter the password before they can view the content.

---

## 4. Preventing Search Engine Indexing (SEO)

To ensure search engines like Google do not crawl or index your private preview site, two measures have been implemented.

### 4.1. Meta Tag (Already Implemented)

Every `.html` page in this project has the following meta tag in its `<head>` section:

```html
<meta name="robots" content="noindex, nofollow">
```

-   `noindex`: Tells search engines not to show this page in their results.
-   `nofollow`: Tells search engines not to follow any links on this page.

This is the primary method and is already active. **Before launching the site publicly, you must remove this line from all HTML files.**

### 4.2. `_headers` File (Optional but Recommended)

For an extra layer of protection, you can create a `_headers` file in the root of your project. This file tells Netlify to send specific HTTP headers with every response.

1.  **Create File:** In the root of your project, create a file named `_headers` (no extension).
2.  **Add Rule:** Add the following content to the file:

    ```
    /*
      X-Robots-Tag: noindex, nofollow
    ```

3.  **Commit and Push:** Commit this file to your Git repository and push the changes. Netlify will automatically detect the file on the next deploy.

This `X-Robots-Tag` header provides the same instructions as the meta tag but at the server level, offering a more robust way to block crawlers.

---

## Summary

By following these steps, you will have:
1.  A live version of the website hosted on Netlify.
2.  Password protection to restrict access.
3.  Robust measures in place to prevent search engines from indexing the site.