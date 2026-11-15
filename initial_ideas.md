# Initial ideas

Brainstorm notes for HackRx 2026, Track 01 (Best Translational Science).
Written Nov 15, ~11:25 AM. Nothing here is locked until the team agrees and it moves into `AGENTS.md`.

## Leading idea: pre-visit check-in chat that carries new iron research into the exam room

**One line:** before an appointment, the patient tells a private chat about their symptoms; the doctor gets a one-page summary with suggested follow-up questions and a note applying the 2026 iron deficiency guideline.

### Problem

- Visits are short (about 10 minutes), so the doctor starts from zero and runs out of time.
- Patients forget or leave out symptoms under pressure, especially ones that feel embarrassing (periods, bowel habits).
- Low iron is commonly missed because doctors often test only for anemia, not iron stores (ferritin).

### Research insight we build on

- Iron stores affect the body before anemia appears. A 2023 JAMA study found almost 40% of US females aged 12 to 21 were iron deficient while 6% had anemia.
- The old ferritin cutoff of 15 was based on expert opinion; a CDC-led study found signs of shortage in women starting at about 25.
- The American Society of Hematology guideline (Blood Advances, 2026) raises the cutoff to 30 for adults and menstruating people, and to 50 for high-risk groups such as heavy menstrual bleeding. These recommendations are conditional.

### How it works

1. **Profile in:** the chat reads the patient profile (sex, age, whether they have periods, pregnancy, diet, medications, past labs) so it never asks what is already known.
2. **Shared core questions (everyone):** main concern in their own words, tiredness, dizziness, shortness of breath, hair and nail changes, diet, medications, family history.
3. **Tailored module, equal size for each sex (5 to 6 questions):**
   - Female profile: period length, clots, how often products are changed, overnight leaks, cycle changes, pregnancy history.
   - Male profile: stomach pain or heartburn, dark or bloody stools, regular painkiller use, alcohol, blood donation, recent weight loss.
4. **Confirming question:** "Do you currently get periods?" so the menstrual questions are skipped for menopause, hysterectomy, or birth control that stops periods.
5. **Patient review:** they read and approve the summary before it is shared.
6. **Doctor's page:** symptoms in the patient's words, what they flagged as hard to say, suggested follow-up questions, and a guideline note (for example "heavy bleeding reported; 2026 guideline uses ferritin cutoff of 50 for this group; no ferritin on record").

### Framing for the pitch

- Women: low iron is common and gets dismissed.
- Men: low iron is less common, so it is more often a warning sign of hidden blood loss.
- "Same discovery, different question to ask, depending on who is in the room."

### Fit with the three track criteria

| Criterion | How this answers it |
| --- | --- |
| Research insight to practical application | Delivers a two-month-old guideline at the moment it is relevant |
| Functional tool | Chat, tailored questions, and doctor summary all work live |
| Validation, feasibility, adoption | Compare chat summaries with clinician intake in a student health clinic; needs no new test or device; summary fits into an existing visit |

### Demo scenario

Four sample profiles (two women, two men; one ordinary and one flagged case each). A judge picks one, plays the patient for about two minutes, then flips to the doctor's page.

### Rules for the build

- The chat prepares, it does not diagnose or recommend treatment.
- Urgent symptoms (soaking a pad every hour, fainting, chest pain, heavy bleeding from the gut) trigger a "seek care now" message, not a summary.
- Sample patients only. No real patient data.
- Keep the question flow scripted; use an AI model only to write the summary, so the demo cannot be derailed.
- One chat engine reading questions from a list, so both modules are the same shape.

### Still to verify before it goes in the app or pitch

- [ ] Read the original ASH guideline paper and confirm the cutoffs (we have only read news coverage).
- [ ] Source for "people disclose more to a chatbot than to a doctor."
- [ ] Source for "low iron in men should prompt a check for gut blood loss."
- [ ] The five heavy-period questions come from clinical teaching material, not a scored tool; describe them as a screening prompt.
- [ ] Ask a clinician mentor: have you seen this problem, what do patients do today, who would use this?

### Optional add-on

Clinic view: load past ferritin results (sample file, or the public national health survey) and drag a cutoff slider from 15 to 30 to 50 to see how many "normal" patients fall below the new lines.

## Other ideas considered

| Idea | What it does | Why not chosen (so far) |
| --- | --- | --- |
| Dense breast letter explainer | Risk estimate and next steps after a dense-breast notice | Risk formula takes longer to implement |
| Duchenne exon-skipping checker | Matches a gene deletion to the drug that can repair it | Very small audience |
| Hemophilia "fuel gauge" | Shows current clotting-factor level through the day | Similar brand tools exist |
| Single-breath count | Microphone test tracking breathing strength in myasthenia gravis | Speech counting is harder to make reliable |
| Uncertain genetic result tracker | Alerts patients when a variant is reclassified | History data harder to get in a day |
| Digits-in-noise hearing screen | Browser hearing test with headphones | No link to the women's health focus |

## Sources

- Weyand et al., JAMA 2023: https://pmc.ncbi.nlm.nih.gov/articles/PMC10300696/
- Mei et al., Lancet Haematology 2021: https://pubmed.ncbi.nlm.nih.gov/34329578/
- Healio coverage of the ASH guideline (Powers et al., Blood Advances 2026, doi:10.1182/bloodadvances.2025015950): https://www.healio.com/news/hematology-oncology/20261022/ash-guideline-for-iron-deficiency-diagnosis-huge-step-forward
- Higham et al., pictorial blood loss chart, 1990: https://doi.org/10.1111/j.1471-0528.1990.tb16249.x
- Core IM iron deficiency segment (heavy-period history questions): https://www.tomwademd.net/?p=159722
- NBC News on missed iron deficiency: https://www.nbcnews.com/health/health-news/iron-deficiency-often-missed-young-women-girls-research-finds-rcna92046
