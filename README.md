# Soft Landing

**Move anywhere, feel at home.** Soft Landing is a voice-first AI relocation and trip agent for any city in the world. Pick a destination, say (or type) what you love — music, food, art, nightlife, vibe — and Soft Landing matches you with neighborhoods and places that fit, explains why each one was picked, and builds a personal plan.

**Live demo:** https://softlandingapp.lovable.app

Built for the [Qloo Agentic Hackathon](https://qloo.devpost.com).

## How Qloo powers it
- **Live Qloo insights.** Every search makes real, server-side calls to the Qloo Taste AI API: taste lookups for your interests, place insights for the city, and a neighborhood heatmap. The API key never reaches the browser.
- **Qloo photos.** Place and neighborhood cards use Qloo's own place images (`images.qloo.com`), or a plain card when Qloo has none — never stock photos.
- **"Why we picked this."** Every result explains its match. Match scores come from Qloo affinity and heatmap signals, capped at 99%.
- **"How Soft Landing decided" panel.** Shows each step the agent took (e.g. "Qloo taste lookup: jazz", "Qloo Paris place insights", "Qloo Paris neighborhood heatmap") with timings.
- **"Without Qloo" toggle.** Re-runs the same search against built-in sample data, clearly labelled "Sample data, not from Qloo", so you can see exactly what Qloo adds.
- If Qloo fails or a city isn't covered, the app says so and shows labelled sample data or similar supported cities instead of inventing results.

## Other features
- Voice input (Web Speech API) and read-aloud answers, with a typing fallback
- Any city via a built-in city index with suggestions
- Budget, pace, life stage and climate preferences used to rank and filter (not sent to Qloo)
- Moving mode (first-30-days checklist, saved in the browser) and Visiting mode (day-by-day trip plan)
- Interactive OpenStreetMap map with pins and "Get Directions"

## Tech stack
- React + Vite + TypeScript, TanStack Start server functions, Tailwind CSS (built with Lovable)
- Supabase (Lovable Cloud) backend
- Qloo Taste AI API (insights, tags, heatmap), called server-side

## How to run
Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Bamioishim/softlandingapp.git
cd softlandingapp
npm install
```

Set the environment variables (in a local `.env`, and as secrets on your server / Supabase project — never commit real secret keys):

```bash
QLOO_API_KEY=your_qloo_hackathon_key   # server-side secret; base URL https://hackathon.api.qloo.com, header X-Api-Key
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase publishable/anon key>
VITE_SUPABASE_PROJECT_ID=<project id>
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<supabase publishable/anon key>
SUPABASE_PROJECT_ID=<project id>
```

Then:

```bash
npm run dev
```

Open the local URL shown in the terminal. Without `QLOO_API_KEY`, the app shows clearly labelled sample data instead of live Qloo results.

## License
MIT. See [LICENSE](LICENSE).
