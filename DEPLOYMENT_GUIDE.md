# Deployment Guide: productflow.online Marketing Site

This guide provides instructions for deploying the static marketing site to a live, public environment.

We will use Netlify as the example hosting provider due to its simplicity and performance for static sites.

---

## 1. Prerequisites

1.  **Project in a Git Repository:** Your project code should be hosted in a Git repository (e.g., GitHub, GitLab, Bitbucket).
2.  **Netlify Account:** You will need a Netlify account.
3.  **Custom Domain (Optional):** If you wish to use a custom domain (e.g., `productflow.online`), have it registered and ready.

---

## 2. Pre-Deployment SEO Check

The site has been architected to be SEO-friendly. Before deploying, ensure that:
-   All `noindex` meta tags have been removed from the HTML files. (This has been done in the latest commit).
-   Each page has a unique and descriptive `<title>` and `<meta name="description">`.
-   A `canonical` link tag is present on every page, pointing to its absolute URL.

---

## 3. Deploying to Netlify

1.  **Log in to Netlify:** Go to [app.netlify.com](https://app.netlify.com).
2.  **New Site from Git:** From your dashboard, click "Add new site" -> "Import an existing project".
3.  **Connect to Git Provider:** Choose your Git provider and authorize Netlify to access your repositories.
4.  **Select Repository:** Search for and select the repository for `productflow.online`.
5.  **Configure Build Settings:**
    -   **Branch to deploy:** `main` (or your primary production branch).
    -   **Build command:** Leave this **blank**. This is a static site with no build step.
    -   **Publish directory:** Leave this **blank** or set to the root directory (`/`).
6.  **Deploy Site:** Click the "Deploy site" button. Netlify will deploy your site and provide a default URL (e.g., `random-name-12345.netlify.app`).

---

## 4. Configuring a Custom Domain

1.  **Go to Domain Settings:** In your new site's dashboard in Netlify, go to "Domain settings".
2.  **Add Custom Domain:** Click "Add a domain" and enter your custom domain name (e.g., `productflow.online`). Follow the verification steps.
3.  **Configure DNS:** Netlify will provide you with DNS records (usually a set of nameservers or a CNAME/A record). You will need to add these records in your domain registrar's DNS settings panel (e.g., GoDaddy, Namecheap, Google Domains).
4.  **Wait for Propagation:** DNS changes can take anywhere from a few minutes to 48 hours to fully propagate.
5.  **Enable HTTPS:** Once your domain is pointing to Netlify, go to the "HTTPS" section in your domain settings and ensure SSL/TLS is enabled. Netlify provides free SSL certificates through Let's Encrypt.

---

## 5. Post-Launch

-   **Submit Sitemap:** Once the site is live, consider creating a `sitemap.xml` file and submitting it to Google Search Console to encourage faster indexing.
-   **Analytics:** Ensure your analytics tool (e.g., Google Analytics) is properly configured to receive the events being sent by the `Analytics` module in `index.js`. You will need to replace the `console.log` with the actual tracking snippet from your provider.