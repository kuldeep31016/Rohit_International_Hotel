/* =========================================================================
   ROHIT INTERNATIONAL HOTEL — interactions
   Plain JS, no dependencies.
   ========================================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Content (kept separate from markup) ---------- */
  const HOTEL = {
    whatsapp: "918229801202",
    phone: "+916184222033",
  };

  const ROOMS = [
    { id: "standard", name: "Standard Room", note: "Single · Double", img: "assets/img/room-standard-800.webp" },
    { id: "executive", name: "Executive Room", note: "Single · Double", img: "assets/img/room-executive-800.webp" },
    { id: "suite-deluxe", name: "Suite Deluxe", note: "Families · Longer stays", img: "assets/img/room-suite-deluxe-800.webp" },
    { id: "executive-suite", name: "Executive Suite", note: "Our finest", img: "assets/img/room-executive-suite-800.webp" },
  ];

  const EVENTS = [
    { img: "event-tablescape", big: 1280, caption: "Weddings & receptions", text: "From the tilak to the reception — a dressed stage, a dedicated kitchen and rooms for the wedding party." },
    { img: "event-banquet", caption: "Banquets & private parties", text: "A flexible hall for banquets and private dinners, with menus planned around your guests." },
    { img: "event-conference", caption: "Corporate meetings", text: "Meetings, seminars and team dinners on the G.T. Road, with rooms for delegates who stay over." },
    { img: "event-celebration", big: 1280, caption: "Birthdays & anniversaries", text: "Milestones deserve a proper table. Tell us the occasion — we'll handle the details." },
  ];

  /* ---------- Utilities ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const nights = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 86400000);
  const fmtShort = (s) => fromISO(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const fmtWeekday = (s) => fromISO(s).toLocaleDateString("en-IN", { weekday: "short" });
  const fmtLong = (s) => fromISO(s).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  let toastTimer;
  const toast = (msg) => {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
  };

  // Focus trap for dialogs
  let lastFocus = null;
  const trap = (container, e) => {
    if (e.key !== "Tab") return;
    const f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ---------- Hero title: split into letters for a staggered reveal ---------- */
  const heroTitle = $(".hero__title");
  if (heroTitle && !reduceMotion) {
    let n = 0;
    heroTitle.querySelectorAll(".line > span").forEach((wrap) => {
      const walk = (node) => {
        [...node.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            [...c.textContent].forEach((ch) => {
              const s = document.createElement("span");
              s.className = "char"; s.textContent = ch; s.style.setProperty("--i", n++);
              s.setAttribute("aria-hidden", "true");
              frag.appendChild(s);
            });
            c.replaceWith(frag);
          } else walk(c);
        });
      };
      walk(wrap);
    });
    heroTitle.setAttribute("aria-label", "Rohit International Hotel, Sasaram");
    heroTitle.classList.add("is-split");
  }

  /* ---------- Preloader ---------- */
  const markLoaded = () => document.documentElement.classList.add("is-loaded");
  const heroImg = $(".hero__slide.is-active img, .page-hero img");
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem("ri-intro") === "1"; sessionStorage.setItem("ri-intro", "1"); } catch (_) { /* storage blocked */ }
  const minDelay = reduceMotion || seenIntro ? 0 : 900;
  const start = performance.now();
  const finish = () => setTimeout(markLoaded, Math.max(0, minDelay - (performance.now() - start)));
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener("load", finish, { once: true });
    heroImg.addEventListener("error", finish, { once: true });
    setTimeout(markLoaded, 3500); // never block the page
  } else finish();
  document.body.classList.add("is-ready");
  // .is-loaded is set on <html>; mirror selectors use it.
  document.documentElement.classList.add("js");

  /* ---------- Header: transparent → solid, hide on scroll down ---------- */
  const header = $("#header");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const heroH = ($(".hero") || $(".page-hero"))?.offsetHeight || 400;
    header.classList.toggle("is-solid", y > 60);
    const goingDown = y > lastY;
    header.classList.toggle("is-hidden", goingDown && y > heroH * 0.9 && !document.body.classList.contains("is-locked"));
    lastY = y;
    $("#mobile-cta")?.classList.toggle("is-visible", y > heroH * 0.7);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobile-menu");
  const menuBtn = $("[data-menu-open]");
  const openMenu = () => {
    lastFocus = document.activeElement;
    menu.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    setTimeout(() => $(".mobile-menu__close").focus(), 300);
  };
  const closeMenu = () => {
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    lastFocus?.focus?.();
  };
  menuBtn.addEventListener("click", openMenu);
  $$("[data-menu-close]").forEach((el) => el.addEventListener("click", closeMenu));
  menu.addEventListener("keydown", (e) => trap(menu, e));

  /* ---------- Hero slideshow ---------- */
  const slides = $$(".hero__slide");
  const pagerBtns = $$(".hero__pager button, .hero__dots button");
  let slideIdx = 0, slideTimer;
  const showSlide = (i) => {
    slideIdx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === slideIdx));
    pagerBtns.forEach((b, k) => {
      b.classList.toggle("is-active", k === slideIdx);
      b.setAttribute("aria-selected", k === slideIdx);
      // restart progress animation
      const bar = b.querySelector("i"); bar.style.display = "none"; void bar.offsetWidth; bar.style.display = "";
    });
  };
  const autoplay = () => { clearInterval(slideTimer); if (!reduceMotion && slides.length > 1) slideTimer = setInterval(() => showSlide(slideIdx + 1), 7000); };
  pagerBtns.forEach((b) => b.addEventListener("click", () => { showSlide(+b.dataset.slide); autoplay(); }));
  // Warm up the remaining slides right after the first one, so every change is instant.
  const warmSlides = () => $$("img[data-hero-lazy]").forEach((img) => { img.loading = "eager"; img.decode?.().catch(() => {}); });
  if (document.readyState === "complete") warmSlides(); else window.addEventListener("load", warmSlides, { once: true });
  autoplay();
  document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(slideTimer) : autoplay()));

  /* ---------- Availability (one-line banner) ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let lastAvailability = null;
  const avForm = $("#availability-form");
  const avIn = $("#av-checkin"), avOut = $("#av-checkout");
  if (avForm) {
  avIn.min = toISO(today);
  avIn.value = toISO(addDays(today, 1));
  avOut.value = toISO(addDays(today, 2));
  avOut.min = toISO(addDays(fromISO(avIn.value), 1));

  const paintDate = (input) => {
    const el = $(`[data-date-display="${input.name}"]`);
    el.innerHTML = input.value ? `${fmtShort(input.value)}<small>${fmtWeekday(input.value)}</small>` : "Select";
  };
  [avIn, avOut].forEach((inp) => {
    paintDate(inp);
    inp.addEventListener("change", () => {
      if (inp === avIn) {
        const minOut = addDays(fromISO(avIn.value), 1);
        avOut.min = toISO(minOut);
        if (!avOut.value || fromISO(avOut.value) <= fromISO(avIn.value)) { avOut.value = toISO(minOut); paintDate(avOut); }
      }
      paintDate(inp);
    });
    // Open native picker on click anywhere in the field
    inp.closest(".field").addEventListener("click", (e) => {
      if (typeof inp.showPicker === "function") { try { inp.showPicker(); e.preventDefault(); } catch (_) { /* fall back to native */ } }
    });
  });

  // Indicative availability: deterministic per date range so the demo is stable.
  // Replace with the hotel's reservation system / channel manager API in production.
  const seeded = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296); };
  const checkAvailability = (checkin, checkout, rooms) => {
    const rand = seeded(`${checkin}|${checkout}`);
    const weekend = [5, 6].includes(fromISO(checkin).getDay());
    return ROOMS.map((r, i) => {
      let left = Math.floor(rand() * 7) - (weekend ? 2 : 0) - (i === 3 ? 2 : 0);
      left = Math.max(0, left);
      const status = left === 0 || left < rooms ? "full" : left <= 2 ? "limited" : "ok";
      return { ...r, left, status };
    });
  };

  avForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!avIn.value || !avOut.value || nights(avIn.value, avOut.value) < 1) { toast("Please choose a check-out date after check-in."); return; }
    const rooms = +$("#av-rooms").value;
    const btn = avForm.querySelector(".availability__submit");
    btn.textContent = "Checking…"; btn.disabled = true;

    setTimeout(() => {
      const res = checkAvailability(avIn.value, avOut.value, rooms);
      lastAvailability = res;
      const n = nights(avIn.value, avOut.value);
      const open = res.filter((r) => r.status !== "full");
      const status = $('[data-av="status"]');
      status.className = "availability__status";
      if (!open.length) { status.textContent = "Fully booked for these dates"; status.classList.add("is-full"); }
      else if (open.every((r) => r.status === "limited")) { status.textContent = "Only a few rooms left for your dates"; status.classList.add("is-limited"); }
      else status.textContent = "Good news — rooms are available";

      $('[data-av="dates"]').textContent = `${fmtLong(avIn.value)} — ${fmtLong(avOut.value)} · ${n} night${n > 1 ? "s" : ""} · ${$("#av-guests").selectedOptions[0].text}`;
      $('[data-av="rooms"]').innerHTML = res.map((r) => {
        const label = r.status === "full" ? "Sold out" : r.status === "limited" ? `${r.left} left` : "Available";
        return `<li><span class="dot ${r.status === "ok" ? "" : "dot--" + r.status}"></span><b>${r.name}</b> · ${label}</li>`;
      }).join("");
      $("#availability-result").classList.add("is-open");
      btn.textContent = "Check availability"; btn.disabled = false;
    }, reduceMotion ? 0 : 650);
  });
  }

  /* ---------- Booking drawer ---------- */
  const drawer = $("#booking");
  const bkForm = $("#booking-form");
  const bkIn = $("#bk-checkin"), bkOut = $("#bk-checkout");
  const state = { guests: 2, rooms: 1, room: "executive" };
  bkIn.min = toISO(today);

  const renderRoomOptions = () => {
    const avail = lastAvailability && lastAvailability.length ? lastAvailability : null;
    const wrap = $("#room-options");
    wrap.querySelectorAll(".room-option").forEach((n) => n.remove());
    ROOMS.forEach((r) => {
      const a = avail?.find((x) => x.id === r.id);
      const status = a?.status || "ok";
      const tag = a ? (status === "full" ? "Sold out" : status === "limited" ? `${a.left} left` : "Available") : "On request";
      const lab = document.createElement("label");
      lab.className = "room-option" + (status === "full" ? " is-disabled" : "");
      lab.innerHTML = `<input type="radio" name="room" value="${r.id}" ${status === "full" ? "disabled" : ""}>
        <img src="${r.img}" alt="" loading="lazy" width="72" height="56">
        <span><strong>${r.name}</strong><small>${r.note}</small></span>
        <span class="tag ${status === "ok" ? "" : "is-" + status}"><span class="dot ${status === "ok" ? "" : "dot--" + status}"></span>${tag}</span>`;
      wrap.appendChild(lab);
    });
    let pick = $(`input[name="room"][value="${state.room}"]`, wrap);
    if (!pick || pick.disabled) pick = $('input[name="room"]:not([disabled])', wrap);
    if (pick) { pick.checked = true; state.room = pick.value; }
    $$('input[name="room"]', wrap).forEach((i) => i.addEventListener("change", () => { state.room = i.value; renderSummary(); }));
  };

  const renderSummary = () => {
    const box = $("#booking-summary");
    const room = ROOMS.find((r) => r.id === state.room);
    const type = $("#bk-type").value;
    const n = bkIn.value && bkOut.value ? nights(bkIn.value, bkOut.value) : 0;
    const rows = [];
    if (type === "stay" || type === "taxi") {
      rows.push(["Dates", bkIn.value && bkOut.value && n > 0 ? `${fmtShort(bkIn.value)} – ${fmtShort(bkOut.value)} · ${n} night${n > 1 ? "s" : ""}` : "Select dates"]);
      rows.push(["Room", room ? `${state.rooms} × ${room.name}` : "—"]);
    } else {
      rows.push(["Date", bkIn.value ? fmtLong(bkIn.value) : "Select a date"]);
    }
    rows.push(["Guests", `${state.guests}`]);
    rows.push(["Payment", "At check-in"]);
    box.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("");
  };

  const syncTypeUI = () => {
    const type = $("#bk-type").value;
    const titles = { stay: "Reserve your stay", event: "Plan your event", table: "Reserve a table", taxi: "Request a pickup" };
    const subs = { stay: "Book now, pay at check-in.", event: "Weddings, banquets and gatherings in our celebration hall.", table: "Indian cuisine — vegetarian & non-vegetarian.", taxi: "Station and airport transfers, 24 hours." };
    $("#booking-title").textContent = titles[type];
    $("#booking-sub").textContent = subs[type];
    const isStay = type === "stay";
    $("#room-options").style.display = isStay ? "" : "none";
    bkOut.closest(".fgroup").style.display = type === "event" || type === "table" ? "none" : "";
    bkIn.previousElementSibling.textContent = isStay ? "Check-in" : type === "taxi" ? "Pickup date" : "Date";
    $("#booking-foot .btn").textContent = isStay ? "Request reservation" : "Send enquiry";
    renderSummary();
  };

  const openBooking = (trigger) => {
    lastFocus = trigger || document.activeElement;
    const ds = trigger?.dataset || {};
    // carry over dates from the availability bar
    bkIn.value = avIn?.value || toISO(addDays(today, 1));
    bkOut.value = avOut?.value || toISO(addDays(today, 2));
    bkOut.min = toISO(addDays(fromISO(bkIn.value), 1));
    state.guests = Math.min(+$("#av-guests")?.value || 2, 12);
    state.rooms = +$("#av-rooms")?.value || 1;
    if (ds.roomPick) state.room = ds.roomPick;
    $("#bk-type").value = ds.bookingType || "stay";
    $("#bk-offer").value = ds.offer || "";
    $("#bk-guests").textContent = state.guests; $("#bk-rooms").textContent = state.rooms;

    bkForm.hidden = false; $("#booking-success").classList.remove("is-visible"); $("#booking-foot").hidden = false;
    renderRoomOptions(); syncTypeUI();

    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    setTimeout(() => $(".drawer__close", drawer).focus(), 350);
  };
  const closeBooking = () => {
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lastFocus?.focus?.();
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-booking]");
    if (t) { e.preventDefault(); closeMenu(); openBooking(t); }
  });
  $$("[data-close-booking]").forEach((el) => el.addEventListener("click", closeBooking));
  drawer.addEventListener("keydown", (e) => trap(drawer, e));

  $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
    const key = b.dataset.step, dir = +b.dataset.dir;
    const lim = key === "guests" ? [1, 40] : [1, 20];
    state[key] = Math.min(lim[1], Math.max(lim[0], state[key] + dir));
    $(`#bk-${key}`).textContent = state[key];
    renderSummary();
  }));
  $("#bk-type").addEventListener("change", syncTypeUI);
  bkIn.addEventListener("change", () => {
    const minOut = addDays(fromISO(bkIn.value), 1);
    bkOut.min = toISO(minOut);
    if (!bkOut.value || fromISO(bkOut.value) <= fromISO(bkIn.value)) bkOut.value = toISO(minOut);
    renderSummary();
  });
  bkOut.addEventListener("change", renderSummary);

  const setError = (input, msg) => {
    const g = input.closest(".fgroup");
    g.classList.toggle("has-error", !!msg);
    const e = g.querySelector(".error"); if (e) e.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  };
  $$("#bk-name, #bk-phone").forEach((i) => i.addEventListener("input", () => setError(i, "")));

  bkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = $("#bk-type").value;
    const name = $("#bk-name"), phone = $("#bk-phone");
    let ok = true;
    if (name.value.trim().length < 2) { setError(name, "Please enter your name."); ok = false; } else setError(name, "");
    const digits = phone.value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(digits)) { setError(phone, "Please enter a valid 10-digit mobile number."); ok = false; } else setError(phone, "");
    if (!bkIn.value) { setError(bkIn, "Please choose a date."); ok = false; } else setError(bkIn, "");
    const needsOut = type === "stay" || type === "taxi";
    if (needsOut && type === "stay" && (!bkOut.value || nights(bkIn.value, bkOut.value) < 1)) { setError(bkOut, "Check-out must be after check-in."); ok = false; } else setError(bkOut, "");
    if (!ok) { $(".has-error input", bkForm)?.focus(); return; }

    const room = ROOMS.find((r) => r.id === state.room);
    const typeLabel = { stay: "Room reservation", event: "Event enquiry", table: "Table reservation", taxi: "Pickup request" }[type];
    const lines = [
      `Hello Rohit International Hotel,`,
      ``,
      `${typeLabel}`,
      type === "stay" ? `Dates: ${fmtLong(bkIn.value)} to ${fmtLong(bkOut.value)} (${nights(bkIn.value, bkOut.value)} night/s)` : `Date: ${fmtLong(bkIn.value)}`,
      type === "stay" ? `Room: ${state.rooms} x ${room?.name}` : null,
      `Guests: ${state.guests}`,
      $("#bk-offer").value ? `Package: ${$("#bk-offer").value}` : null,
      $("#bk-promo").value ? `Promo code: ${$("#bk-promo").value}` : null,
      $("#bk-notes").value ? `Requests: ${$("#bk-notes").value}` : null,
      ``,
      `Name: ${name.value.trim()}`,
      `Mobile: ${digits}`,
    ].filter((l) => l !== null).join("\n");

    $("#success-wa").href = `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(lines)}`;
    $("#success-text").textContent = `Thank you, ${name.value.trim().split(" ")[0]}. Your ${typeLabel.toLowerCase()} is ready — send it to our front desk on WhatsApp, or call us, and we will confirm shortly.`;
    bkForm.hidden = true; $("#booking-foot").hidden = true;
    $("#booking-success").classList.add("is-visible");
    $("#booking-success .btn").focus();
  });

  /* ---------- Events switcher ---------- */
  const evImg = $("#event-image");
  if (evImg) {
  $$("[data-event]").forEach((b) => b.addEventListener("click", () => {
    const ev = EVENTS[+b.dataset.event];
    $$("[data-event]").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
    $("#event-detail").textContent = ev.text;
    $("#event-caption").textContent = ev.caption;
    evImg.classList.add("is-swapping");
    const next = new Image();
    const big = ev.big || 1600;
    next.src = `assets/img/${ev.img}-${big}.webp`;
    next.onload = () => {
      setTimeout(() => {
        evImg.srcset = `assets/img/${ev.img}-800.webp 800w, assets/img/${ev.img}-${big}.webp ${big}w`;
        evImg.src = next.src; evImg.alt = ev.caption;
        evImg.classList.remove("is-swapping");
      }, 250);
    };
  }));
  }
  // preload event images on idle
  if (evImg) (window.requestIdleCallback || setTimeout)(() => EVENTS.forEach((ev) => { const i = new Image(); i.src = `assets/img/${ev.img}-800.webp`; }));

  /* ---------- Offers carousel: seamless loop, auto-advances, pauses on interaction ---------- */
  const track = $("[data-carousel]");
  if (track) {
  const prev = $("[data-carousel-prev]"), next = $("[data-carousel-next]");
  const progress = $(".offers__progress");
  const AUTOPLAY_MS = 3500;
  // Clone the set once so the strip can glide forever without a visible jump back.
  const originals = $$(".offer", track);
  originals.forEach((o) => {
    const c = o.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
    track.appendChild(c);
  });
  const setWidth = () => track.children[originals.length].offsetLeft - originals[0].offsetLeft;
  const step = () => originals[1].offsetLeft - originals[0].offsetLeft;
  // Own easing animation (doesn't rely on native smooth scrolling, which some browsers ignore).
  let animating = false;
  const glide = (to, dur = 900) => {
    if (reduceMotion) { track.scrollLeft = to; return; }
    const from = track.scrollLeft, t0 = performance.now();
    animating = true; track.style.scrollSnapType = "none";
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      track.scrollLeft = from + (to - from) * e;
      if (k < 1) requestAnimationFrame(tick);
      else { animating = false; track.style.scrollSnapType = ""; }
    };
    requestAnimationFrame(tick);
  };
  const move = (dir) => {
    if (animating) return;
    const w = setWidth(), st = step();
    track.style.scrollSnapType = "none";
    if (dir > 0 && track.scrollLeft + st > w + 2) track.scrollLeft -= w;   // seamless wrap
    if (dir < 0 && track.scrollLeft - st < -2) track.scrollLeft += w;
    const target = Math.round(track.scrollLeft / st) * st + dir * st;
    glide(target);
  };
  // Keeps gliding on its own; pauses only while a visitor is using the strip (keyboard focus or touch).
  let autoTimer = null, inView = false, touchedAt = 0;
  const isBusy = () => track.contains(document.activeElement) || Date.now() - touchedAt < 4000;
  const restartProgress = () => {
    if (!progress) return;
    progress.style.setProperty("--autoplay", `${AUTOPLAY_MS}ms`);
    progress.classList.remove("is-running"); void progress.offsetWidth;
    if (inView && !reduceMotion) progress.classList.add("is-running");
  };
  const startAuto = () => {
    clearInterval(autoTimer);
    restartProgress();
    if (reduceMotion || !inView) return;
    autoTimer = setInterval(() => { if (!isBusy()) move(1); restartProgress(); }, AUTOPLAY_MS);
  };
  track.addEventListener("touchstart", () => (touchedAt = Date.now()), { passive: true });
  const setInView = (v) => { if (v !== inView) { inView = v; startAuto(); } };
  new IntersectionObserver((en) => setInView(en[0].isIntersecting), { threshold: 0.2 }).observe(track);
  // Fallback for browsers that miss the first intersection callback
  window.addEventListener("scroll", () => { const r = track.getBoundingClientRect(); setInView(r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.2); }, { passive: true });
  prev.addEventListener("click", () => { move(-1); startAuto(); });
  next.addEventListener("click", () => { move(1); startAuto(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(autoTimer); else startAuto(); });
  }

  /* ---------- Gallery: filters + lightbox ---------- */
  const items = $$(".gallery__item");
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.filter;
    $$("[data-filter]").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
    items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
  }));

  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"), lbCount = $("#lb-count");
  let lbList = [], lbIdx = 0;
  const lbShow = (i) => {
    lbIdx = (i + lbList.length) % lbList.length;
    const it = lbList[lbIdx];
    lbImg.style.opacity = 0;
    const src = it.dataset.full;
    const img = new Image(); img.src = src;
    img.onload = () => { lbImg.src = src; lbImg.alt = it.querySelector("img").alt; lbImg.style.opacity = 1; };
    lbCap.innerHTML = `${it.dataset.caption}<small>${it.dataset.cat}</small>`;
    lbCount.textContent = `${pad(lbIdx + 1)} / ${pad(lbList.length)}`;
  };
  const lbOpen = (it) => {
    lastFocus = it;
    lbList = items.filter((x) => !x.classList.contains("is-hidden"));
    lbShow(lbList.indexOf(it));
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $('[data-lb="close"]').focus();
  };
  const lbClose = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.classList.remove("is-locked"); lastFocus?.focus?.(); };
  items.forEach((it) => it.addEventListener("click", () => lbOpen(it)));
  $('[data-lb="close"]').addEventListener("click", lbClose);
  $('[data-lb="prev"]').addEventListener("click", () => lbShow(lbIdx - 1));
  $('[data-lb="next"]').addEventListener("click", () => lbShow(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });
  lb.addEventListener("keydown", (e) => trap(lb, e));
  // swipe
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx === null) return; const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) lbShow(lbIdx + (dx < 0 ? 1 : -1)); tx = null;
  });

  /* ---------- Testimonials ---------- */
  const quotes = $$(".quote"), qDots = $$("[data-quote]");
  let qIdx = 0, qTimer;
  const showQuote = (i) => {
    qIdx = (i + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle("is-active", k === qIdx));
    qDots.forEach((d, k) => d.classList.toggle("is-active", k === qIdx));
  };
  const qPlay = () => { clearInterval(qTimer); if (!reduceMotion && quotes.length > 1) qTimer = setInterval(() => showQuote(qIdx + 1), 6500); };
  qDots.forEach((d) => d.addEventListener("click", () => { showQuote(+d.dataset.quote); qPlay(); }));
  qPlay();

  /* ---------- Modals (legal, socials) ---------- */
  const modal = $("#modal");
  const MODALS = {
    privacy: ["Privacy Policy", "The hotel's privacy policy will be published here. Personal details shared through reservation requests are used only to confirm and service your stay."],
    terms: ["Terms & Conditions", "Reservation, cancellation and check-in terms will be published here once confirmed by the hotel. Reservations are confirmed by a call or email from the front desk; payment is made at check-in."],
    instagram: ["Instagram", "The hotel's Instagram profile will be linked here once it is confirmed."],
  };
  $$("[data-modal]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); lastFocus = a;
    const [t, b] = MODALS[a.dataset.modal];
    $("#modal-title").textContent = t; $("#modal-body").textContent = b;
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
    $("[data-modal-close]").focus();
  }));
  const closeModal = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); lastFocus?.focus?.(); };
  $("[data-modal-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Global keys ---------- */
  document.addEventListener("keydown", (e) => {
    if (lb.classList.contains("is-open")) {
      if (e.key === "ArrowRight") lbShow(lbIdx + 1);
      if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    }
    if (e.key !== "Escape") return;
    if (lb.classList.contains("is-open")) lbClose();
    else if (modal.classList.contains("is-open")) closeModal();
    else if (drawer.classList.contains("is-open")) closeBooking();
    else closeMenu();
  });

  /* ---------- Scroll reveals ---------- */
  const revealEls = $$(".reveal, .reveal-img, .journey__line");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add("is-visible"));

  /* ---------- Count-up numbers ---------- */
  const counters = $$("[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; cio.unobserve(el);
        const target = +el.dataset.count;
        const [pre, post] = el.textContent.split(String(target));
        const t0 = performance.now(), dur = 1400;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
          el.textContent = `${pre}${Math.round(target * eased)}${post ?? ""}`;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Gentle parallax ---------- */
  const parallax = $$(".parallax");
  if (!reduceMotion && parallax.length) {
    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      parallax.forEach((p) => {
        const r = p.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const speed = parseFloat(p.dataset.speed || 0.06);
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        const img = p.querySelector("img");
        if (img) img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    run();
  }

  /* ---------- Lazy map ---------- */
  const mapFrame = $(".findus__map iframe");
  if (mapFrame) {
    const mio = new IntersectionObserver((en) => {
      if (en[0].isIntersecting) { mapFrame.src = mapFrame.dataset.src; mapFrame.addEventListener("load", () => $(".map-fallback")?.remove()); mio.disconnect(); }
    }, { rootMargin: "400px" });
    mio.observe(mapFrame);
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
