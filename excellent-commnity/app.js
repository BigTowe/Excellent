/* ═══════════════════════════════════════════════
   EXCELLENT COMMUNITY — APP LOGIC
   Рендер из config.js, формы, анимации,
   панель настройки (Ctrl+Shift+A)
   ═══════════════════════════════════════════════ */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  if (!CFG) { console.error("config.js не найден"); return; }

  /* ── локальные переопределения (панель настройки) ── */
  const LS_KEY = "ec_overrides_v1";
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { overrides = {}; }

  function deepMerge(base, over) {
    if (Array.isArray(over)) return over;
    if (over && typeof over === "object") {
      const out = Object.assign({}, base);
      for (const k of Object.keys(over)) out[k] = deepMerge(base ? base[k] : undefined, over[k]);
      return out;
    }
    return over === undefined ? base : over;
  }
  let C = deepMerge(CFG, overrides);

  function get(path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  }
  function set(path, value) {
    const keys = path.split(".");
    let o = overrides;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof o[keys[i]] !== "object" || o[keys[i]] === null) o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }
  function saveOverrides() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(overrides)); } catch (e) {}
  }

  /* ── тема ── */
  function applyTheme() {
    const t = C.theme || {};
    const root = document.documentElement.style;
    if (t.accent) {
      root.setProperty("--accent", t.accent);
      root.setProperty("--accent-soft", hexToRgba(t.accent, 0.14));
      root.setProperty("--shadow-glow", "0 0 48px " + hexToRgba(t.accent, 0.35));
      root.setProperty("--grad", "linear-gradient(120deg, " + t.accent + ", " + (t.accent2 || "#22D3EE") + ")");
    }
    if (t.background) root.setProperty("--bg", t.background);
  }
  function hexToRgba(hex, a) {
    const m = String(hex).replace("#", "");
    const f = m.length === 3 ? m.split("").map(x => x + x).join("") : m;
    const n = parseInt(f, 16);
    if (isNaN(n)) return "rgba(124,92,255," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ── helpers ── */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function nl(s) { return esc(s).replace(/\n/g, "<br>"); }

  const ICONS = {
    layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 7V3M8 3h8"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M9.5 17h5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15l-3-3c1-4.5 4-8 9-9 .5 5-2.5 8.5-6 12z"/><path d="M9 12l-3 1-1 4 4-1 1-3M15 18l-1 3-4 1 1-4"/><circle cx="15" cy="9" r="1.4"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4a5 5 0 00-6.7 6.3L3 15.6V21h5.4l5.3-5.3A5 5 0 0020 9l-3 3-3-3 3-3a5 5 0 00-2-2z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 19 18.5c-.2 1-.8 1.2-1.7.8l-4.4-3.3-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.3-7.5c.4-.3-.1-.5-.5-.2L7.8 12.4l-4.4-1.4c-1-.3-1-1 .2-1.4l17.5-6.7c.8-.3 1.5.2 1.3 1.4z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7"/></svg>'
  };
  const icon = (n) => ICONS[n] || ICONS.spark;

  /* ── SEO ── */
  function applySeo() {
    const s = C.seo || {};
    if (s.title) document.title = s.title;
    let d = document.querySelector('meta[name="description"]');
    if (s.description) { if (!d) { d = document.createElement("meta"); d.name = "description"; document.head.appendChild(d); } d.content = s.description; }
    if (s.keywords) {
      let k = document.querySelector('meta[name="keywords"]');
      if (!k) { k = document.createElement("meta"); k.name = "keywords"; document.head.appendChild(k); }
      k.content = s.keywords;
    }
  }

  /* ── i18n-привязка (data-i18n) ── */
  function applyI18n() {
    $$("[data-i18n]").forEach(el => {
      const v = get(el.getAttribute("data-i18n"));
      if (v != null) el.innerHTML = nl(v);
    });
  }

  /* ── видимость разделов ── */
  const SECTION_IDS = {
    hero: "hero", marquee: "marquee", about: "about", services: "services",
    portfolio: "work", process: "process", pricing: "pricing",
    order: "order", faq: "faq", footerCta: "footerCta"
  };
  function applySections() {
    const cfg = C.sections || {};
    Object.keys(SECTION_IDS).forEach(key => {
      const el = document.getElementById(SECTION_IDS[key]);
      if (!el) return;
      const on = cfg[key] !== false; // по умолчанию показываем
      el.style.display = on ? "" : "none";
    });
    // прячем пункты меню для скрытых разделов
    const navMap = { work: "portfolio", services: "services", process: "process", pricing: "pricing", faq: "faq" };
    $$(".nav-link").forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      const key = navMap[href];
      if (key) link.style.display = (cfg[key] !== false) ? "" : "none";
    });
  }

  /* ── статичные ссылки ── */
  function bindStatic() {
    const tg = C.brand.telegram || "#";
    const tgText = C.brand.telegramText || "@secoxyde";
    $("#logoText").textContent = C.brand.logoText || C.brand.name;
    $("#logoSub").textContent = C.brand.logoSub || "";
    $("#heroAvatar").textContent = C.hero.avatarInitials || (C.brand.short || "EC");
    $("#heroTgBtn").href = tg;
    $("#heroTgText").textContent = tgText;
    $("#aboutCta").href = C.about.ctaLink || tg;
    $("#footerCtaBtn").href = C.footer.ctaLink || tg;
    $("#successTgBtn").href = tg;
    $("#footerYear").textContent = new Date().getFullYear();

    const meta = [];
    if (C.brand.city) meta.push(esc(C.brand.city));
    if (C.brand.email) meta.push(esc(C.brand.email));
    $("#heroAvatarMeta").innerHTML = meta.join(" · ");
  }

  /* ── статистика hero ── */
  function renderStats() {
    const box = $("#heroStats");
    box.innerHTML = (C.stats || []).map(s =>
      '<div class="stat-item"><div class="stat-value" data-count="' + Number(s.value) + '">' +
      esc(s.prefix || "") + '0' + esc(s.suffix || "") +
      '</div><div class="stat-label">' + esc(s.label) + "</div></div>"
    ).join("");
  }

  /* ── бегущая строка ── */
  function renderMarquee() {
    const items = C.marquee || [];
    const html = items.map(t => '<span class="marquee-item">' + esc(t) + "</span>").join("");
    $("#marqueeTrack").innerHTML = html + html;
  }

  /* ── about-панель ── */
  function renderAboutPanel() {
    const bullets = $("#aboutBullets");
    if (bullets) {
      bullets.innerHTML = (C.about.bullets || []).map(t => "<li>" + esc(t) + "</li>").join("");
    }
    const b = C.brand;
    $("#aboutPanel").innerHTML =
      '<span class="c">// excellent.config</span><br>' +
      '<span class="k">team</span>: <span class="v">"' + esc(b.name) + '"</span><br>' +
      '<span class="k">members</span>: <span class="v">1</span> <span class="c">(и этого достаточно)</span><br>' +
      '<span class="k">founder</span>: <span class="v">"' + esc(b.author) + '"</span><br>' +
      '<span class="k">telegram</span>: <span class="v">"' + esc(b.telegramText || "") + '"</span><br>' +
      '<span class="k">focus</span>: [<span class="v">"design"</span>, <span class="v">"web"</span>, <span class="v">"bots"</span>]<br>' +
      '<span class="k">status</span>: <span class="v">"открыт к проектам"</span> 🟢';
  }

  /* ── услуги ── */
  function renderServices() {
    $("#servicesGrid").innerHTML = (C.services.items || []).map(s =>
      '<article class="service-card reveal glow-card">' +
      (s.tag ? '<span class="service-tag">' + esc(s.tag) + "</span>" : "") +
      '<div class="service-icon">' + icon(s.icon) + "</div>" +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.text) + "</p>" +
      '<div class="service-price">' + esc(s.price) + "</div>" +
      "</article>"
    ).join("");
  }

  /* ── портфолио ── */
  function workMedia(w, big) {
    if (w.image) {
      return '<img src="' + esc(w.image) + '" alt="' + esc(w.title) + '" loading="lazy">';
    }
    const g = w.gradient || ["#7C5CFF", "#22D3EE"];
    const initials = String(w.title || "").split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase();
    return '<div class="work-ph" style="background:linear-gradient(135deg,' + esc(g[0]) + "," + esc(g[1] || g[0]) + ')"><span>' + esc(initials) + "</span></div>";
  }

  let currentFilter = "all";
  function renderPortfolio() {
    const items = C.portfolio.items || [];
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
    $("#filterBar").innerHTML =
      '<button class="filter-btn' + (currentFilter === "all" ? " active" : "") + '" data-cat="all">' + esc(C.portfolio.allLabel || "Все") + "</button>" +
      cats.map(c => '<button class="filter-btn' + (currentFilter === c ? " active" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>").join("");

    const isFeatured = (w) => w.featured === true || w.featured === "true" || w.featured === 1 || w.featured === "1";
    $("#workGrid").innerHTML = items.map((w, i) =>
      '<button type="button" class="work-card reveal' + (isFeatured(w) ? " featured" : "") + (currentFilter !== "all" && w.category !== currentFilter ? " hidden-card" : "") + '" data-idx="' + i + '">' +
      '<div class="work-media">' + workMedia(w) +
      (w.year ? '<span class="work-year">' + esc(w.year) + "</span>" : "") +
      '<span class="work-overlay"><span class="work-overlay-btn">Смотреть кейс →</span></span>' +
      "</div>" +
      '<div class="work-body">' +
      '<div class="work-cat">' + esc(w.category || "") + "</div>" +
      "<h3>" + esc(w.title) + "</h3>" +
      "<p>" + esc(w.short || "") + "</p>" +
      '<div class="work-tags">' + (w.tags || []).slice(0, 3).map(t => "<span>" + esc(t) + "</span>").join("") + "</div>" +
      "</div></button>"
    ).join("");

    $$("#filterBar .filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.cat;
        $$("#filterBar .filter-btn").forEach(b => b.classList.toggle("active", b === btn));
        $$("#workGrid .work-card").forEach(card => {
          const w = items[Number(card.dataset.idx)];
          card.classList.toggle("hidden-card", currentFilter !== "all" && w.category !== currentFilter);
        });
        observeReveals();
      });
    });

    $$("#workGrid .work-card").forEach(card => {
      card.addEventListener("click", () => openModal(items[Number(card.dataset.idx)], Number(card.dataset.idx)));
    });
  }

  /* ── модалка работы ── */
  let modalIndex = -1;
  function modalItems() { return C.portfolio.items || []; }

  function openModal(w, idx) {
    if (!w) return;
    const items = modalItems();
    modalIndex = (typeof idx === "number") ? idx : items.indexOf(w);
    $("#modalMedia").innerHTML = workMedia(w, true);
    $("#modalTags").innerHTML = [w.category, w.year].filter(Boolean).concat(w.tags || []).map(t => "<span>" + esc(t) + "</span>").join("");
    $("#modalTitle").textContent = w.title;
    $("#modalDesc").innerHTML = nl(w.description || w.short || "");
    $("#modalResults").innerHTML = (w.results || []).map(r => "<span>" + esc(r) + "</span>").join("");
    const link = $("#modalLink");
    if (w.link) { link.href = w.link; link.classList.remove("hidden"); } else { link.classList.add("hidden"); }
    const counter = $("#modalCounter");
    if (counter) {
      const show = items.length > 1;
      counter.textContent = show ? (modalIndex + 1) + " / " + items.length : "";
      counter.style.display = show ? "" : "none";
      $$(".modal-nav").forEach(n => { n.style.display = show ? "" : "none"; });
    }
    const m = $("#workModal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const card = m.querySelector(".modal-card");
    if (card) { card.scrollTop = 0; }
  }
  function navModal(step) {
    const items = modalItems();
    if (items.length < 2) return;
    modalIndex = (modalIndex + step + items.length) % items.length;
    openModal(items[modalIndex], modalIndex);
  }
  function closeModal() {
    const m = $("#workModal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalIndex = -1;
  }

  /* ── процесс ── */
  function renderProcess() {
    $("#timeline").innerHTML = (C.process.steps || []).map(s =>
      '<li class="reveal">' +
      '<span class="step-num">' + esc(s.num) + "</span>" +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.text) + "</p>" +
      '<span class="step-dur">' + esc(s.duration) + "</span>" +
      "</li>"
    ).join("");
  }

  /* ── цены ── */
  function renderPricing() {
    $("#pricingGrid").innerHTML = (C.pricing.items || []).map(p =>
      '<div class="price-card reveal' + (p.featured ? " featured" : "") + '">' +
      (p.badge ? '<span class="price-badge">' + esc(p.badge) + "</span>" : "") +
      '<div class="price-name">' + esc(p.name) + "</div>" +
      '<div class="price-value">' + (p.currency ? '<small>' + esc(p.currency) + "</small> " : "") + esc(p.price) + "</div>" +
      '<div class="price-period">' + esc(p.period || "") + "</div>" +
      '<p class="price-desc">' + esc(p.description || "") + "</p>" +
      '<ul class="price-features">' + (p.features || []).map(f => "<li>" + esc(f) + "</li>").join("") + "</ul>" +
      '<a class="btn ' + (p.featured ? "btn-primary" : "btn-ghost") + ' btn-block" href="#order">' + esc(p.cta || "Заказать") + "</a>" +
      "</div>"
    ).join("");
  }

  /* ── FAQ ── */
  function renderFaq() {
    $("#faqList").innerHTML = (C.faq.items || []).map((f, i) =>
      '<div class="faq-item reveal">' +
      '<button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
      "<span>" + esc(f.q) + '</span><span class="chev">▼</span></button>' +
      '<div class="faq-a" id="faq-a-' + i + '"><div class="faq-a-inner">' + nl(f.a) + "</div></div>" +
      "</div>"
    ).join("");

    $$(".faq-q").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const panel = item.querySelector(".faq-a");
        const isOpen = item.classList.contains("open");
        $$(".faq-item.open").forEach(o => {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = "";
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ── соцсети футера ── */
  function renderSocials() {
    $("#footerSocials").innerHTML = (C.footer.socials || []).map(s =>
      '<a class="social-btn" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="' + esc(s.name) + '" aria-label="' + esc(s.name) + '">' + icon(s.icon) + "</a>"
    ).join("");
  }

  /* ── форма заказа ── */
  function renderOrderSelects() {
    const o = C.order;
    $("#fType").innerHTML = o.types.map((t, i) => '<option value="' + esc(t) + '"' + (i === 0 ? " selected" : "") + ">" + esc(t) + "</option>").join("");
    $("#fBudget").innerHTML = o.budgets.map(b => '<option value="' + esc(b) + '">' + esc(b) + "</option>").join("");
    $("#fDeadline").innerHTML = o.deadlines.map(d => '<option value="' + esc(d) + '">' + esc(d) + "</option>").join("");
  }

  function buildMessage() {
    const o = C.order;
    const name = $("#fName").value.trim();
    const contact = $("#fContact").value.trim();
    const type = $("#fType").value;
    const budget = $("#fBudget").value;
    const deadline = $("#fDeadline").value;
    const message = $("#fMessage").value.trim();
    return (
      "Заявка с сайта " + (C.brand.name || "") + "\n" +
      "─────────────────────\n" +
      "Имя: " + name + "\n" +
      "Контакт: " + contact + "\n" +
      "Тип проекта: " + type + "\n" +
      "Бюджет: " + budget + "\n" +
      "Срок: " + deadline + "\n" +
      (message ? "\nОписание:\n" + message + "\n" : "") +
      "─────────────────────"
    );
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  function initOrderForm() {
    const form = $("#orderForm");
    const success = $("#orderSuccess");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      ["#fName", "#fContact"].forEach(sel => {
        const el = $(sel);
        const bad = !el.value.trim();
        el.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) { form.querySelector(".invalid")?.focus(); return; }

      const text = buildMessage();
      const copied = await copyText(text);
      $("#successMsg").textContent = text;
      form.classList.add("hidden");
      success.classList.remove("hidden");
      success.scrollIntoView({ behavior: "smooth", block: "center" });

      // опциональная отправка на webhook
      if (C.order.webhook) {
        try {
          await fetch(C.order.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: $("#fName").value, contact: $("#fContact").value,
              type: $("#fType").value, budget: $("#fBudget").value,
              deadline: $("#fDeadline").value, message: $("#fMessage").value,
              text: text
            })
          });
        } catch (err) { console.warn("webhook не ответил:", err); }
      }
      if (!copied) console.warn("Не удалось скопировать автоматически — текст показан на экране.");
    });

    $("#copyAgainBtn").addEventListener("click", async () => {
      const ok = await copyText($("#successMsg").textContent);
      $("#copyAgainBtn").textContent = ok ? "Скопировано ✓" : C.order.copyAgainBtn;
      setTimeout(() => { $("#copyAgainBtn").textContent = C.order.copyAgainBtn; }, 1800);
    });

    $("#newOrderBtn").addEventListener("click", () => {
      form.reset();
      success.classList.add("hidden");
      form.classList.remove("hidden");
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ── анимации появления ── */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(el => el.classList.add("visible"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $$(".reveal:not(.visible)").forEach(el => io.observe(el));
  }

  /* ── счётчики ── */
  function animateCounters() {
    $$("[data-count]").forEach(el => {
      const target = Number(el.dataset.count) || 0;
      const suffixEl = (C.stats || []).find(s => String(s.value) === String(target));
      const suffix = suffixEl ? (suffixEl.suffix || "") : "";
      let started = false;
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const dur = 1400;
          const t0 = performance.now();
          (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* ── шапка, меню, скроллспай ── */
  function initNav() {
    const header = $("#siteHeader");
    const burger = $("#burgerBtn");
    const nav = $("#siteNav");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-link").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));

    const sections = ["work", "services", "process", "pricing", "faq"];
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          $$(".nav-link").forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ── свечение карточек за курсором ── */
  function initGlowCards() {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".glow-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ── модалка: события ── */
  function initModal() {
    $("#workModal").addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeModal();
      const nav = e.target.closest("[data-nav]");
      if (nav) navModal(Number(nav.dataset.nav));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); closeAdmin(); }
      const m = $("#workModal");
      if (m && m.classList.contains("open")) {
        if (e.key === "ArrowLeft") navModal(-1);
        if (e.key === "ArrowRight") navModal(1);
      }
    });
  }

  /* ═══════ ПАНЕЛЬ НАСТРОЙКИ ═══════ */
  const ADMIN_SCHEMA = [
    { title: "Разделы сайта", toggles: [
      { path: "sections.hero", label: "Главный экран" },
      { path: "sections.marquee", label: "Бегущая строка" },
      { path: "sections.about", label: "О себе" },
      { path: "sections.services", label: "Услуги" },
      { path: "sections.portfolio", label: "Портфолио" },
      { path: "sections.process", label: "Процесс работы" },
      { path: "sections.pricing", label: "Тарифы" },
      { path: "sections.order", label: "Форма заказа" },
      { path: "sections.faq", label: "Вопросы и ответы" },
      { path: "sections.footerCta", label: "Блок «Написать в Telegram»" }
    ]},
    { title: "Бренд", fields: [
      { path: "brand.name", label: "Название" },
      { path: "brand.tagline", label: "Подпись" },
      { path: "brand.author", label: "Автор" },
      { path: "brand.telegram", label: "Ссылка Telegram" },
      { path: "brand.telegramText", label: "Текст ссылки (@...)" },
      { path: "brand.email", label: "Email" },
      { path: "brand.city", label: "Город" }
    ]},
    { title: "Главный экран", fields: [
      { path: "hero.badge", label: "Бейдж" },
      { path: "hero.titleLine1", label: "Заголовок, строка 1" },
      { path: "hero.titleHighlight", label: "Акцентное слово" },
      { path: "hero.titleLine2", label: "Заголовок, строка 2" },
      { path: "hero.subtitle", label: "Подзаголовок", type: "textarea" },
      { path: "hero.primaryBtn", label: "Кнопка 1" },
      { path: "hero.secondaryBtn", label: "Кнопка 2" }
    ]},
    { title: "О себе", fields: [
      { path: "about.title", label: "Заголовок" },
      { path: "about.text1", label: "Текст 1", type: "textarea" },
      { path: "about.text2", label: "Текст 2", type: "textarea" }
    ]},
    { title: "Секции (списки)", lists: [
      { path: "services.items", label: "Услуги", itemFields: [
        { key: "title", label: "Название" }, { key: "text", label: "Описание", type: "textarea" }, { key: "price", label: "Цена" }, { key: "tag", label: "Метка" }
      ]},
      { path: "portfolio.items", label: "Работы", itemFields: [
        { key: "title", label: "Название" }, { key: "category", label: "Категория" }, { key: "year", label: "Год" },
        { key: "image", label: "Картинка (путь)" }, { key: "short", label: "Кратко", type: "textarea" },
        { key: "description", label: "Описание", type: "textarea" }, { key: "link", label: "Ссылка" },
        { key: "featured", label: "Широкая карточка (true/false)" }
      ]},
      { path: "process.steps", label: "Этапы", itemFields: [
        { key: "num", label: "Номер" }, { key: "title", label: "Название" }, { key: "text", label: "Описание", type: "textarea" }, { key: "duration", label: "Срок" }
      ]},
      { path: "faq.items", label: "FAQ", itemFields: [
        { key: "q", label: "Вопрос", type: "textarea" }, { key: "a", label: "Ответ", type: "textarea" }
      ]}
    ]},
    { title: "Цвета", fields: [
      { path: "theme.accent", label: "Основной цвет", type: "color" },
      { path: "theme.accent2", label: "Второй цвет", type: "color" },
      { path: "theme.background", label: "Фон", type: "color" }
    ]}
  ];

  function buildAdmin() {
    const body = $("#adminBody");
    let html = "";
    ADMIN_SCHEMA.forEach(sec => {
      html += '<div class="admin-section"><b>' + esc(sec.title) + "</b>";
      (sec.toggles || []).forEach(t => {
        const on = get(t.path) !== false;
        html += '<label class="admin-toggle"><input type="checkbox" data-path="' + t.path + '" data-bool="1"' + (on ? " checked" : "") + '"><span class="switch"></span><span class="tl">' + esc(t.label) + "</span></label>";
      });
      (sec.fields || []).forEach(f => {
        const v = get(f.path) ?? "";
        if (f.type === "textarea") {
          html += '<label class="admin-field"><span>' + esc(f.label) + '</span><textarea data-path="' + f.path + '">' + esc(v) + "</textarea></label>";
        } else if (f.type === "color") {
          html += '<label class="admin-field"><span>' + esc(f.label) + '</span><input type="color" data-path="' + f.path + '" value="' + esc(/^#[0-9a-fA-F]{6}$/.test(v) ? v : "#7C5CFF") + '"></label>';
        } else {
          html += '<label class="admin-field"><span>' + esc(f.label) + '</span><input type="text" data-path="' + f.path + '" value="' + esc(v) + '"></label>';
        }
      });
      (sec.lists || []).forEach(list => {
        html += '<div class="admin-field"><span>' + esc(list.label) + '</span></div><div data-list="' + list.path + '">';
        html += listMarkup(list);
        html += "</div>";
      });
      html += "</div>";
    });
    body.innerHTML = html;

    // простые поля
    $$("[data-path]", body).forEach(input => {
      input.addEventListener("input", () => {
        const val = input.dataset.bool ? input.checked : input.value;
        set(input.dataset.path, val);
        saveOverrides();
        rerender();
        // перерисовка панели не нужна для toggle — но rebuild для списков
        if (!input.dataset.bool && input.closest("[data-list]")) buildAdmin();
      });
    });
    bindListEvents(body);
  }

  function listMarkup(list) {
    const arr = get(list.path) || [];
    return arr.map((item, i) => {
      let h = '<div class="admin-list-item" data-idx="' + i + '"><div class="row"><b style="font-size:12px;color:var(--text-faint)">#' + (i + 1) + '</b><button type="button" class="admin-del" data-del="' + i + '">Удалить</button></div>';
      list.itemFields.forEach(f => {
        const v = item[f.key] ?? "";
        if (f.type === "textarea") {
          h += '<label class="admin-field"><span>' + esc(f.label) + '</span><textarea data-key="' + f.key + '" data-idx="' + i + '" data-listpath="' + list.path + '">' + esc(v) + "</textarea></label>";
        } else {
          h += '<label class="admin-field"><span>' + esc(f.label) + '</span><input type="text" data-key="' + f.key + '" data-idx="' + i + '" data-listpath="' + list.path + '" value="' + esc(v) + '"></label>';
        }
      });
      return h + "</div>";
    }).join("") + '<button type="button" class="admin-add" data-add="' + list.path + '">+ Добавить</button>';
  }

  function bindListEvents(root) {
    $$("[data-key]", root).forEach(input => {
      input.addEventListener("input", () => {
        const path = input.dataset.listpath;
        const idx = Number(input.dataset.idx);
        const key = input.dataset.key;
        const cur = JSON.parse(JSON.stringify(get(path) || []));
        cur[idx][key] = input.value;
        set(path, cur);
        saveOverrides();
        rerender();
      });
    });
    $$("[data-del]", root).forEach(btn => {
      btn.addEventListener("click", () => {
        const listPath = btn.closest("[data-list]").dataset.list;
        const idx = Number(btn.dataset.del);
        const cur = JSON.parse(JSON.stringify(get(listPath) || []));
        cur.splice(idx, 1);
        set(listPath, cur);
        saveOverrides();
        buildAdmin();
        rerender();
      });
    });
    $$("[data-add]", root).forEach(btn => {
      btn.addEventListener("click", () => {
        const listPath = btn.dataset.add;
        const cur = JSON.parse(JSON.stringify(get(listPath) || []));
        const sample = JSON.parse(JSON.stringify(cur[cur.length - 1] || {}));
        // обнуляем тексты, чтобы не дублировать
        Object.keys(sample).forEach(k => { if (typeof sample[k] === "string" && !["category", "icon", "num"].includes(k)) sample[k] = ""; });
        if (sample.num) sample.num = String(Number(sample.num) + 1 || cur.length + 1);
        if (sample.title === undefined) sample.title = "";
        cur.push(sample);
        set(listPath, cur);
        saveOverrides();
        buildAdmin();
        rerender();
      });
    });
  }

  function openAdmin() { $("#adminPanel").classList.add("open"); $("#adminPanel").setAttribute("aria-hidden", "false"); }
  function closeAdmin() { $("#adminPanel").classList.remove("open"); $("#adminPanel").setAttribute("aria-hidden", "true"); }

  function initAdmin() {
    buildAdmin();
    $("#adminFab").addEventListener("click", openAdmin);
    $("#adminClose").addEventListener("click", closeAdmin);
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a" || e.code === "KeyA")) {
        e.preventDefault();
        $("#adminPanel").classList.contains("open") ? closeAdmin() : openAdmin();
      }
    });

    $("#adminReset").addEventListener("click", () => {
      if (!confirm("Удалить все локальные правки и вернуться к config.js?")) return;
      overrides = {};
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      location.reload();
    });

    $("#adminDownload").addEventListener("click", () => {
      const merged = deepMerge(CFG, overrides);
      const blob = new Blob(
        ["/* Excellent Community — config.js (сгенерировано панелью настройки " + new Date().toLocaleString("ru-RU") + ") */\nwindow.SITE_CONFIG = " + JSON.stringify(merged, null, 2) + ";\n"],
        { type: "text/javascript;charset=utf-8" }
      );
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "config.js";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    });
  }

  /* ── перерисовка после правок ── */
  function rerender() {
    C = deepMerge(CFG, overrides);
    applyTheme();
    applySeo();
    applyI18n();
    applySections();
    bindStatic();
    renderStats();
    renderMarquee();
    renderAboutPanel();
    renderServices();
    renderPortfolio();
    renderProcess();
    renderPricing();
    renderFaq();
    renderSocials();
    renderOrderSelects();
    observeReveals();
    animateCounters();
  }

  /* ── старт ── */
  function init() {
    rerender();
    initNav();
    initGlowCards();
    initModal();
    initOrderForm();
    initAdmin();

    // плавный скролл с учётом фиксированной шапки
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
