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
