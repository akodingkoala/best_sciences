# Before You Go: pre-visit questionnaire (Vite + React)

```bash
cd web
npm install
npm run dev      # local dev server
npm run build    # production build in web/dist (deploy with root directory = web)
```

- Patient side: `/` · Clinic scanner: `/#/clinic`
- Questionnaire wording, topics, crisis resources, demo data: `src/data/content.js`
- Visit-card ordering logic: `src/lib/summary.js`
- QR payload encode/decode (no server; data lives in the URL fragment): `src/lib/share.js`
- FHIR R4 QuestionnaireResponse export: `src/lib/fhir.js`
- Camera scanning needs HTTPS (or localhost). "Upload a photo of the code" works anywhere.

## "Ask about my card" chat (visit card page)

A chat button in the bottom-right of step 4 answers questions using the patient's visit card plus web search (Claude API).

- Frontend: `src/components/ChatWidget.jsx` (sends the plain-text card from `summaryToText` with each question)
- Server: `server/chat.js` (shared logic), exposed as `api/chat.js` on Vercel and as Vite middleware in `npm run dev`
- Needs `ANTHROPIC_API_KEY`: put it in `web/.env` for local dev, and in the host's environment variables for the deployed app. Optional `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`).
- Safety layers: (1) questions about medicines, doses, prescriptions, refills, side effects or interactions get a fixed refusal before the model is called; (2) self-harm messages get a fixed 988/911 reply; (3) the system prompt restricts answers to the card and reputable sources, with no diagnosis; (4) any reply containing a dose amount not already on the card is replaced with the refusal.
- Hosting: Vercel picks up `api/` automatically (root directory = `web`). On a static-only host the chat will show "unavailable".
