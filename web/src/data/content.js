// All questionnaire content lives here so the team can edit wording
// without touching components. Keep language plain and non-judgmental.
// Any statistic shown in the UI must have a source in SOURCES below.

export const SOURCES = {
  levy2018: {
    short: 'Levy et al., JAMA Network Open, 2018',
    full:
      'Levy AG, Scherer AM, Zikmund-Fisher BJ, Larkin K, Barnes GD, Fagerlin A. Prevalence of and Factors Associated With Patient Nondisclosure of Medically Relevant Information to Clinicians. JAMA Netw Open. 2018;1(7):e185293.',
    url: 'https://doi.org/10.1001/jamanetworkopen.2018.5293',
  },
}

// ---------------------------------------------------------------------------
// Step 1: questions everyone should answer
// ---------------------------------------------------------------------------
export const BASICS = [
  {
    id: 'reason',
    type: 'text',
    label: "What's the main reason for this visit?",
    placeholder: 'e.g., annual check-up, knee pain, blood pressure follow-up',
  },
  {
    id: 'duration',
    type: 'single',
    label: 'If this is a new problem, how long has it been going on?',
    options: ['Not a new problem', 'Less than a week', '1–4 weeks', '1–6 months', 'More than 6 months'],
  },
  {
    id: 'goals',
    type: 'multi',
    label: 'What would make this visit feel worth it?',
    hint: 'Pick any that apply.',
    options: [
      "Understand what's going on",
      'A prescription or refill',
      'A referral to a specialist',
      'Peace of mind',
      'A form or paperwork filled out',
      'A routine check-up',
    ],
  },
  {
    id: 'meds',
    type: 'textarea',
    label: 'What do you take regularly?',
    hint:
      'Prescriptions, over-the-counter medicines, vitamins, supplements, herbal remedies, cannabis. Everything counts.',
    placeholder: 'e.g., lisinopril 10mg daily, vitamin D, melatonin some nights',
  },
  {
    id: 'adherence',
    type: 'single',
    label: 'How has taking your medicines actually been going?',
    hint: 'People skip doses, split pills, or stop things all the time. There is no wrong answer.',
    options: [
      'I take everything as prescribed',
      'I miss doses sometimes',
      "I've changed how I take something on my own",
      'I stopped taking something',
      "I don't take any regular medicines",
    ],
  },
  {
    id: 'allergies',
    type: 'text',
    label: 'Any allergies or bad reactions to medicines?',
    placeholder: 'e.g., penicillin: hives. Leave blank if none.',
  },
  {
    id: 'questions',
    type: 'textarea',
    label: 'Questions you want answered before you leave',
    placeholder: 'One per line',
  },
]

// ---------------------------------------------------------------------------
// Step 2: topics people often don't bring up
// flag: 'crisis' | 'safety' shows a support banner immediately
// flag: 'today' marks something to raise early in the visit
// ---------------------------------------------------------------------------
export const COMFORT = [
  { id: 'self', label: "I'll bring it up", summary: 'Patient will raise this' },
  { id: 'ask', label: 'Please ask me about it', summary: 'Patient would like the clinician to ask' },
  { id: 'note', label: 'Just note it for now', summary: 'For awareness only, not for discussion today' },
]

export const TOPICS = [
  {
    id: 'understanding',
    title: "Instructions I didn't understand or don't agree with",
    short: 'Instructions & disagreements',
    blurb:
      "In a national survey of more than 4,500 adults, people most often held back when they disagreed with or didn't understand their clinician's instructions.",
    source: 'levy2018',
    details: [
      {
        id: 'didnt_understand',
        label: "I didn't fully understand instructions from a past visit",
        starter: "I wasn't sure I understood the instructions from last time. Can we go over them again?",
      },
      {
        id: 'disagree',
        label: 'I disagree with a recommendation I was given',
        starter: "I've had doubts about a recommendation from before, and I'd like to talk through my concerns.",
      },
      {
        id: 'not_following',
        label: "I haven't been following a plan we agreed on",
        starter: "I haven't been able to stick with the plan we made, and I want to be honest about why.",
      },
      {
        id: 'other_remedy',
        label: "I'm using a remedy or treatment I haven't mentioned",
        starter: "I've been using something I haven't told you about, and I want to check it's OK with my other medicines.",
      },
      {
        id: 'diet_activity',
        label: "My eating or activity isn't quite what I've said",
        starter: 'I want to give you a more accurate picture of how I actually eat and move day to day.',
      },
    ],
  },
  {
    id: 'mood',
    title: 'Mood, stress & mental health',
    short: 'Mood & mental health',
    blurb: 'Your mind is part of your health. Your clinician can help, or point you to someone who can.',
    details: [
      { id: 'down', label: 'Feeling down, empty, or hopeless', starter: "I've been feeling down or hopeless a lot lately." },
      { id: 'anxious', label: 'Worry or anxiety that is hard to switch off', starter: "I've had a lot of worry or anxiety that's hard to turn off." },
      { id: 'stress', label: 'Stress or burnout', starter: "I've been really stressed and close to burnt out." },
      { id: 'sleep', label: 'Trouble sleeping, or sleeping too much', starter: "My sleep has been off, and it's affecting my days." },
      { id: 'energy', label: 'Low energy or motivation', starter: "I've had very little energy or motivation." },
      {
        id: 'crisis',
        label: 'Thoughts of hurting myself or not wanting to be alive',
        starter: "I've been having thoughts of hurting myself or not wanting to be alive, and I need help with that.",
        flag: 'crisis',
      },
    ],
  },
  {
    id: 'substances',
    title: 'Alcohol, cannabis, nicotine & other substances',
    short: 'Substance use',
    blurb: 'Knowing what you use helps your clinician avoid risky medicine interactions.',
    details: [
      { id: 'alcohol', label: "I'm drinking more than I'd like", starter: "I've been drinking more than I'd like to." },
      { id: 'cannabis', label: 'I use cannabis (smoke, vape, or edibles)', starter: 'I use cannabis, and I want you to know for my care.' },
      { id: 'nicotine', label: 'I smoke or vape nicotine', starter: 'I smoke or vape nicotine.' },
      { id: 'other_drugs', label: 'I use other drugs', starter: "I use other drugs, and I'd rather you know than not." },
      { id: 'cut_back', label: 'I want help cutting back or quitting', starter: "I'd like help cutting back or quitting." },
      {
        id: 'interactions',
        label: "I'm worried how something mixes with my medicines",
        starter: "I'm worried about how something I use might interact with my medicines.",
      },
    ],
  },
  {
    id: 'sexual',
    title: 'Sexual & reproductive health',
    short: 'Sexual & reproductive health',
    blurb: 'Clinicians talk about this every day. It is a normal part of care.',
    details: [
      { id: 'pain', label: 'Pain or discomfort during sex', starter: "I've had pain or discomfort during sex." },
      { id: 'function', label: 'Changes in desire or function', starter: "I've noticed changes in my sex drive or function." },
      { id: 'sti', label: "I'd like STI testing", starter: "I'd like to get tested for STIs." },
      { id: 'contraception', label: 'Birth control or pregnancy questions', starter: 'I have questions about birth control or pregnancy.' },
      { id: 'cycle', label: 'Changes in periods or menopause symptoms', starter: "My periods or menopause symptoms have changed, and it's bothering me." },
    ],
  },
  {
    id: 'bladder',
    title: 'Bladder & bowel',
    short: 'Bladder & bowel',
    blurb: "It can feel awkward to describe, but your clinician can't treat what they don't hear about.",
    details: [
      { id: 'leak', label: 'Leaking urine (laughing, coughing, exercising)', starter: "I've been leaking urine, especially when I laugh, cough, or exercise." },
      { id: 'urgency', label: 'Needing to go urgently or very often', starter: "I've been needing to pee urgently or very often." },
      { id: 'bowel', label: "Constipation or diarrhea that won't go away", starter: "I've had constipation or diarrhea that won't go away." },
      { id: 'bottom', label: 'Pain, itching, or a lump near my bottom', starter: "I've had pain, itching, or a lump near my bottom." },
      {
        id: 'blood',
        label: 'Blood in my urine or stool',
        starter: "I've noticed blood in my urine or stool, and I want to make sure we talk about it today.",
        flag: 'today',
      },
    ],
  },
  {
    id: 'cost',
    title: 'Cost, insurance & getting care',
    short: 'Cost & access',
    blurb: 'If cost is getting in the way, your care team may be able to suggest other options.',
    details: [
      { id: 'afford_meds', label: 'I have trouble affording my medicines', starter: "I'm having trouble affording my medicines." },
      { id: 'skip_cost', label: 'I skip or stretch doses to save money', starter: 'I sometimes skip or stretch doses to make my medicine last longer.' },
      { id: 'visit_cost', label: "I'm worried about the cost of tests or follow-ups", starter: "I'm worried about what tests or follow-up visits will cost." },
      { id: 'transport', label: 'Getting to appointments is hard', starter: "It's hard for me to get to appointments." },
      { id: 'food', label: "Sometimes I don't have enough food", starter: "Sometimes I don't have enough food." },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & relationships',
    short: 'Safety & relationships',
    blurb: 'You can share as much or as little as you want.',
    details: [
      { id: 'unsafe', label: "I don't always feel safe at home", starter: "I don't always feel safe at home.", flag: 'safety' },
      { id: 'harmed', label: 'Someone hurts, threatens, or controls me', starter: 'Someone in my life hurts, threatens, or controls me.', flag: 'safety' },
      { id: 'lonely', label: 'I feel lonely or isolated', starter: "I've been feeling lonely or isolated." },
      { id: 'caregiver', label: "I'm caring for someone and it's wearing me down", starter: "I'm caring for someone, and it's wearing me down." },
    ],
  },
  {
    id: 'memory',
    title: 'Memory & focus',
    short: 'Memory & focus',
    blurb: 'Changes in memory or focus are worth mentioning early.',
    details: [
      { id: 'forgetting', label: "I'm forgetting things more than I used to", starter: "I've been forgetting things more than I used to." },
      { id: 'focus', label: 'Trouble concentrating', starter: "I've had trouble concentrating." },
      { id: 'noticed', label: 'Someone close to me has noticed changes', starter: 'Someone close to me has noticed changes in my memory or thinking.' },
    ],
  },
  {
    id: 'body',
    title: 'Body, weight & eating',
    short: 'Body & eating',
    blurb: "This is about how you feel, not a number. Share only what's comfortable.",
    details: [
      { id: 'weight_change', label: 'My weight changed without me trying', starter: 'My weight has changed without me trying to change it.' },
      { id: 'food_relationship', label: 'My relationship with food feels hard', starter: 'My relationship with food has been hard lately.' },
      { id: 'body_image', label: 'I struggle with how I feel about my body', starter: "I've been struggling with how I feel about my body." },
    ],
  },
  {
    id: 'small',
    title: 'The "too small to mention" list',
    short: 'Small but bothering me',
    blurb: "If it bothers you, it's worth a sentence.",
    details: [
      { id: 'skin', label: "A spot, rash, or mole that's bugging me", starter: "There's a spot, rash, or mole I'd like you to look at." },
      { id: 'hair', label: 'Hair loss or unusual hair growth', starter: "I've noticed hair loss or unusual hair growth." },
      { id: 'sweat', label: 'Sweating or body odor', starter: "I've been bothered by sweating or body odor." },
      { id: 'hearing', label: 'Trouble hearing or ringing in my ears', starter: "I've had trouble hearing or ringing in my ears." },
      { id: 'snoring', label: 'Snoring or waking up gasping', starter: "I've been told I snore, or I wake up gasping." },
    ],
  },
]

export const SUPPORT = {
  crisis: {
    title: 'You deserve support right now, not just at your appointment.',
    lines: [
      'In the U.S., call or text 988 (Suicide & Crisis Lifeline), any time, day or night.',
      'If you are in immediate danger, call 911.',
    ],
    link: { href: 'https://988lifeline.org', label: '988lifeline.org' },
  },
  safety: {
    title: 'Your safety matters.',
    lines: [
      'If you are in danger right now, call 911.',
      'The National Domestic Violence Hotline is free and confidential: 1-800-799-7233.',
      'Need to leave this page fast? Use the Quick exit button at the top.',
    ],
    link: { href: 'https://www.thehotline.org', label: 'thehotline.org' },
  },
}

// ---------------------------------------------------------------------------
// One-click demo data for judges
// ---------------------------------------------------------------------------
export const SAMPLE_STATE = {
  basics: {
    reason: 'Annual check-up',
    duration: 'Not a new problem',
    goals: ['A routine check-up', 'A prescription or refill'],
    meds: 'Lisinopril 10mg daily\nVitamin D\nMelatonin some nights',
    adherence: 'I miss doses sometimes',
    allergies: 'Penicillin: hives',
    questions: 'Do I need any vaccines this year?\nIs my blood pressure medicine still the right dose?',
  },
  topics: {
    understanding: { details: ['didnt_understand'], comfort: 'self', note: '' },
    mood: { details: ['stress', 'sleep'], comfort: 'ask', note: 'Work has been a lot since the summer.' },
    cost: { details: ['skip_cost'], comfort: 'self', note: '' },
    bladder: { details: ['leak'], comfort: 'note', note: '' },
    small: { details: ['snoring'], comfort: 'self', note: 'My partner mentioned it.' },
  },
  priorities: ['cost', 'mood', 'understanding'],
}
