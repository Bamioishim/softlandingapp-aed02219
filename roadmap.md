# Roadmap

- [x] Audit and finish score cap, Visiting heading, city-selection searches and mode-switch reruns
- [x] Improve Qloo photo selection and prevent tiny thumbnail upscaling
- [x] Verify and correct README claims; run regression tests and search flows
- [ ] Verify live Qloo photos/results and live similar-city search end to end — blocked: Qloo rejects the saved API key with HTTP 401; requires a valid replacement

- [x] Clear copied Drizzle migrations and rescaffold empty migration set (journal already empty, no migration files)
- [x] Update QLOO_API_KEY secret (new value saved via secure form)
- [ ] Live Qloo end to end: currently blocked by provider HTTP 401; failure/sample handling verified for Paris, Ilorin and Lagos
- [x] When Qloo returns nothing: "<City> isn't available yet" + 2-3 similar cities + "Request <City>" button (verified with Lyon; insert-only policy confirmed)
- [x] Agent steps panel collapsed by default with real call timings (verified in browser)
- [x] Place insights send exactly filter.type, filter.location.query, take=20; real HTTP status/body shown in Agent steps on failure (Paris + Abuja verified live)
- [x] No design changes
- [x] Fixed city picker bug: curated cities (e.g. Paris, France) were hidden behind GeoNames namesakes (Paris, Texas)

- [x] Neighborhood cards: distinct Qloo place photo per card, else plain cream card with name
- [x] Budget/pace only rank/filter results, never sent to Qloo
- [x] "Isn't available yet": 2-3 hardcoded similar cities (same country/region first; Ilorin -> Lagos, Abuja, Accra)
- [x] Pick-your-city panel: Moving/Visiting (day-by-day trip plan), Life stage, taste chips (Qloo interests), Climate (ranks similar cities)
- [x] Map: free OpenStreetMap tiles (no keys); neighborhood and spot cards open their map pin
