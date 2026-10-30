# Ma Sha Allah Talbina — Website

A clean, fast, **mobile-first website** for the **Ma Sha Allah Talbina** (Sunnah
food) brand, styled after the teal-and-gold poster. It is a **static website** —
just HTML, CSS and JavaScript. There is **no database and no server to rent**.
Customers choose a quantity and press **“Place Order on WhatsApp”**, which opens
WhatsApp with the order, the Buy-5-Get-1-Free offer and the total already written
out. Instagram and TikTok links are in the footer.

Everything works by opening **one file: `index.html`**.

---

## 1. What’s included (file map)

```
index.html              ← the whole website (all pages live here as sections)
css/style.css           ← all the colours, fonts and layout
js/main.js              ← order logic + YOUR settings (number, prices)
assets/
  favicon.svg           ← browser-tab icon (teal + gold)
  logo-placeholder.svg  ← logo (replace with your real logo)
  img/
    poster.png          ← the poster, shown in the hero
    product-1.png … 4.png ← your real product photos (gallery + product card)
sitemap.xml, robots.txt ← help Google find the site
.gitignore              ← keeps junk out of GitHub
README.md               ← this guide
```

You do **not** need to install anything to run it.

---

## 2. Make it yours (personalise)

### a) Change your WhatsApp number, prices and currency
Open **`js/main.js`** in any text editor. The very top block, clearly marked
`⚙️ CONFIG — EDIT THIS SECTION`, is the only place you need to change:

```js
const CONFIG = {
  whatsappNumber: "923443400024",   // your number, digits only, NO + and NO spaces
  currency: "Rs",
  product: {
    name: "Ma Sha Allah Talbina (100g Box)",
    price: 600,                       // price per box
  },
  offer: {
    buyEvery: 5,                      // buy this many boxes...
    getFree: 1,                       // ...get this many free (per 5)
  },
  social: {
    instagram: "https://www.instagram.com/mashaallahtalbina92",
    tiktok: "https://www.tiktok.com/@ma.sha.allah.talb",
  },
};
```

- **Number format:** include the country code. Pakistan `92`, UAE `971`,
  UK `44`, USA `1`, etc. Example for a Pakistani number `0344-3400024`
  → `923443400024`.
- **Price:** change `product.price` (e.g. 600 → 650) and it updates everywhere —
  the card, the live total, the cart and the WhatsApp message.
- **Offer:** change `buyEvery` / `getFree` to set a different deal (e.g. buy 3 get
  1). Set `getFree: 0` to turn the offer off.
- **Social:** paste your Instagram / TikTok links here.

### b) Replace the logo and photos
Your **real product photos are already in place** (`assets/img/product-1.png` …
`product-4.png` and `poster.png`). To swap them later, replace those files using
the **same names** so nothing else needs changing:

| Replace this file              | With                                      |
| ------------------------------ | ----------------------------------------- |
| `assets/logo-placeholder.svg`  | your logo (PNG/JPG/SVG) — keep the name   |
| `assets/img/poster.png`        | the poster / a wide hero image            |
| `assets/img/product-1.png` …   | your product photos (gallery + card)      |

> Tip: if your file has a different name/extension (e.g. `hero.jpg`), just
> update the `src="..."` in `index.html` to match, or rename your photo to
> match the placeholder name. Keep photos a similar shape (hero = wide,
> products = roughly square) for the best look.

### c) Edit the words
All the text you see (headlines, product names, the story, benefits) is plain
English inside **`index.html`**. Find the sentence and type over it.

---

## 3. Preview it on your computer

**Easiest:** double-click `index.html` — it opens in your browser.

**Nicest (auto-refresh while you edit):** use a tiny local server.
- In VS Code: install the free **Live Server** extension → right-click
  `index.html` → **Open with Live Server**, **or**
- If you have Node installed, open a terminal in this folder and run:
  ```bash
  npx serve
  ```
  then open the `http://localhost:...` address it shows.

> Note: WhatsApp links only fully work once the site is online or when you
> tap them on a phone — but you can still test the buttons on a computer
> (a WhatsApp tab/web page will open).

---

## 4. Put it on GitHub (optional but recommended)

1. Sign up at [github.com](https://github.com) and click **New repository**.
2. Name it (e.g. `talbina-website`), tick **Public**, click **Create**.
3. On the new page click **uploading an existing file** and drag **all the
   files in this folder** in, then **Commit changes**.

**Comfortable with Git?** Use commands instead:
```bash
git init
git add .
git commit -m "Talbina Sunnah Food website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/talbina-website.git
git push -u origin main
```

---

## 5. Publish it live (free) — pick ONE option

### Option A — Netlify drag & drop (simplest, no GitHub needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this whole folder onto the page.
3. A few seconds later you get a live link like `https://random-name.netlify.app`.
4. Rename it under **Site settings → Change site name** if you like.

### Option B — Vercel (connects to your GitHub repo)
1. Sign up at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project** and choose your `talbina-website` repo.
3. Framework preset: **Other**. No build command, output directory blank.
4. Click **Deploy**. You’ll get a live `*.vercel.app` link.
5. Every time you update the files on GitHub, Vercel re-publishes automatically.

Both give you **free HTTPS hosting** and let you connect your own domain later.

---

## 6. Frequently asked questions

**How does the WhatsApp order actually look?**
When a customer presses *Place Order on WhatsApp*, WhatsApp opens with a
message already typed, for example (6 boxes selected):
```
Assalamu Alaikum! I would like to order Ma Sha Allah Talbina:

- Name: Ahmed Ali
- Phone: 0301 2345678
- - -
- Quantity: 6 Boxes (Rs 600 each)
- Offer: Buy 5 Get 1 Free -> 1 FREE box
- TOTAL: Rs 3,600
- - -
- Address: Karachi, Clifton Block 2
- Notes:
  Please deliver after 5pm
```
…sent straight to the number you set in `CONFIG`.

**Do I need a database or hosting plan?**
No. It’s a static site — the order is built in the customer’s browser and sent
through WhatsApp. Free hosting (Netlify/Vercel) is plenty.

**How do I change the price or the offer later?**
Only one place: the `CONFIG` block at the top of `js/main.js`. Change
`product.price`, or `offer.buyEvery` / `offer.getFree`. Update, save, and
re-publish (on Netlify drag the folder again; on Vercel push to GitHub).

**Can I add more products?**
The site is built around one product to keep ordering simple. To add a second,
copy the `<div class="product-card">…</div>` block in `index.html` and the
matching cart logic in `js/main.js`, or ask for help — the single-product flow
above is the recommended setup.

**Is the phone number safe on the page?**
Your WhatsApp number is visible to customers by design (that’s how they reach
you). Keep it as the digits-only international format in `CONFIG`.

---

Made with care for Ma Sha Allah Talbina. May it be a blessed and useful tool. 🌿
