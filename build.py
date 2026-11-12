#!/usr/bin/env python3
"""Build the static site: src/partials + src/sections -> one HTML file per page.

Usage:  python3 build.py
Edit content in src/sections/*.html (shared sections) and the PAGES table below.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
VERSION = "33"  # bump to bust browser caches for css/js

SITE = "Rohit International Hotel"

PAGES = [
    {
        "file": "index.html", "nav": None,
        "title": f"{SITE}, Sasaram | Rooms, Dining & Celebrations on Old G.T. Road",
        "description": "Rohit International Hotel on Old G.T. Road, Sasaram, Bihar — rooms and suites, Family Food Court restaurant and a celebration hall. 2 km from Sasaram Junction, minutes from Sher Shah Suri's Tomb.",
        "preload": "hero-bedroom",
        "sections": ["hero", "availability", "intro", "explore", "offers", "testimonials", "cta"],
    },
    {
        "file": "stay.html", "nav": "stay",
        "title": f"Rooms & Suites | {SITE}, Sasaram",
        "description": "Standard Room, Executive Room, Suite Deluxe and Executive Suite at Rohit International Hotel, Sasaram. Book now, pay at check-in.",
        "hero": ("room-executive", 1600, "Executive Room at Rohit International", "50% 42%"),
        "eyebrow": "Stay", "heading": "Rooms <em>&amp; Suites</em>",
        "lead": "Four ways to stay — from a restful room for the night to a generous suite for the family. Every room has an attached bath with running hot and cold water.",
        "sections": ["availability", "stay", "cta"],
    },
    {
        "file": "dining.html", "nav": "dining",
        "title": f"Family Food Court Restaurant | {SITE}, Sasaram",
        "description": "Family Food Court at Rohit International Hotel, Sasaram — Indian cuisine, vegetarian and non-vegetarian, litti chokha, biryani and room service.",
        "hero": ("dine-restaurant", 1600, "The restaurant at evening", "50% 60%"),
        "eyebrow": "Dining", "heading": "Family <em>Food Court</em>",
        "lead": "Honest Indian cooking — vegetarian and non-vegetarian — in a dining room done in warm earth tones, or brought to your door.",
        "sections": ["dining", "cta"],
    },
    {
        "file": "experiences.html", "nav": "experiences",
        "title": f"Sasaram Sightseeing & Getting Here | {SITE}",
        "description": "Sher Shah Suri's Tomb (~3 km), Maa Tarachandi Temple, Rohtasgarh Fort — and how to reach Rohit International Hotel from Sasaram Junction, Varanasi and Patna airports.",
        "hero": ("sasaram-tomb-reflection", 1400, "Sher Shah Suri's Tomb at dusk", "50% 8%"),
        "eyebrow": "Experiences", "heading": "Sasaram <em>&amp; beyond</em>",
        "lead": "The birthplace of Sher Shah Suri, a hillside shrine and one of India's great forts — all within easy reach of the hotel.",
        "sections": ["heritage", "places", "travel", "cta"],
    },
    {
        "file": "events.html", "nav": "events",
        "title": f"Weddings, Banquets & Events | {SITE}, Sasaram",
        "description": "Celebration hall at Rohit International Hotel, Sasaram for weddings, receptions, banquets, birthdays and corporate meetings.",
        "hero": ("event-tablescape", 1920, "A table dressed for a celebration"),
        "eyebrow": "Events", "heading": "Weddings <em>&amp; Celebrations</em>",
        "lead": "Our celebration hall has hosted Sasaram's weddings, receptions and family milestones for years.",
        "sections": ["events", "cta"],
    },
    {
        "file": "gallery.html", "nav": "gallery",
        "title": f"Gallery | {SITE}, Sasaram",
        "description": "Photos of Rohit International Hotel, Sasaram — rooms, dining, events and nearby sights.",
        "hero": ("hotel-lounge", 1600, "Lounge at the hotel"),
        "eyebrow": "Gallery", "heading": "A glimpse <em>inside</em>",
        "lead": "Rooms, food, celebrations and the sights of Sasaram.",
        "sections": ["gallery"],
    },
    {
        "file": "about.html", "nav": "about",
        "title": f"About Us | {SITE}, Sasaram",
        "description": "Rohit International Hotel on Old G.T. Road, Sasaram — a family atmosphere, 24-hour taxi, doctor on call and a TripAdvisor Certificate of Excellence.",
        "hero": ("real-lobby", 1600, "Reception and lobby of Hotel Rohit International", "50% 40%"),
        "eyebrow": "About", "heading": "Our <em>story</em>",
        "lead": "A family's welcome on the Grand Trunk Road.",
        "sections": ["intro", "testimonials", "cta"],
    },
    {
        "file": "contact.html", "nav": "contact",
        "title": f"Contact & Location | {SITE}, Old G.T. Road, Sasaram",
        "description": "Address, phone, WhatsApp, email and map for Rohit International Hotel, Old G.T. Road, Sasaram, Bihar 821115.",
        "hero": ("hero-living", 1920, "The lounge"),
        "eyebrow": "Contact", "heading": "Find <em>us</em>",
        "lead": "Old G.T. Road, Sasaram, Bihar 821115 — 2 km from Sasaram Junction.",
        "sections": ["findus", "travel"],
    },
]


def read(p):
    return (SRC / p).read_text(encoding="utf-8")


def card(m):
    href, img, meta, title, text, cta = m.group(1).split("|")
    return f'''<article class="tcard reveal">
            <a href="{href}" class="tcard__media"><img src="assets/img/{img}" alt="{re.sub('<[^>]+>|&amp;', '', title)}" width="800" height="533" loading="lazy"></a>
            <div class="tcard__body">
              <span class="meta">{meta}</span>
              <h3 class="tcard__title">{title}</h3>
              <p>{text}</p>
              <div class="tcard__actions">
                <a class="btn btn--primary btn--sm" href="{href}">{cta}</a>
                <a class="tcard__more" href="{href}">More <svg><use href="#i-chev-r"/></svg></a>
              </div>
            </div>
          </article>'''


def page_hero(pg):
    img, big, alt, *rest = pg["hero"]
    pos = f' style="--pos: {rest[0]}"' if rest else ""
    return f'''    <!-- ============ Page banner ============ -->
    <section class="page-hero"{pos} aria-label="{alt}">
      <img src="assets/img/{img}-{big}.webp" srcset="assets/img/{img}-800.webp 800w, assets/img/{img}-{big}.webp {big}w" sizes="100vw" alt="{alt}" fetchpriority="high">
    </section>
    <header class="page-intro">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span aria-current="page">{pg["eyebrow"]}</span></nav>
        <h1 class="h1 page-intro__title">{pg["heading"]}</h1>
        <p class="lead page-intro__lead">{pg["lead"]}</p>
      </div>
    </header>

'''


def build():
    head, top, bottom = read("partials/head.html"), read("partials/chrome-top.html"), read("partials/chrome-bottom.html")
    for pg in PAGES:
        body = "".join(read(f"sections/{s}.html") for s in pg["sections"])
        if "hero" in pg:
            body = page_hero(pg) + body
        body = re.sub(r"\{\{card:(.*?)\}\}", card, body)

        preload = ""
        if pg.get("preload"):
            n = pg["preload"]
            preload = (f'  <link rel="preload" as="image" href="assets/img/{n}-1280.webp" '
                       f'imagesrcset="assets/img/{n}-800.webp 800w, assets/img/{n}-1280.webp 1280w, assets/img/{n}-1920.webp 1920w" imagesizes="100vw">\n')

        nav = top
        if pg["nav"]:
            nav = nav.replace(f'<a href="{pg["nav"]}.html">', f'<a href="{pg["nav"]}.html" class="is-active" aria-current="page">')
        html = (head + nav + '  <main id="main" class="page page--' + (pg["nav"] or "home") + '">\n' + body + "  </main>\n" + bottom)
        html = (html.replace("{{title}}", pg["title"].replace("&", "&amp;"))
                    .replace("{{description}}", pg["description"])
                    .replace("{{file}}", "" if pg["file"] == "index.html" else pg["file"])
                    .replace("{{preload}}", preload)
                    .replace("{{v}}", VERSION))
        # in-page anchors that now live on other pages
        html = html.replace('href="#about"', 'href="#about"' if "intro" in pg["sections"] else 'href="about.html"')
        (ROOT / pg["file"]).write_text(html, encoding="utf-8")
        print("built", pg["file"])


if __name__ == "__main__":
    build()
