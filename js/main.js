/* =========================================================
   Ma Sha Allah Talbina — main.js
   Single-product order logic + Buy 5 Get 1 Free + WhatsApp.
   No backend required.
   ========================================================= */

/* ---------------------------------------------------------
   ⚙️  CONFIG — EDIT THIS SECTION
   - whatsappNumber: your number in international format,
     digits only, NO "+" and NO spaces.
       +92 344 3400024  ->  "923443400024"
   - product.price: price per box.
   - offer: "buy N get 1 free" — buyEvery boxes = 1 free box.
   - social: your Instagram / TikTok page links.
--------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: "923443400024",
  currency: "Rs",
  product: {
    name: "Ma Sha Allah Talbina (100g Box)",
    price: 600,
  },
  offer: {
    buyEvery: 5,   // buy this many boxes...
    getFree: 1,    // ...get this many free (per 5)
  },
  social: {
    instagram: "https://www.instagram.com/mashaallahtalbina92",
    tiktok: "https://www.tiktok.com/@ma.sha.allah.talb",
  },
};
/* ---------------- END OF CONFIG ---------------- */

// Current quantity of boxes the customer wants (paid boxes).
let qty = 1;

/* ---------- Helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const money = (n) => `${CONFIG.currency} ${n.toLocaleString("en-US")}`;

// Free boxes earned for the current quantity.
function freeBoxes() {
  const { buyEvery, getFree } = CONFIG.offer;
  if (!buyEvery || buyEvery < 1) return 0;
  return Math.floor(qty / buyEvery) * getFree;
}

function total() {
  return qty * CONFIG.product.price;
}

/* ---------- Reflect CONFIG into the page ---------- */
function renderConfig() {
  // Price label on the product card.
  const priceEl = $("[data-price-for='talbina']");
  if (priceEl) priceEl.textContent = money(CONFIG.product.price);

  // Offer badge text (product + order note).
  const offerText = `Buy ${CONFIG.offer.buyEvery} Boxes \u2022 Get ${CONFIG.offer.getFree} FREE`;
  const badge = $(".offer-badge");
  if (badge) badge.textContent = offerText;
  const note = $("#offerNote");
  if (note) note.textContent = `Buy ${CONFIG.offer.buyEvery} boxes, get ${CONFIG.offer.getFree} box FREE. \ud83c\udf81`;

  // Footer phone (readable) + social links.
  const fp = $("#footerPhone");
  if (fp) fp.textContent = "+" + CONFIG.whatsappNumber;
  const ig = $(".social-instagram");
  if (ig) ig.href = CONFIG.social.instagram;
  const tt = $(".social-tiktok");
  if (tt) tt.href = CONFIG.social.tiktok;
}

/* ---------- Set qty from an input/number, clamp 0..99 ---------- */
function setQty(value) {
  let q = parseInt(value, 10);
  if (isNaN(q)) q = 0;
  qty = Math.max(0, Math.min(99, q));
  // Sync every stepper input on the page.
  $$(".qty-input").forEach((inp) => {
    if (document.activeElement !== inp) inp.value = qty;
  });
  renderTotals();
}

/* ---------- Update all live totals / cart lines ---------- */
function renderTotals() {
  const free = freeBoxes();

  // Hero product card live total.
  const heroTotal = $("#heroLiveTotal");
  if (heroTotal) heroTotal.textContent = money(total());
  const heroFree = $("#heroFreeNote");
  if (heroFree) {
    if (free > 0) { heroFree.hidden = false; heroFree.textContent = `+ ${free} box${free > 1 ? "es" : ""} FREE 🎁`; }
    else heroFree.hidden = true;
  }

  // Order form cart lines + total.
  const linesEl = $("#cartLines");
  const totalEl = $("#cartTotal");
  if (linesEl) {
    linesEl.innerHTML = "";
    if (qty <= 0) {
      const li = document.createElement("li");
      li.className = "cart-line";
      li.innerHTML = `<span class="cl-name">No boxes selected yet.</span>`;
      linesEl.appendChild(li);
    } else {
      const li = document.createElement("li");
      li.className = "cart-line";
      li.innerHTML =
        `<span class="cl-name">${qty} &times; Talbina box <small>(${money(CONFIG.product.price)} each)</small></span>` +
        `<span class="cl-sum">${money(total())}</span>`;
      linesEl.appendChild(li);
      if (free > 0) {
        const f = document.createElement("li");
        f.className = "cart-line";
        f.innerHTML = `<span class="cl-name" style="color:var(--whatsapp)">FREE boxes (offer)</span>` +
                      `<span class="cl-sum" style="color:var(--whatsapp)">${free} box${free > 1 ? "es" : ""}</span>`;
        linesEl.appendChild(f);
      }
    }
  }
  if (totalEl) totalEl.textContent = money(total());
}

/* ---------- WhatsApp deep link ---------- */
function waUrl(text) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
const greeting = () => "Assalamu Alaikum! I would like to order Ma Sha Allah Talbina.";

function orderMessage(form) {
  const name = form.custName.value.trim();
  const phone = form.custPhone.value.trim();
  const address = form.custAddress.value.trim();
  const notes = form.custNotes.value.trim();
  const free = freeBoxes();

  const L = [];
  L.push("Assalamu Alaikum! I would like to order Ma Sha Allah Talbina:");
  L.push("");
  L.push(`- Name: ${name}`);
  if (phone) L.push(`- Phone: ${phone}`);
  L.push("- - -");
  L.push(`- Quantity: ${qty} Box${qty > 1 ? "es" : ""} (${money(CONFIG.product.price)} each)`);
  if (free > 0) L.push(`- Offer: Buy ${CONFIG.offer.buyEvery} Get ${CONFIG.offer.getFree} Free -> ${free} FREE box${free > 1 ? "es" : ""}`);
  L.push(`- TOTAL: ${money(total())}`);
  L.push("- - -");
  L.push(`- Address: ${address}`);
  if (notes) { L.push("- Notes:"); L.push(`  ${notes}`); }
  return L.join("\n");
}

/* ---------- Wire steppers ---------- */
function initSteppers() {
  $$(".qty-stepper").forEach((stepper) => {
    const input = $(".qty-input", stepper);
    $$("[data-action]", stepper).forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = btn.getAttribute("data-action") === "inc" ? 1 : -1;
        setQty(qty + delta);
      });
    });
    if (input) {
      input.value = qty;
      input.addEventListener("input", () => setQty(input.value));
      input.addEventListener("blur", () => setQty(input.value));
    }
  });

  // "Order on WhatsApp" button on the product card just jumps to the form.
  const add = $(".add-to-order");
  if (add) add.addEventListener("click", () => { if (qty < 1) setQty(1); });
}

/* ---------- Floating WhatsApp + form submit ---------- */
function initWhatsApp() {
  const float = $("#waFloat");
  if (float) float.href = waUrl(greeting());
  const sw = $("#socialWhatsapp");
  if (sw) sw.href = waUrl(greeting());

  const form = $("#orderForm");
  const errorEl = $("#formError");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ""; }
    $$(".invalid", form).forEach((el) => el.classList.remove("invalid"));

    const problems = [];
    if (qty < 1) problems.push("Please select at least 1 box.");
    if (!form.custName.value.trim()) { form.custName.classList.add("invalid"); problems.push("Please enter your name."); }
    if (!form.custAddress.value.trim()) { form.custAddress.classList.add("invalid"); problems.push("Please enter your delivery address."); }
    if (form.custPhone.value.trim() && !/^[0-9+\-\s()]{6,}$/.test(form.custPhone.value.trim())) {
      form.custPhone.classList.add("invalid");
      problems.push("Please enter a valid phone number (or leave it blank).");
    }

    if (problems.length) {
      if (errorEl) { errorEl.textContent = problems.join(" "); errorEl.hidden = false; }
      const firstBad = $(".invalid", form) || errorEl;
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    window.open(waUrl(orderMessage(form)), "_blank", "noopener");
  });

  // Clear error banner/styling as the user corrects fields.
  form.addEventListener("input", (e) => {
    if (e.target && e.target.classList) e.target.classList.remove("invalid");
    if (errorEl && !errorEl.hidden) { errorEl.hidden = true; errorEl.textContent = ""; }
  });
}

/* ---------- Header shadow + scroll-spy nav ---------- */
function initHeaderAndNav() {
  const header = $("#siteHeader");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#navToggle");
  const nav = $("#mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const links = $$(".main-nav a.nav-link");
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }
}

/* ---------- Reveal-on-scroll ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((i) => i.classList.add("visible")); return; }
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); ro.unobserve(entry.target); }
    });
  }, { threshold: 0.14 });
  items.forEach((i) => ro.observe(i));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderConfig();
  initSteppers();
  renderTotals();
  initWhatsApp();
  initHeaderAndNav();
  initReveal();
});
