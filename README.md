# Soft Landing

**Move anywhere, feel at home.** Soft Landing helps people moving to or visiting a city explore places and neighborhoods based on their tastes. Pick a recognized destination from the built-in city index, speak or type what you love, and choose Moving or Visiting. The app calls Qloo and uses built-in ranking and planning logic; it does not call an LLM.

Live demo: https://softlandingapp.lovable.app

Repository: https://github.com/Bamioishim/softlandingapp

Built for the [Qloo Agentic Hackathon](https://qloo.devpost.com).

## Features
- Pick any city from a built-in city index, or type one and pick a suggestion
- Real Qloo Taste AI Insights API requests for places in any recognized city, through a server function using the `QLOO_API_KEY` secret. Neighborhoods come from returned place locality labels; Qloo coverage is not guaranteed for every city.
- Browser-based voice input (Web Speech API) and read-aloud answers (speech synthesis), with a typing fallback
- Taste chips (Food, Music, Art, Nightlife, Outdoors, Fashion, Books, Film) become Qloo interest signals
- Monthly budget and lifestyle pace are used only to rank and filter results — they are never sent to Qloo
- Life stage (Student, Young professional, Family, Retiree) adds fitting steps to your plan
- Moving mode builds a first-30-days checklist; Visiting mode builds a day-by-day trip plan
- Climate preference helps rank the similar-city suggestions
- Neighborhood cards use distinct photos from their own Qloo places. The app removes common URL resizing parameters, prefers the largest known image dimensions, and hides images too small to fill the card without upscaling. Missing photos use a plain card.
- Live match scores use place affinity or estimated affinity from nearby taste heatmap cells, capped at 99%; absent scores are hidden. Sample rankings are illustrative, not Qloo scores.
- "Qloo-grounded" is the default. Switching to "Without Qloo" immediately reruns the search using generic built-in ideas, with the banner "Sample data, not from Qloo", no Qloo photos, and no claims of verified local picks.
- If Qloo fails, cities with a same-city sample dataset show clearly labelled samples; otherwise an error is shown. Empty results or unsupported Qloo localities show an unavailable message and 2–3 similar cities from a hardcoded list, not invented neighborhoods. Suggestions do not guarantee live Qloo coverage.
- Changing the header destination, clicking a similar city, or pressing Enter on a city suggestion starts a search for that destination.
- The first-30-days checklist is saved in the browser

## Tech stack
- TanStack Start + TanStack Router, React 19, Vite, TypeScript and Tailwind CSS (built with Lovable)
- Qloo Taste AI API (insights, tags, heatmap), called from a server function

## Run it locally
Requirements: a current Node.js version compatible with Vite 8 (Node.js 22.12+ or 24+) and npm.

```bash
git clone https://github.com/Bamioishim/softlandingapp.git
cd softlandingapp
npm install
npm run dev
```
Then open the local URL shown in the terminal.

## API keys
Keys are never committed. Set them as environment variables / server secrets:
- `QLOO_API_KEY` - your Qloo hackathon key (base URL https://hackathon.api.qloo.com, header `X-Api-Key`)

Without a key, live Qloo requests fail: cities with built-in same-city datasets show labelled sample data; other cities show an error. Without Qloo mode remains available for recognized destinations.

## License
MIT. See [LICENSE](LICENSE).
