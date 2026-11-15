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

## Additions (Nov 15, ~12:55 PM)

These build on the leading idea above. They came out of two concerns: the idea needed more depth and a stronger biotech core, and people are not always honest when answering questions about themselves.

### Design shift: lean on lab numbers, not only on what people say

- Self-reported symptoms can be forgotten, downplayed, or left out. Blood test numbers do not depend on honesty.
- Most people have had a routine blood count but never an iron (ferritin) test. The tool uses the blood count already on file to flag who probably has low iron and should be tested.
- If a ferritin result exists, the tool re-reads it against the 2026 cutoffs.
- The chat stays, but the tool must still work when the chat is skipped.
- Pitch line: "Symptoms get missed because patients forget, downplay, or are not asked. So we also use the blood test they have already had."

### Biotech layers (all software, no hardware)

**Layer 1: prediction model on public blood data**

- Estimates the chance that a person's iron stores are low.
- Data: US national health survey (NHANES), 2017 to March 2020. This is the cycle to use because ferritin was measured in everyone aged 12 and up, both sexes. Earlier cycles tested only women 12 to 49 and young children.
- Target: ferritin below 30 = low.
- Inputs: age, sex, period status, hemoglobin, red blood cell size.
- Method: logistic regression, 80/20 train/test split, report accuracy on the held-back 20%.
- Deploy: copy the fitted coefficients into the page as a formula, so no server is needed.
- Limit: the survey asks whether periods are regular, not how heavy they are. The model cannot learn from the heavy-period questions, so those questions only decide which guideline cutoff applies.

**Layer 2: iron panel reader**

- Applies the guideline rules across several lab values at once:
  - Ferritin 30 or lower: low iron stores.
  - Ferritin 50 or lower with heavy periods reported: low for a high-risk patient.
  - Inflammation present: cutoff becomes ferritin 100 or lower, or transferrin saturation under 20%.
- Why: illness pushes ferritin up and can hide a deficiency that a single cutoff would miss.

**Layer 3: hepcidin research note (doctor's page only)**

- A short "what the research says" box about hepcidin, the hormone that controls iron absorption, and what it implies for how iron is taken.
- NOT VERIFIED. Written from memory and touches treatment. Needs a real citation before it appears anywhere, or it gets cut.

### Add-ons for uniqueness and nuance

| # | Add-on | What it does | Plan |
| --- | --- | --- | --- |
| 1 | Mismatch detector | Flags when what the patient says and what the lab pattern suggests disagree (for example "I feel fine" with a 70% model estimate) | Build. Signature feature |
| 2 | Personal trend | With two or more past results, shows the direction against the person's own baseline (hemoglobin 14.0 to 12.2 is "normal" twice but still a decline) | Roadmap, or build if time |
| 3 | Show the disagreement | Displays where the patient falls under each cutoff (15, 30, 50), who recommends each, and that the new ones are conditional | Build |
| 4 | Fairness check | Reports model accuracy separately by sex and by racial and ethnic group | Build if the model is done by mid-afternoon |
| 5 | Life-stage paths | Adjusts for teen, pregnant, recently gave birth, past menopause | Roadmap only |

Pitch line for add-on 1: "We do not ask whether to believe the patient or the lab. We show the doctor where they disagree."

### How the pieces connect

| Step | What happens | Part |
| --- | --- | --- |
| 1 | Patient completes the chat (optional) | Chat |
| 2 | Model estimates the chance of low iron from the blood count | Layer 1 |
| 3 | If iron labs exist, the panel reader applies the guideline | Layer 2 |
| 4 | Mismatch detector compares steps 1 and 2 | Add-on 1 |
| 5 | Doctor sees symptoms, estimate, panel result under each cutoff, and any mismatch | Doctor's page |

### Suggested split of work

- Person 1: the model (data download, fit, test, fairness check).
- Person 2: chat questions, panel rules, mismatch logic.
- Person 3: the page, doctor's view, and hosting.

### Limits to state in the pitch

- The model is trained on survey data and has not been tested in a clinic.
- It suggests who to test. It does not diagnose.
- The survey needs weighting to represent the US population; an unweighted hackathon model is acceptable if we say so.

### More to verify

- [ ] Open the NHANES blood count and inflammation (CRP) files and confirm they exist for 2017 to March 2020. Ferritin, iron, and the women's questionnaire are confirmed.
- [ ] Find a citation for the hepcidin note, or cut it.
- [ ] Team scope: `AGENTS.md` says the project is "not medical-based" (decision logged 10:21 AM). This idea is medical. Resolve as a team.

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
- NHANES 2017-2018 ferritin documentation: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/FERTIN_J.htm
- NHANES 2017-March 2020 ferritin documentation: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/P_FERTIN.htm
- NHANES 2017-2018 iron status documentation: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/FETIB_J.htm
- NHANES 2017-2018 reproductive health questionnaire: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/RHQ_J.htm
