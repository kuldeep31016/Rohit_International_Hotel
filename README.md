# Rohit International Hotel — Website Prototype

A presentation-ready homepage prototype for **Hotel Rohit International, Old G.T. Road, Sasaram, Bihar 821115**.
Static HTML / CSS / JS — no build step, no dependencies.

## Run it

```bash
cd /Users/kuldeepraj/rohithotel && python3 -m http.server 5520
```

Then open http://localhost:5520. Any static host works for sharing: Netlify, Vercel, GitHub Pages or plain cPanel hosting.

## Structure

The site has eight pages, generated from shared parts:

| Page | Contents |
|---|---|
| `index.html` | Image-only hero, availability bar, story, "Discover" cards, auto-sliding packages, ratings & reviews |
| `stay.html` | Rooms & suites (Taj-style cards), amenities |
| `dining.html` | Family Food Court, dining options, dishes |
| `experiences.html` | Sher Shah Suri's Tomb, nearby places, getting here (station & airports) |
| `events.html` | Weddings, banquets, corporate events |
| `gallery.html` | Filterable gallery with lightbox |
| `about.html` | Story, facts, ratings & award |
| `contact.html` | Address, phones, map, getting here |

**Edit the source, then rebuild** (don't edit the root `*.html` files directly; they're generated):

```
src/partials/   head, header/nav/mobile menu, footer + booking drawer + lightbox
src/sections/   one file per section (hero, stay, dining, places, travel, offers, …)
build.py        page list (title, description, banner, sections) → writes the root *.html
assets/         css/style.css, js/main.js, img/ (responsive WebP)
```

```bash
python3 build.py
```

Bump `VERSION` in `build.py` to make browsers fetch fresh CSS/JS.

## Design direction

- **Type:** Cormorant Garamond (editorial headings) with Manrope (UI and body text).
- **Palette:** warm ivory `#f7f2ea`, cream `#efe7da`, deep charcoal `#171411` and muted brass `#a8834f`.
- **Patterns:** section headers with a rule-line eyebrow, title on the left and copy on the right; restrained 2px radii; slow, eased reveals.

## Facts used (from hotelrohitinternational.com)

- **Address:** Old G.T. Road, Sasaram, Bihar 821115
- **Phone:** +91 6184 222 033 and +91 82298 01202. WhatsApp is set to the mobile number.
- **Email:** booking@, corporate@, feedback@ and job@hotelrohitinternational.com
- **Room types:** Standard Room, Executive Room, Suite Deluxe, Executive Suite
- **Facilities:** attached bath, hot & cold water, cable TV, telephone, veg & non-veg Indian restaurant, car parking, 24-hour taxi, doctor on call
- **Booking policy:** "Book now & pay at check-in; confirmed by call or email"
- **Restaurant name:** "Family Food Court", from the sign in the hotel's own lobby photo
- **Published ratings:** Service 98%, Taste 99%, Cleanliness 100%
- **Award:** TripAdvisor Certificate of Excellence 2013 (badge on their site; shown as text only, no TripAdvisor logo)
- **Tariff:** "Starts from Rs. 1500" (homepage banner). May be outdated, so confirm it

## ⚠️ To confirm with the client before going live

| Item | Where | Status |
|---|---|---|
| Distances: Sasaram Jn 2 km, Sher Shah Suri Tomb ~3 km, Hasan Khan Suri Tomb ~3 km, Tarachandi ~6 km, Rohtasgarh ~55 km, Varanasi Airport ~120 km, Patna Airport ~160 km | Experiences / Getting here | Approximate, need verifying |
| Restaurant hours | Dining | `[Restaurant hours]` placeholder |
| Guest reviews | Testimonials | Sample text, labelled as such; replace with verified Google reviews |
| Tariffs / package rates | Offers | Shown as "Rates on request" |
| Instagram URL, Privacy Policy, Terms | Footer | Placeholder modals |
| Room sizes, bed types | Stay | Not shown until confirmed |
| "Tariffs from ₹1,500", 98/99/100% ratings, TripAdvisor 2013 | Stay, Testimonials | Taken from the current site; confirm they are still accurate |
| Sasaram Junction, Varanasi and Patna airport photos, and the Tarachandi temple photo (supplied by us) | Experiences, Nearby | Source and rights need clearing; the Tarachandi image carries a photographer watermark |

## Images

- **The hotel's own photos:** the façade (`real-exterior`), the lobby (`real-lobby`) and the celebration hall (`real-hall`). These are low resolution. **A professional photo shoot is the single biggest upgrade for the live site.**
- **Interior, room and food photography:** Unsplash stock, used for presentation only. Replace it with the hotel's own shoot.
- **Landmarks (Wikimedia Commons, credited on the page):**
  - Sher Shah Suri's Tomb: Rahulsinghxl (CC BY-SA 4.0) and Nandanupadhyay (CC BY-SA 3.0)
  - Hasan Khan Suri's Tomb: Amitabha Gupta (CC BY 4.0)
  - Rohtasgarh Fort: Rangan Datta Wiki (CC BY-SA 4.0)
  - Sher Shah Suri's Tomb (HD feature): Abhishek.yadav1227 (CC BY-SA 4.0); blue-sky view: DhruvBih (CC BY-SA 4.0)
    - Litti chokha: Star zyz (CC BY 4.0)

## Availability & booking (prototype behaviour)

- **"Check availability" banner:** returns **indicative**, deterministic availability per date range, labelled as such on the page. For production, connect it to the hotel's channel manager or booking engine in `checkAvailability()` in `main.js`.
- **Booking drawer:** validates the guest's name, mobile number and dates. It then builds a pre-filled **WhatsApp message** to the front desk, or the guest can call. This works today with no backend.

## Motion

- **Hero:** image-only slideshow (Taj-style), with the brand in the navbar. The logo intro plays once per visit.
- **Numbers:** distances and ratings count up when they scroll into view.
- **Packages:** auto-advance one card every 3.5 s in a seamless loop, with a progress line. They keep moving on hover and pause only while touched or keyboard-focused.
- **Accessibility:** all motion turns off for visitors who have "reduce motion" enabled.
# Rohit_International_Hotel
