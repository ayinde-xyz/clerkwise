import { Document } from "@langchain/core/documents";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MedicalCategory =
  | "internal_medicine"
  | "surgery"
  | "obstetrics_gynecology"
  | "pediatrics";

type SectionType =
  | "history_taking_framework"
  | "common_presentations"
  | "differential_diagnosis_guide"
  | "clerking_template"
  | "red_flags";

// ---------------------------------------------------------------------------
// Internal Medicine Documents
// ---------------------------------------------------------------------------

const internalMedicineDocs: Document[] = [
  new Document({
    pageContent: `INTERNAL MEDICINE — HISTORY-TAKING FRAMEWORK

Use the SOCRATES mnemonic for any pain-related presentation:
- Site: Where exactly is the pain? Can you point to it?
- Onset: When did it start? Was it sudden or gradual?
- Character: What does the pain feel like? (sharp, dull, burning, crushing, colicky)
- Radiation: Does the pain move anywhere else?
- Associated symptoms: What other symptoms do you have? (nausea, vomiting, sweating, dyspnea)
- Timing: Is the pain constant or intermittent? How long does each episode last?
- Exacerbating/relieving factors: What makes it better or worse? (movement, rest, food, medication)
- Severity: On a scale of 1-10, how severe is the pain?

Systems Review Approach — systematically enquire about:
- Cardiovascular: chest pain, palpitations, dyspnea on exertion, orthopnea, PND, ankle swelling, syncope
- Respiratory: cough, sputum, hemoptysis, wheeze, dyspnea, pleuritic pain
- Gastrointestinal: appetite, weight change, dysphagia, nausea/vomiting, abdominal pain, bowel habit, PR bleeding, jaundice
- Genitourinary: frequency, urgency, dysuria, hematuria, nocturia, incontinence
- Neurological: headache, visual disturbance, weakness, numbness, speech difficulty, seizures
- Musculoskeletal: joint pain/swelling, stiffness, limitation of movement
- Endocrine: polyuria, polydipsia, heat/cold intolerance, weight change, tremor
- Constitutional: fever, night sweats, fatigue, weight loss`,
    metadata: {
      category: "internal_medicine" as MedicalCategory,
      section: "history_taking_framework" as SectionType,
    },
  }),

  new Document({
    pageContent: `INTERNAL MEDICINE — COMMON PRESENTATIONS

1. Chest Pain: Cardiac (ACS, stable angina, pericarditis), pulmonary (PE, pneumothorax, pleurisy), musculoskeletal (costochondritis), GI (GERD, esophageal spasm), or aortic (dissection). Always assess cardiovascular risk factors: hypertension, diabetes, smoking, hyperlipidemia, family history of IHD.

2. Dyspnea: Acute causes include PE, pneumothorax, asthma exacerbation, acute heart failure, and anaphylaxis. Chronic causes include COPD, heart failure, interstitial lung disease, anemia, and obesity. Assess using MRC dyspnea scale.

3. Fever of Unknown Origin: Temperature >38.3C on multiple occasions over >3 weeks without diagnosis after 1 week of investigation. Categories: infectious (TB, endocarditis, abscess), autoimmune (SLE, adult-onset Still disease, vasculitis), malignant (lymphoma, renal cell carcinoma), and miscellaneous (drug fever, DVT, factitious).

4. Syncope: Vasovagal (most common), cardiac (arrhythmia, structural), orthostatic hypotension, neurological (seizure mimicking syncope). Key history: prodromal symptoms, position at onset, duration of LOC, post-event confusion, witnessed movements, tongue biting, incontinence.

5. Peripheral Edema: Heart failure (bilateral, pitting, worse in evening), liver disease (ascites, hypoalbuminemia), nephrotic syndrome (periorbital puffiness, proteinuria), DVT (unilateral, painful), lymphedema (non-pitting), medications (CCBs, NSAIDs).

6. Jaundice: Pre-hepatic (hemolysis — unconjugated), hepatic (hepatitis, cirrhosis — mixed), post-hepatic (gallstones, pancreatic head tumor — conjugated, pale stools, dark urine, pruritus). Ask about alcohol, medications, travel, blood transfusions, IV drug use.

7. Unintentional Weight Loss: Consider malignancy, hyperthyroidism, diabetes mellitus, chronic infection (TB, HIV), malabsorption (celiac, IBD), depression, and eating disorders. Significant if >5% body weight over 6-12 months.

8. Fatigue: Anemia, hypothyroidism, diabetes, depression, chronic fatigue syndrome, OSA, heart failure, chronic kidney disease, malignancy, medication side effects. Assess sleep quality, mood, functional impact.

9. Headache: Primary (migraine, tension-type, cluster) vs secondary (SAH, meningitis, raised ICP, temporal arteritis, medication overuse). Red flags: thunderclap onset, new onset >50 years, fever/neck stiffness, papilledema, focal neurology.

10. Palpitations: Sinus tachycardia (anxiety, thyrotoxicosis, anemia), atrial fibrillation, SVT, ventricular ectopics, panic disorder. Assess onset/offset, regularity, associated symptoms, triggers (caffeine, alcohol, exercise).`,
    metadata: {
      category: "internal_medicine" as MedicalCategory,
      section: "common_presentations" as SectionType,
    },
  }),

  new Document({
    pageContent: `INTERNAL MEDICINE — DIFFERENTIAL DIAGNOSIS GUIDE

CHEST PAIN DIFFERENTIALS:
- Cardiac: Acute coronary syndrome (STEMI/NSTEMI/unstable angina) — central crushing chest pain, radiating to jaw/left arm, associated with sweating, nausea, dyspnea. Pericarditis — sharp, pleuritic, worse lying flat, relieved by sitting forward, preceded by viral illness.
- Pulmonary: Pulmonary embolism — sudden pleuritic pain, dyspnea, hemoptysis, risk factors (immobility, surgery, OCP, malignancy). Pneumothorax — sudden unilateral pleuritic pain, dyspnea, tall thin young male or underlying lung disease.
- GI: GERD — burning retrosternal pain, worse postprandially and lying flat, relieved by antacids. Esophageal spasm — may mimic cardiac pain, associated with dysphagia.
- Aortic dissection — sudden-onset severe tearing pain radiating to the back, blood pressure discrepancy between arms, aortic regurgitation murmur.

FEVER DIFFERENTIALS BY PATTERN:
- Continuous fever: typhoid, pneumonia, drug fever
- Remittent fever: infective endocarditis, abscess
- Intermittent fever: malaria, lymphoma (Pel-Ebstein), pyogenic abscess
- Low-grade persistent: TB, SLE, malignancy, HIV

DYSPNEA DIFFERENTIALS:
- Acute onset: PE, pneumothorax, acute asthma, anaphylaxis, foreign body
- Subacute: pneumonia, heart failure exacerbation, pleural effusion
- Chronic progressive: COPD, heart failure, interstitial lung disease, anemia, pulmonary hypertension

EDEMA DIFFERENTIALS:
- Bilateral: heart failure, nephrotic syndrome, liver cirrhosis, venous insufficiency, medications
- Unilateral: DVT, cellulitis, lymphedema, Baker cyst rupture, compartment syndrome`,
    metadata: {
      category: "internal_medicine" as MedicalCategory,
      section: "differential_diagnosis_guide" as SectionType,
    },
  }),

  new Document({
    pageContent: `INTERNAL MEDICINE — CLERKING TEMPLATE

HPC (History of Presenting Complaint):
Use SOCRATES for pain. For each symptom document onset, duration, character, severity, progression, aggravating/relieving factors, and associated symptoms. Establish chronological timeline of events. Note any previous episodes and how they were managed. Document what prompted presentation now.

Family History (FHx):
First-degree relatives health: parents (alive/deceased, age, cause of death), siblings. Ask specifically about conditions relevant to the presenting complaint — for cardiac presentations ask about IHD, hypertension, diabetes, hyperlipidemia, sudden cardiac death. For autoimmune conditions ask about family history of autoimmune disease. Note any hereditary conditions (e.g., familial hypercholesterolemia, polycystic kidney disease, hemoglobinopathies).

Social History (SHx):
Smoking: current/ex/never, pack-years (packs per day x years). Alcohol: units per week (beer, wine, spirits), CAGE questionnaire if excess suspected. Recreational drugs: type, route, frequency. Occupation: current job, occupational exposures (asbestos, dust, chemicals). Home circumstances: who lives at home, housing type, stairs, care needs. Functional status: ADLs (washing, dressing, cooking, shopping), mobility aids. Travel: recent travel, endemic disease exposure. Sexual history: if relevant to presentation.

Drug History (DHx):
Current regular medications with doses. PRN medications. Recent changes to medications. OTC medications and supplements. Allergies: drug name, nature of reaction (true allergy vs intolerance). Compliance/adherence. Previous adverse drug reactions.

Past Medical History (PMH):
Use MJ THREADS mnemonic: MI, Jaundice, TB, Hypertension, Rheumatic fever, Epilepsy, Asthma/COPD, Diabetes, Stroke. Previous surgeries with dates. Previous hospitalizations. Childhood illnesses. Immunization status. Screening history (cancer screening, cardiovascular risk assessment).`,
    metadata: {
      category: "internal_medicine" as MedicalCategory,
      section: "clerking_template" as SectionType,
    },
  }),

  new Document({
    pageContent: `INTERNAL MEDICINE — RED FLAGS

CHEST PAIN RED FLAGS:
- Crushing central chest pain with radiation to jaw/arm — suspect ACS, ECG and troponin urgently
- Sudden tearing pain radiating to back — suspect aortic dissection, urgent CT aortogram
- Pleuritic pain with hemoptysis and tachycardia — suspect PE, CTPA urgently
- Chest pain with hemodynamic instability — immediate resuscitation

HEADACHE RED FLAGS:
- Thunderclap headache (worst headache of life, maximal at onset) — suspect SAH, urgent CT head then LP
- New headache >50 years with scalp tenderness, jaw claudication — suspect temporal arteritis, urgent ESR/CRP, start steroids
- Headache with papilledema, focal neurology, altered consciousness — suspect raised ICP, urgent imaging
- Headache with fever, neck stiffness, photophobia — suspect meningitis, blood cultures, LP, empirical antibiotics

FEVER RED FLAGS:
- Fever with petechial/purpuric rash — suspect meningococcal sepsis, immediate IV antibiotics
- Fever with new heart murmur — suspect infective endocarditis, blood cultures x3
- Fever with rigors in immunocompromised patient — suspect neutropenic sepsis, immediate broad-spectrum antibiotics
- Persistent unexplained fever with weight loss, night sweats — suspect lymphoma or TB

SYNCOPE RED FLAGS:
- Syncope during exertion — suspect cardiac outflow obstruction (aortic stenosis, HOCM)
- Syncope preceded by palpitations — suspect arrhythmia
- Family history of sudden cardiac death — suspect inherited cardiac condition (long QT, Brugada, HOCM)
- Syncope with chest pain — suspect ACS or PE`,
    metadata: {
      category: "internal_medicine" as MedicalCategory,
      section: "red_flags" as SectionType,
    },
  }),
];

// ---------------------------------------------------------------------------
// Surgery Documents
// ---------------------------------------------------------------------------

const surgeryDocs: Document[] = [
  new Document({
    pageContent: `SURGERY — HISTORY-TAKING FRAMEWORK

Acute Abdomen Assessment:
Pain assessment using SOCRATES is essential. Additionally establish:
- Onset: Sudden (perforation, ruptured AAA, torsion) vs gradual (appendicitis, cholecystitis, obstruction)
- Character: Colicky (obstruction, renal colic, biliary colic) vs constant (peritonitis, pancreatitis)
- Site and radiation: Epigastric (gastric/duodenal ulcer, pancreatitis), RUQ (biliary), RIF (appendicitis, ovarian), LIF (diverticulitis, ovarian), loin-to-groin (renal colic)
- Associated GI symptoms: nausea, vomiting (bilious vs feculent), anorexia, bowel habit change, PR bleeding/mucus, distension
- Peritonism: pain worse with movement/coughing, lying still, guarding
- Systemic: fever, tachycardia, hypotension (suggesting sepsis or hemorrhage)

Surgical Sieve for Lumps:
- Site, size, shape, surface, edge, consistency, temperature, tenderness, tethering, transillumination, pulsatility, fluctuance, compressibility, reducibility
- Duration, changes over time, associated symptoms

Trauma Assessment (ATLS):
- Primary survey: ABCDE (Airway with C-spine, Breathing, Circulation, Disability, Exposure)
- AMPLE history: Allergies, Medications, Past medical history, Last meal, Events leading to injury
- Secondary survey: Head-to-toe examination after stabilization
- Mechanism of injury: blunt vs penetrating, speed, height of fall, seat belt use`,
    metadata: {
      category: "surgery" as MedicalCategory,
      section: "history_taking_framework" as SectionType,
    },
  }),

  new Document({
    pageContent: `SURGERY — COMMON PRESENTATIONS

1. Acute Appendicitis: Central abdominal pain migrating to RIF over 12-24 hours, anorexia, nausea, vomiting, low-grade fever. McBurney point tenderness, Rovsing sign, psoas sign. Differential includes mesenteric adenitis, Meckel diverticulitis, ovarian pathology in females, Crohn disease.

2. Acute Cholecystitis: RUQ pain radiating to right shoulder tip, worse after fatty meals, fever, Murphy sign positive. May follow history of biliary colic. Ultrasound confirms gallbladder wall thickening and stones. Complications include empyema, perforation, Mirizzi syndrome.

3. Bowel Obstruction: Colicky central abdominal pain, vomiting (early in high obstruction, late/feculent in low), absolute constipation (flatus and feces), abdominal distension. Causes: adhesions (most common in developed world), hernias, malignancy, volvulus. AXR shows dilated loops with air-fluid levels.

4. Inguinal Hernia: Groin swelling, worse on standing/coughing/straining, may reduce on lying down. Direct (medial to inferior epigastric artery, older patients) vs indirect (lateral, younger patients, through deep ring). Risk of incarceration and strangulation.

5. Breast Lump: Age-dependent differentials — fibroadenoma (young, mobile, non-tender), breast cyst (perimenopausal, smooth, fluctuant), breast cancer (hard, irregular, tethered, skin/nipple changes, axillary lymphadenopathy). Triple assessment: clinical, imaging (mammography/USS), histology (core biopsy/FNA).

6. Upper GI Bleeding: Hematemesis (fresh blood or coffee-ground) and/or melena. Causes: peptic ulcer (most common), variceal (cirrhosis), Mallory-Weiss tear, malignancy, erosive gastritis. Assess hemodynamic stability, Glasgow-Blatchford score for risk stratification.

7. Lower GI Bleeding: Fresh PR bleeding or maroon stools. Causes by age: young (hemorrhoids, IBD, Meckel diverticulum), elderly (diverticular disease, angiodysplasia, colorectal cancer). Assess volume, color, associated symptoms (pain, weight loss, change in bowel habit).

8. Acute Pancreatitis: Severe epigastric pain radiating to back, worse on eating, relieved by sitting forward, nausea, vomiting. Causes: GET SMASHED (Gallstones, Ethanol, Trauma, Steroids, Mumps, Autoimmune, Scorpion sting, Hyperlipidemia/Hypercalcemia/Hypothermia, ERCP, Drugs). Raised serum amylase/lipase.`,
    metadata: {
      category: "surgery" as MedicalCategory,
      section: "common_presentations" as SectionType,
    },
  }),

  new Document({
    pageContent: `SURGERY — DIFFERENTIAL DIAGNOSIS GUIDE

RIGHT ILIAC FOSSA (RIF) PAIN:
- Acute appendicitis — migrating pain, anorexia, low-grade fever, RIF tenderness
- Mesenteric adenitis — children/young adults, preceded by URTI, mimics appendicitis
- Meckel diverticulitis — presents like appendicitis, rule of 2s (2% prevalence, 2 feet from ileocecal valve, 2 inches long, 2 types of ectopic tissue)
- Crohn disease (terminal ileitis) — chronic/relapsing, diarrhea, weight loss, mouth ulcers
- Ovarian pathology (females) — ruptured ovarian cyst, ovarian torsion, ectopic pregnancy
- Psoas abscess — flexion deformity of hip, swinging fever
- Ureteric colic — loin-to-groin pain, hematuria, restless patient

LEFT ILIAC FOSSA (LIF) PAIN:
- Acute diverticulitis — left-sided appendicitis, fever, raised inflammatory markers
- Sigmoid volvulus — elderly/institutionalized, massive distension, coffee-bean sign on AXR
- Colorectal malignancy — change in bowel habit, weight loss, rectal bleeding, iron deficiency anemia
- Ovarian pathology (females) — as above for RIF
- Constipation — common, palpable loaded colon

UPPER GI BLEEDING vs LOWER GI BLEEDING:
- Upper (proximal to ligament of Treitz): hematemesis, coffee-ground vomit, melena. Peptic ulcer, varices, Mallory-Weiss.
- Lower: fresh PR blood, maroon stool. Diverticular disease, colorectal cancer, angiodysplasia, hemorrhoids, IBD.
- Massive upper GI bleed can present with fresh PR bleeding due to rapid transit.`,
    metadata: {
      category: "surgery" as MedicalCategory,
      section: "differential_diagnosis_guide" as SectionType,
    },
  }),

  new Document({
    pageContent: `SURGERY — CLERKING TEMPLATE

HPC for Surgical Presentations:
Use SOCRATES for pain. For lumps: site, size, duration, growth pattern, pain, skin changes, discharge. For GI presentations: appetite, weight change, dysphagia, nausea/vomiting (character: bilious, feculent, bloody), bowel habit (constipation, diarrhea, alternating, tenesmus), PR bleeding (fresh, mixed, on paper, in toilet), abdominal distension, jaundice. For trauma: mechanism, time of injury, symptoms since, treatment given.

Family History for Surgery:
Relevant familial conditions: FAP/HNPCC (colorectal cancer), BRCA1/2 (breast/ovarian cancer), MEN syndromes, familial hypercalcemia, hereditary pancreatitis, AAA screening in first-degree relatives. Family history of anesthetic complications (malignant hyperthermia, pseudocholinesterase deficiency).

Social History for Surgery:
Smoking: wound healing impairment, increased post-operative complications, respiratory risk. Alcohol: liver disease impact on coagulation, withdrawal risk post-operatively, nutritional deficiency. Occupation: impact of surgery on work, manual labor considerations. Home setup: stairs, support available for post-op recovery, who will care for the patient. Exercise tolerance: baseline functional capacity for anesthetic risk assessment (can they climb two flights of stairs?).

Drug History for Surgery:
Anticoagulants/antiplatelets: warfarin, DOACs, aspirin, clopidogrel — need perioperative management plan. Steroids: may need perioperative stress dose. Metformin: withhold on day of surgery. Insulin: perioperative sliding scale. Immunosuppressants: infection and healing risk. OCP/HRT: VTE risk consideration. Herbal remedies: some affect coagulation (garlic, ginkgo, ginseng).

PMH for Surgery:
Previous surgeries: type, date, complications (wound infection, DVT/PE, adhesions). Anesthetic history: any adverse reactions, difficult intubation. Medical comorbidities affecting surgical risk: cardiac disease, respiratory disease, diabetes, renal impairment, liver disease, bleeding disorders. ASA grade assessment for anesthetic risk.`,
    metadata: {
      category: "surgery" as MedicalCategory,
      section: "clerking_template" as SectionType,
    },
  }),

  new Document({
    pageContent: `SURGERY — RED FLAGS

ACUTE ABDOMEN RED FLAGS:
- Rigid, board-like abdomen with absent bowel sounds — suspect perforation/peritonitis, urgent surgical review
- Abdominal pain with hemodynamic instability — suspect ruptured AAA, ectopic pregnancy, splenic rupture — immediate resuscitation and surgical intervention
- Irreducible, tender hernia with vomiting — suspect strangulation, urgent surgery
- Absolute constipation with distension and vomiting — suspect bowel obstruction, NG tube and urgent imaging

GI BLEEDING RED FLAGS:
- Massive hematemesis with hemodynamic instability — suspect variceal bleed, emergency endoscopy, activate major hemorrhage protocol
- Melaena with syncope — suspect significant upper GI bleed, urgent resuscitation and endoscopy within 24 hours
- PR bleeding with weight loss and change in bowel habit >50 years — suspect colorectal malignancy, urgent 2-week wait referral

POST-OPERATIVE RED FLAGS:
- Fever >38.5C in first 24 hours — suspect atelectasis or pre-existing infection, but consider necrotizing fasciitis if wound involved
- Increasing wound pain with crepitus — suspect gas gangrene/necrotizing fasciitis, urgent surgical debridement
- Sudden-onset breathlessness post-operatively — suspect PE, DVT prophylaxis assessment, CTPA
- Absent urine output >6 hours post-operatively — suspect urinary retention (catheterize) or hypovolemia (fluid challenge)`,
    metadata: {
      category: "surgery" as MedicalCategory,
      section: "red_flags" as SectionType,
    },
  }),
];

// ---------------------------------------------------------------------------
// Obstetrics & Gynecology Documents
// ---------------------------------------------------------------------------

const obgynDocs: Document[] = [
  new Document({
    pageContent: `OBSTETRICS & GYNECOLOGY — HISTORY-TAKING FRAMEWORK

Obstetric History:
- Gravidity and Parity: G_P_ (e.g., G3P2 = 3 pregnancies, 2 deliveries at or beyond 24 weeks). Document each pregnancy: gestation at delivery, mode of delivery (SVD, instrumental, cesarean section + indication), birth weight, complications (pre-eclampsia, GDM, PPH, shoulder dystocia), neonatal outcome.
- Current Pregnancy: LMP (last menstrual period), EDD (estimated date of delivery), dating scan, booking bloods, anomaly scan findings, gestational age at presentation.
- Antenatal History: booking BMI, blood group and antibodies, infection screen (HIV, hepatitis B, syphilis, rubella immunity), nuchal translucency/combined screening, anomaly scan, growth scans if indicated, GTT if risk factors for GDM.

Gynecological History:
- Menstrual history: age of menarche, cycle length and regularity, duration and heaviness of periods (number of pads/tampons per day, flooding, clots), intermenstrual bleeding, postcoital bleeding, postmenopausal bleeding, dysmenorrhea.
- Contraceptive history: current and past methods, duration, reason for stopping.
- Cervical screening: date of last smear, any abnormal results, colposcopy/treatment history.
- Sexual history: current partner, dyspareunia (superficial vs deep), STI screening, fertility concerns.`,
    metadata: {
      category: "obstetrics_gynecology" as MedicalCategory,
      section: "history_taking_framework" as SectionType,
    },
  }),

  new Document({
    pageContent: `OBSTETRICS & GYNECOLOGY — COMMON PRESENTATIONS

1. Vaginal Bleeding in Early Pregnancy: Threatened miscarriage (viable pregnancy, cervical os closed), inevitable miscarriage (os open), incomplete miscarriage (retained products), ectopic pregnancy (pain, bleeding, risk factors — PID, previous ectopic, IUD, tubal surgery), molar pregnancy (very high bhCG, snowstorm appearance on USS).

2. Antepartum Hemorrhage: Placenta previa (painless bright red PV bleeding, low-lying placenta on USS, avoid vaginal examination), placental abruption (painful, tender woody uterus, concealed or revealed bleeding, fetal distress, associated with hypertension/pre-eclampsia), vasa previa (painless bleeding at membrane rupture, fetal bradycardia).

3. Pre-eclampsia: New-onset hypertension (>140/90) after 20 weeks with proteinuria or end-organ dysfunction. Symptoms: headache, visual disturbance, epigastric/RUQ pain, sudden edema. Complications: eclampsia (seizures), HELLP syndrome, placental abruption, renal failure.

4. Pelvic Pain: Acute — ectopic pregnancy, ovarian torsion, ruptured ovarian cyst, PID, appendicitis. Chronic — endometriosis, adenomyosis, chronic PID, adhesions, irritable bowel syndrome, interstitial cystitis.

5. Abnormal Uterine Bleeding: Structural causes (PALM — Polyp, Adenomyosis, Leiomyoma, Malignancy/hyperplasia). Non-structural causes (COEIN — Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic, Not yet classified).

6. Postmenopausal Bleeding: Always investigate to exclude endometrial cancer. Causes: atrophic vaginitis (most common), endometrial polyp, endometrial hyperplasia, endometrial cancer, cervical pathology, HRT-related. Investigation: transvaginal USS (endometrial thickness), hysteroscopy and biopsy.

7. Ovarian Masses: Functional cysts (follicular, corpus luteum — usually resolve spontaneously), benign tumors (dermoid/teratoma, serous cystadenoma, mucinous cystadenoma), malignant (serous carcinoma most common — postmenopausal, elevated CA-125, ascites, solid components on imaging).`,
    metadata: {
      category: "obstetrics_gynecology" as MedicalCategory,
      section: "common_presentations" as SectionType,
    },
  }),

  new Document({
    pageContent: `OBSTETRICS & GYNECOLOGY — DIFFERENTIAL DIAGNOSIS GUIDE

CAUSES OF ANTEPARTUM HEMORRHAGE:
- Placenta previa: painless, recurrent, bright red blood, abnormal lie, soft non-tender uterus, placenta covering/near os on USS
- Placental abruption: painful, constant abdominal pain, tender woody uterus, may be concealed (no visible bleeding), associated with pre-eclampsia/hypertension, cocaine use, trauma
- Vasa previa: painless bleeding at rupture of membranes, fetal vessels crossing os, fetal heart rate abnormalities
- Local causes: cervical ectropion, cervical polyp, cervical carcinoma, vaginal infection/trauma

CAUSES OF PELVIC PAIN:
- Gynecological: ectopic pregnancy (positive pregnancy test, adnexal tenderness, risk factors), ovarian torsion (sudden severe unilateral pain, nausea, vomiting), ruptured ovarian cyst (sudden pain, may be mid-cycle), PID (bilateral pain, fever, discharge, cervical motion tenderness), endometriosis (cyclical pain, dysmenorrhea, dyspareunia, dyschezia)
- Non-gynecological: appendicitis, UTI, renal colic, IBD, musculoskeletal

CAUSES OF AMENORRHEA:
- Primary (no menarche by 15 years): Turner syndrome (45,X), Mullerian agenesis, imperforate hymen, constitutional delay, hypothalamic/pituitary causes
- Secondary (absence of periods for >3 months): pregnancy (most common — always exclude first), PCOS, hypothalamic amenorrhea (stress, weight loss, exercise), hyperprolactinemia, premature ovarian insufficiency, thyroid dysfunction, Asherman syndrome`,
    metadata: {
      category: "obstetrics_gynecology" as MedicalCategory,
      section: "differential_diagnosis_guide" as SectionType,
    },
  }),

  new Document({
    pageContent: `OBSTETRICS & GYNECOLOGY — CLERKING TEMPLATE

HPC for O&G Presentations:
For bleeding: amount (number of pads, soaking through, clots, flooding), color, duration, relationship to LMP, associated pain, pregnancy status. For pain: SOCRATES plus relationship to menstrual cycle, associated GI/urinary symptoms. For pregnancy: gestation, fetal movements, contractions, PV loss (blood, liquor, discharge).

Family History for O&G:
Obstetric complications in mother/sisters (pre-eclampsia, GDM, preterm birth, stillbirth). Family history of breast/ovarian cancer (BRCA), endometrial cancer (Lynch syndrome), VTE (thrombophilia), autoimmune conditions, chromosomal abnormalities, consanguinity.

Social History for O&G:
Relationship status and support, domestic violence screening (ask routinely in pregnancy), occupation and maternity plans, smoking (associated with IUGR, placental abruption, preterm birth), alcohol (fetal alcohol spectrum disorder), recreational drugs (cocaine — placental abruption, opiates — NAS), FGM status, housing and social support for postnatal period.

Drug History for O&G:
Folic acid (pre-conception and first trimester), current medications and teratogenicity assessment, pregnancy-safe alternatives needed, immunosuppressants, antiepileptics (teratogenic risk — valproate contraindicated in pregnancy), anticoagulants (switch warfarin to LMWH in pregnancy), contraceptive history.

PMH for O&G:
Previous gynecological conditions, cervical screening history, previous pregnancies in detail (as per obstetric history framework), previous pelvic surgery, history of VTE (thromboprophylaxis planning), mental health history (perinatal mental health risk assessment), medical comorbidities (diabetes, hypertension, thyroid, epilepsy, renal disease — all impact pregnancy management).`,
    metadata: {
      category: "obstetrics_gynecology" as MedicalCategory,
      section: "clerking_template" as SectionType,
    },
  }),

  new Document({
    pageContent: `OBSTETRICS & GYNECOLOGY — RED FLAGS

OBSTETRIC RED FLAGS:
- Severe headache with visual disturbance and epigastric pain in pregnancy — suspect pre-eclampsia/HELLP, urgent assessment: BP, urine protein, bloods (FBC, LFTs, renal function)
- Painful vaginal bleeding with woody uterus — suspect placental abruption, emergency delivery may be needed
- Sudden cessation of fetal movements — urgent CTG and USS, may indicate fetal compromise
- Eclamptic seizures — IV magnesium sulfate, deliver after stabilization
- Cord prolapse — all fours position, fill bladder, emergency cesarean section
- Postpartum hemorrhage (>500ml SVD, >1000ml CS) — bimanual compression, uterotonics, major hemorrhage protocol

GYNECOLOGICAL RED FLAGS:
- Positive pregnancy test with unilateral pelvic pain and PV bleeding — suspect ectopic pregnancy until proven otherwise, urgent transvaginal USS and serum bhCG
- Sudden severe unilateral pelvic pain with nausea — suspect ovarian torsion, urgent USS with Doppler, emergency surgical intervention
- Postmenopausal bleeding — always investigate to exclude endometrial cancer, urgent transvaginal USS
- Irregular heavy bleeding with intermenstrual/postcoital bleeding >40 years — suspect endometrial pathology, hysteroscopy and biopsy
- Pelvic mass with ascites, weight loss — suspect ovarian malignancy, urgent CA-125 and imaging, 2-week wait referral`,
    metadata: {
      category: "obstetrics_gynecology" as MedicalCategory,
      section: "red_flags" as SectionType,
    },
  }),
];

// ---------------------------------------------------------------------------
// Pediatrics Documents
// ---------------------------------------------------------------------------

const pediatricsDocs: Document[] = [
  new Document({
    pageContent: `PEDIATRICS — HISTORY-TAKING FRAMEWORK

Age-Adapted History Taking:
- Neonates (0-28 days): Birth history is critical — gestation, mode of delivery, birth weight, Apgar scores, NICU admission, neonatal problems (jaundice, sepsis, respiratory distress). Feeding (breast/formula, volumes, frequency), weight gain, stool/urine output, umbilical cord status.
- Infants (1-12 months): Feeding and growth, developmental milestones (social smile 6w, head control 3-4m, sitting 6m, pincer grip 9m), immunization history, sleep patterns, parental concerns.
- Toddlers/Pre-school (1-5 years): Walking (12-18m), speech (single words by 12-18m, 2-word phrases by 2y), toilet training, behavior, nursery/preschool attendance, play and social interaction.
- School-age (5-12 years): School performance, friendships, behavior, sports/activities, growth and puberty, chronic conditions management.
- Adolescents: HEEADSSS assessment (Home, Education/Employment, Eating, Activities, Drugs, Sexuality, Suicide/depression, Safety). Interview alone if appropriate.

Essential Pediatric History Components:
- Birth history: maternal pregnancy complications, gestation, delivery, birth weight, neonatal problems
- Developmental history: gross motor, fine motor, speech/language, social/cognitive milestones
- Immunization history: up-to-date with national schedule, any missed/delayed vaccines, any adverse reactions
- Growth history: birth weight, current weight/height/head circumference, growth trajectory (plot on centile charts)
- Feeding/Nutrition: breastfed/formula, weaning, current diet, dietary restrictions, vitamins
- Family history: consanguinity, inherited conditions, sudden infant death, childhood deaths`,
    metadata: {
      category: "pediatrics" as MedicalCategory,
      section: "history_taking_framework" as SectionType,
    },
  }),

  new Document({
    pageContent: `PEDIATRICS — COMMON PRESENTATIONS

1. Fever in Children: Most common reason for pediatric emergency attendance. Viral URTI most frequent cause. Assess using NICE traffic light system: green (low risk), amber (intermediate risk — fever >5 days, reduced activity), red (high risk — pale/mottled/blue, weak cry, reduced consciousness, seizure, signs of meningism). Source identification: UTI (especially <2 years), pneumonia, meningitis, bone/joint infection, Kawasaki disease.

2. Respiratory Distress: Croup (barking cough, stridor, 6m-6y, worse at night — dexamethasone), bronchiolitis (RSV, <12m, coryzal prodrome, fine crackles, feeding difficulty), asthma (wheeze, cough, atopy, reversible airflow obstruction), pneumonia (fever, cough, tachypnea, crackles, consolidation on CXR), inhaled foreign body (sudden cough, unilateral wheeze, history of choking episode).

3. Diarrhea and Vomiting: Acute gastroenteritis (viral most common — rotavirus, norovirus), assess dehydration (mild: slightly dry mucous membranes; moderate: reduced skin turgor, tachycardia, sunken eyes; severe: shock, lethargy, absent tears). Pyloric stenosis: projectile vomiting 2-8 weeks, hungry baby, palpable olive mass. Intussusception: colicky pain, red currant jelly stools, sausage-shaped mass.

4. Seizures: Febrile seizures (most common 6m-5y, brief, generalized, associated with fever >38C, usually benign). Epilepsy: recurrent unprovoked seizures. Meningitis: seizure with fever, meningism.

5. Rashes: Measles (Koplik spots, maculopapular rash, cough/coryza/conjunctivitis), chickenpox (vesicular rash in different stages, pruritic), meningococcal (non-blanching petechial/purpuric — emergency), Henoch-Schonlein purpura (palpable purpura on buttocks/legs, arthralgia, abdominal pain, nephritis), Kawasaki disease (fever >5 days, conjunctivitis, strawberry tongue, rash, extremity changes, lymphadenopathy).

6. Failure to Thrive: Weight crossing 2 or more centile lines downward. Inadequate caloric intake (most common — feeding difficulties, neglect), malabsorption (celiac disease, CF, cow milk protein allergy), increased metabolic demand (congenital heart disease, chronic infection).

7. Neonatal Jaundice: Physiological (jaundice <24h = always pathological, >24h = usually physiological, peaks day 3-5). Pathological causes: hemolysis (Rh/ABO incompatibility, G6PD, spherocytosis), infection, hypothyroidism, biliary atresia (pale stools, conjugated hyperbilirubinemia — urgent referral). Treat with phototherapy, exchange transfusion if severe.`,
    metadata: {
      category: "pediatrics" as MedicalCategory,
      section: "common_presentations" as SectionType,
    },
  }),

  new Document({
    pageContent: `PEDIATRICS — DIFFERENTIAL DIAGNOSIS GUIDE

FEVER IN CHILDREN BY AGE:
- Neonate (<28 days): ALWAYS take seriously — group B streptococcus, E. coli, Listeria, HSV. Full septic screen (blood cultures, urine, LP, CXR). Empirical IV antibiotics.
- Infant (1-3 months): UTI (especially if no obvious source), pneumonia, meningitis, bacteremia. Low threshold for investigation.
- Young child (3 months-5 years): Viral URTI (most common), otitis media, tonsillitis, UTI, pneumonia, gastroenteritis, Kawasaki disease (>5 days fever).
- Older child (>5 years): As above plus consider EBV, scarlet fever, osteomyelitis, septic arthritis, appendicitis, inflammatory conditions.

RESPIRATORY DISTRESS BY AGE:
- Neonate: RDS (surfactant deficiency, preterm), transient tachypnea of newborn, meconium aspiration, congenital pneumonia, congenital heart disease, diaphragmatic hernia
- Infant: bronchiolitis (RSV, <12m), pertussis (paroxysmal cough, whoop, apnea in young infants), congenital airway abnormalities (laryngomalacia)
- Toddler: croup (6m-6y), inhaled foreign body (peak 1-3y), asthma (>1y), bacterial tracheitis
- Older child: asthma, pneumonia, anaphylaxis, pneumothorax

PEDIATRIC ABDOMINAL PAIN BY AGE:
- Infant: colic (excessive crying <3m), intussusception (3m-2y, paroxysmal pain, red currant jelly stools), pyloric stenosis (2-8w, projectile vomiting), incarcerated hernia
- Young child: constipation (most common), UTI, appendicitis (rare <5y, atypical presentation), mesenteric adenitis, Henoch-Schonlein purpura
- Older child/adolescent: appendicitis (most common surgical cause), constipation, functional abdominal pain, ovarian pathology (females), testicular torsion (males), IBD, diabetic ketoacidosis`,
    metadata: {
      category: "pediatrics" as MedicalCategory,
      section: "differential_diagnosis_guide" as SectionType,
    },
  }),

  new Document({
    pageContent: `PEDIATRICS — CLERKING TEMPLATE

HPC for Pediatric Presentations:
Same principles as adults but adapted for age. For infants: feeding pattern changes, urine output (wet nappies — at least 6/day), stool changes, activity level, irritability, temperature. For older children: can often describe symptoms themselves. Always ask about contact with illness, nursery/school absences, recent travel, immunization status, effect on daily activities.

Family History for Pediatrics:
Consanguinity (increased risk of autosomal recessive conditions), inherited conditions (CF, sickle cell, thalassemia), sudden infant death in siblings, childhood deaths, atopy (asthma, eczema, hay fever in parents/siblings), autoimmune conditions, developmental delay or learning difficulties in family, mental health conditions. Neonatal deaths or recurrent miscarriages (may suggest genetic condition).

Social History for Pediatrics:
Who is the primary caregiver, household composition, parental occupation, housing, nursery/school attendance, safeguarding concerns (unexplained injuries, inconsistent history, delayed presentation, parental behavior), social services involvement, health visitor input, developmental support services, additional needs education.

Drug History for Pediatrics:
Current medications (weight-based dosing — always check), OTC medications (paracetamol, ibuprofen — note doses given before presentation), allergies, immunization status (check red book), vitamin supplements (vitamin D recommended for all children).

PMH for Pediatrics:
Birth history (essential): maternal health in pregnancy, gestation, mode of delivery, birth weight, Apgar scores, NICU stay, neonatal complications (jaundice needing phototherapy, feeding problems, sepsis, respiratory support). Developmental milestones: when first smiled, sat, walked, first words, current developmental level compared to peers. Previous hospital admissions, surgeries, chronic conditions. Growth trajectory (request growth charts).`,
    metadata: {
      category: "pediatrics" as MedicalCategory,
      section: "clerking_template" as SectionType,
    },
  }),

  new Document({
    pageContent: `PEDIATRICS — RED FLAGS

NEONATAL RED FLAGS:
- Jaundice within first 24 hours of life — ALWAYS pathological, suspect hemolysis, urgent bilirubin and Coombs test
- Bile-stained (green) vomiting — suspect malrotation with volvulus until proven otherwise, surgical emergency
- Pale stools and dark urine with jaundice — suspect biliary atresia, urgent referral (Kasai procedure before 60 days)
- Temperature instability, poor feeding, lethargy — suspect neonatal sepsis, full septic screen and IV antibiotics immediately

INFANT/CHILD RED FLAGS:
- Non-blanching rash with fever — suspect meningococcal disease, give IM benzylpenicillin, call ambulance, do NOT wait for investigations
- Bulging fontanelle with fever — suspect meningitis, urgent LP (if safe) and empirical IV antibiotics
- Bile-stained vomiting at any age — suspect bowel obstruction, urgent surgical assessment
- Inconsolable crying with pallor and drawing up of legs — suspect intussusception, urgent USS
- Reduced consciousness with hyperglycemia — suspect DKA, fluid resuscitation, IV insulin (care with cerebral edema)
- Stridor at rest with drooling and toxic appearance — suspect epiglottitis (now rare post-Hib vaccine) or bacterial tracheitis, do NOT examine throat, call anesthetist

SAFEGUARDING RED FLAGS:
- Injuries inconsistent with developmental stage (e.g., fractures in non-mobile infant)
- Multiple injuries at different stages of healing
- Delayed presentation for injury
- Inconsistent or changing history between caregivers
- Patterned bruising or burns
- Genital injuries without clear accidental mechanism`,
    metadata: {
      category: "pediatrics" as MedicalCategory,
      section: "red_flags" as SectionType,
    },
  }),
];

// ---------------------------------------------------------------------------
// Combined Knowledge Base
// ---------------------------------------------------------------------------

const medicalKnowledgeBase: Document[] = [
  ...internalMedicineDocs,
  ...surgeryDocs,
  ...obgynDocs,
  ...pediatricsDocs,
];

// ---------------------------------------------------------------------------
// Retrieval Functions
// ---------------------------------------------------------------------------

/**
 * Retrieves all medical knowledge documents matching the given category.
 */
export function retrieveByCategory(category: MedicalCategory): Document[] {
  return medicalKnowledgeBase.filter(
    (doc) => doc.metadata.category === category,
  );
}

/**
 * Formats retrieved documents into a single context string suitable for
 * injection into an LLM prompt, with section headers.
 */
export function formatRetrievedContext(docs: Document[]): string {
  if (docs.length === 0) {
    return "No specific medical reference context available for this category.";
  }

  return docs
    .map((doc) => {
      const section = (doc.metadata.section as string)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return `--- ${section} ---\n${doc.pageContent}`;
    })
    .join("\n\n");
}
