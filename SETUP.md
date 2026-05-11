# ShopLite — Project Setup Guide

A complete walkthrough from zero to a live website on the internet. Written for someone who has never deployed a project before.

If you follow each step in order you should have ShopLite running on your laptop in **about 10 minutes** and live on the internet in **about 20 minutes**.

---

## Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [What you need before starting](#2-what-you-need-before-starting)
3. [Step-by-step: Run it on your laptop](#3-step-by-step-run-it-on-your-laptop)
4. [Step-by-step: Put it live on Vercel](#4-step-by-step-put-it-live-on-vercel)
5. [Project structure — what each file does](#5-project-structure)
6. [How to make common changes](#6-how-to-make-common-changes)
7. [Common problems and fixes](#7-common-problems-and-fixes)
8. [What to show during a demo](#8-what-to-show-during-a-demo)

---

## 1. What is this project?

**ShopLite** is a small e-commerce-style web application:

- A landing page with a hero, featured products and category cards
- A catalog page with search, filter, sort, and a shopping cart
- A "checkout" flow that produces a fake order confirmation

**How it's built:**
- **Frontend:** plain HTML, CSS, and vanilla JavaScript (no React, no build step)
- **Backend:** Node.js serverless functions (`/api/products`, `/api/categories`)
- **Storage:** product data in a JSON-style file; the cart in the browser's `localStorage`
- **No database, no authentication, no paid services**

It satisfies the brief: semantic HTML5, responsive CSS, DOM manipulation, fetch with error handling, JSON data, lightweight serverless backend, clear separation between UI/logic/data.

---

## 2. What you need before starting

| What | Why | Where to get it |
|---|---|---|
| A computer (Windows / Mac / Linux) | Obviously | — |
| Internet connection | To install tools and deploy | — |
| **Node.js (LTS version)** | Runs the backend locally | https://nodejs.org/ |
| **A GitHub account** (free) | Hosts your code, lets Vercel auto-deploy | https://github.com/signup |
| **A Vercel account** (free) | Hosts the live website | https://vercel.com/signup |
| (Optional) Git | Pushes code to GitHub | https://git-scm.com/downloads |

You do **NOT** need:
- A credit card (everything used here is free)
- Any database
- Any paid services
- Any deep programming knowledge

---

## 3. Step-by-step: Run it on your laptop

### 3.1 Install Node.js

Node.js is what runs the backend.

1. Go to https://nodejs.org/
2. Click the big green **LTS** download button.
3. Run the installer. Click **Next** through every screen — the defaults are correct.
4. Once installed, open a terminal:
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter
5. In the terminal, type:
   ```
   node --version
   ```
   You should see something like `v20.10.0`. If you see *"command not found"* or *"is not recognized"*, **close the terminal, reopen it**, and try again. If still not working, restart your computer.

### 3.2 Get the project files

You probably already have the project on your computer. If not, copy the entire folder (e.g. `D:\Projects\Jawad`) onto the new computer.

The folder must contain at least these files at the root: `index.html`, `shop.html`, `styles.css`, `server.js`, `package.json`, plus the folders `api/`, `js/`, and `lib/`.

### 3.3 Open a terminal **in the project folder**

The fastest way:

- **Windows:** Open File Explorer, navigate to the project folder, click in the address bar, type `cmd`, press Enter.
- **Mac:** Right-click the folder in Finder → **Services** → **New Terminal at Folder**.

You can also navigate manually:
```
cd "D:\Projects\Jawad"
```
(Replace the path with wherever your project lives. Quotes are needed if the path has spaces.)

### 3.4 Start the server

In the terminal, run:

```
node server.js
```

You should see:
```
  ShopLite running at  http://localhost:3000
```

### 3.5 Open it in a browser

Open your browser and go to:

**http://localhost:3000**

You should see the ShopLite landing page. Click around, add things to the cart, switch dark mode — it should all work.

### 3.6 Stopping the server

In the terminal, press `Ctrl + C`. The server stops.

---

## 4. Step-by-step: Put it live on Vercel

Once it works locally, deploying it to the internet is straightforward. There are two paths — **Path A is recommended** because every code change auto-deploys.

### Path A — GitHub + Vercel (recommended)

#### 4.A.1 Install Git

If you don't have Git yet:
1. Go to https://git-scm.com/downloads
2. Download and install. Click **Next** through every screen — defaults are correct.
3. Verify in a terminal:
   ```
   git --version
   ```

#### 4.A.2 Push the project to GitHub

1. Go to https://github.com and sign in.
2. Click the **+** icon in the top-right corner → **New repository**.
3. Name it `shoplite` (or anything you like). Leave it **Public**. Don't tick any of the "Initialize with..." options. Click **Create repository**.
4. GitHub now shows you a page of commands. **Open a terminal in the project folder** (see step 3.3) and run these commands one at a time:

   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/shoplite.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your actual GitHub username. The exact URL is shown on the GitHub repo page.

   If Git asks you to sign in, follow the prompts. (Modern Git uses a browser-based sign-in.)

5. Refresh the GitHub repo page. You should see all your files.

#### 4.A.3 Connect Vercel

1. Go to https://vercel.com.
2. Click **Sign Up** (or **Log In** if you already have an account). Choose **Continue with GitHub** — this is the easiest path.
3. After signing in, click **Add New...** (top-right) → **Project**.
4. Vercel shows a list of your GitHub repositories. Find `shoplite` and click **Import**.
5. On the configuration screen, **leave everything at default**:
   - Framework Preset: *Other* (Vercel auto-detects)
   - Root Directory: `./`
   - Build Command: *empty*
   - Output Directory: *empty*
   - Install Command: *empty*
6. Click **Deploy**.

Wait about 30 seconds. Vercel gives you a live URL that looks like:

> https://shoplite-abc123.vercel.app

Open it in a browser — that's your live site.

#### 4.A.4 Future updates (auto-deploy)

Whenever you change code on your laptop, push the changes:

```
git add .
git commit -m "describe what you changed"
git push
```

Vercel automatically picks up the push and rebuilds the live site within ~1 minute. No clicking through the dashboard needed.

### Path B — Vercel CLI (one-shot deploy without GitHub)

Faster if you don't want to use GitHub at all. But you have to redeploy manually for every change.

1. **Install the CLI** (one time):
   ```
   npm install -g vercel
   ```

2. **Sign in** (one time):
   ```
   vercel login
   ```
   Pick **Continue with GitHub** (or another option). A browser window opens to verify your identity.

3. **Deploy** (in the project folder):
   ```
   vercel
   ```
   Answer the prompts:
   - *Set up and deploy?* → **Y**
   - *Which scope?* → pick your account
   - *Link to existing project?* → **N**
   - *Project name?* → `shoplite` (or anything)
   - *In which directory is your code?* → press Enter (uses current folder)
   - *Modify settings?* → **N**

   You get a preview URL like `shoplite-abc123-yourname.vercel.app`.

4. **Promote to production** (a stable URL):
   ```
   vercel --prod
   ```

To redeploy after changes, just run `vercel --prod` again.

### 4.5 (Optional) Add a custom domain

If you own a domain like `shoplite.com`:

1. In Vercel, go to your project → **Settings** → **Domains**.
2. Type your domain and click **Add**.
3. Vercel shows you DNS records to add at your domain registrar (e.g. Namecheap, GoDaddy).
4. Add the records. Wait 5–60 minutes. Done.

---

## 5. Project structure

```
shoplite/
├── index.html              ← Landing page (loads at /)
├── shop.html               ← Catalog page (loads at /shop.html)
├── styles.css              ← All styles (light + dark theme variables)
├── server.js               ← Local development server (Node.js, no dependencies)
├── package.json            ← Project metadata
├── .gitignore
├── SETUP.md                ← This file
│
├── lib/
│   └── products.js         ← All product data + category metadata
│
├── api/                    ← Each .js file = one backend endpoint
│   ├── products.js         ← Becomes /api/products
│   └── categories.js       ← Becomes /api/categories
│
└── js/                     ← Frontend JavaScript modules
    ├── api.js              ← fetch wrappers
    ├── cart.js             ← localStorage cart logic
    ├── ui.js               ← All DOM rendering
    ├── theme.js            ← Light/dark mode toggle
    ├── toast.js            ← Toast notifications
    ├── url-state.js        ← Filters ↔ URL querystring sync
    ├── header.js           ← Shared header / cart drawer / modal logic
    ├── landing.js          ← Landing page entry point
    └── app.js              ← Catalog page entry point
```

### Quick mental model

- **Data** lives in `lib/products.js` — edit this to add/remove/change products.
- **Backend** is in `api/*.js` — Vercel automatically turns each file into a live HTTP endpoint.
- **Frontend** is everything else — plain browser-native HTML, CSS and JS modules. No bundler or build step required.

---

## 6. How to make common changes

### Add a new product

Open `lib/products.js`. Add an entry to the array:

```js
{
  id: 16,                        // any unique number not already in the list
  name: "Wireless Mouse",
  category: "electronics",       // must be one of: electronics, books, clothing, home
  price: 29.99,
  rating: 4.4,
  icon: "🖱️",                    // any emoji
  description: "Comfortable ergonomic mouse with USB receiver.",
  stock: 8                       // set to 0 to mark as out of stock
}
```

Save the file. **Restart the server** (`Ctrl+C`, then `node server.js`). Refresh the browser.

### Add a new category

Open `lib/products.js`. Update the `categoryMeta` object:

```js
export const categoryMeta = {
  electronics: { label: "Electronics", icon: "💻" },
  books:       { label: "Books",       icon: "📚" },
  clothing:    { label: "Clothing",    icon: "👕" },
  home:        { label: "Home",        icon: "🏠" },
  toys:        { label: "Toys",        icon: "🧸" }   // <-- new
};
```

Then add some products with `category: "toys"`. The frontend automatically picks it up via the `/api/categories` endpoint.

### Change the colors / theme

Open `styles.css` and look at the top — the `:root` block has all the colors as CSS variables:

```css
:root {
  --bg: #faf7f2;
  --primary: #c2410c;
  --text: #1c1917;
  ...
}
```

Change any value, save, refresh. The `[data-theme="dark"]` block right below controls dark mode.

### Change the site name or hero text

- **Site name "ShopLite":** edit it in `index.html` and `shop.html` (`<title>`, `<h1 class="logo">`).
- **Hero headline:** edit `<h2 class="hero-title">` in `index.html`.
- **Subheadline:** edit `<p class="hero-sub">` in `index.html`.

---

## 7. Common problems and fixes

### "EADDRINUSE: address already in use :::3000"
Another program (or a previous server you forgot to stop) is using port 3000. Either:
- Close the other program, OR
- Run on a different port:
  - **Mac/Linux:** `PORT=3001 node server.js`
  - **Windows CMD:** `set PORT=3001 && node server.js`
  - **Windows PowerShell:** `$env:PORT=3001; node server.js`

Then visit `http://localhost:3001` instead.

### "node: command not found" / "node is not recognized"
Node.js isn't installed, or your terminal was open before installing it.
1. Verify install: re-run the installer from https://nodejs.org/
2. **Close every terminal window** and open a fresh one
3. Try `node --version` again

### Page loads but says "Could not load products"
The backend isn't responding. To check:
1. Open `http://localhost:3000/api/products` in a new browser tab
2. You should see a wall of JSON
3. If you see a 404 or nothing, restart the server (`Ctrl+C` then `node server.js`)

### "git: command not found"
Git isn't installed. Install it from https://git-scm.com/downloads — defaults are fine.

### Vercel deploy succeeds but the page shows nothing
Open Vercel dashboard → your project → **Logs** tab. Look for red errors. Most common cause: a syntax error in one of the `api/*.js` files that worked locally but not on Vercel. Fix the file, push again.

### Dark mode doesn't persist after refresh
The browser is blocking `localStorage`. Either:
- Use a different browser, OR
- Check site settings to allow site data

### Changes to `lib/products.js` don't show up
- For local dev: **restart the server** (`Ctrl+C`, then `node server.js` again)
- For Vercel: push the changes to GitHub (or run `vercel --prod`)

---

## 8. What to show during a demo

Walk through these in order — it covers every requirement in the assignment brief:

1. **Open the landing page** (`/`) — establishes the project as a real site.
2. **Click the moon icon** — dark mode flips on. Refresh — it persists (`localStorage`).
3. **Click "Shop now"** — navigates to the catalog. Notice how the URL changes.
4. **Click a category** in the sidebar — products filter live, URL updates to `?category=books`. **Reload** the page — filter is preserved.
5. **Type "headphones"** in the search box — live filtering, debounced (no spam to backend).
6. **Change the sort** dropdown — products reorder.
7. **Click any product card** — modal opens with bigger view, quantity selector. Use `+`/`−` to bump quantity.
8. **Click "Add to cart"** — toast notification slides in, cart icon bounces, badge increments.
9. **Click the cart icon** — drawer slides in. Use `+`/`−` per item to adjust qty.
10. **Click "Checkout"** — order confirmation modal with a random order ID. Cart is cleared.
11. **Press `/`** then `c` then `Esc` — keyboard shortcuts (focus search, toggle cart, close panel).
12. **Open browser DevTools (F12) → Network tab** — show `/api/products` and `/api/categories` returning JSON. Show `/api/products?category=books&sort=rating` working.
13. **Resize the browser window** — layout reflows, sidebar collapses, modal becomes a bottom sheet.

That demonstrates: **semantic HTML5**, **responsive CSS**, **DOM manipulation + event handling**, **JSON data format**, **fetch with error handling**, **clear separation between UI/logic/data**, and a **lightweight serverless backend**.

---

## Appendix — Useful links

- **Node.js:** https://nodejs.org/ · docs at https://nodejs.org/docs
- **Vercel:** https://vercel.com/ · docs at https://vercel.com/docs
- **GitHub:** https://github.com/ · docs at https://docs.github.com
- **Git:** https://git-scm.com/ · simple guide at https://rogerdudler.github.io/git-guide/

If something breaks unexpectedly, the fastest fix is usually:
1. Stop the server (`Ctrl+C`)
2. Run `node server.js` again
3. Hard-refresh the browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)

Good luck. The project is designed to "just work" — there's no build step, no installation step, no tooling to fight. If you can run `node server.js`, you're 90% of the way there.
