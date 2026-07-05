"use client";

import { useEffect, useState } from "react";

const TIPS: Record<string, string[]> = {
  internal_medicine: [
    "Use the 'SOCRATES' acronym for pain, but for other symptoms, focus on onset, duration, and progression.",
    "Take a meticulous drug history: include over-the-counter meds, herbal supplements, and compliance.",
    "Perform a thorough 'Review of Systems' to catch multi-organ involvement common in elderly patients.",
    "Ask about 'Activities of Daily Living' (ADLs) to assess the functional impact of the illness.",
    "Look for peripheral signs of systemic disease (e.g., clubbing, splinter hemorrhages, palmar erythema).",
    "Don't forget to check the blood pressure manually if the automated reading looks suspicious.",
  ],
  pediatrics: [
    "Incorporate the 'Birth History' (gestation, delivery complications, NICU stays) for younger children.",
    "Always check immunization status and developmental milestones (gross motor, fine motor, speech, social).",
    "The history is often 'collateral' from parents; observe how the child interacts with the parent during the talk.",
    "Ask about 'RED flags' like poor feeding, lethargy, or decreased wet diapers.",
    "The 'Opportunistic Exam': If the child is quiet, listen to the heart and lungs first before they start crying.",
    "Examine the child on the parent's lap to reduce anxiety.",
  ],
  surgery: [
    "Focus on the 'Surgical Sieve' (Vascular, Infective, Traumatic, Neoplastic) to narrow differentials.",
    "Identify the 'Acute Abdomen': Ask about 'Bowel Habits' (constipation, flatus) and 'Last Meal' (for NPO status).",
    "Screen for anesthetic risk: Ask about previous surgeries, family history of anesthesia issues, and exercise tolerance.",
    "Clarify the onset: Was it sudden (perforation/infarction) or gradual (inflammation)?",
    "Inspection is key: Look for scars, distension, or visible peristalsis before touching the patient.",
    "Point-of-maximal-tenderness: Ask the patient to point with one finger to where it hurts most.",
  ],
  obs_and_gynae: [
    "Master the 'Obstetric History': Gravidity (number of pregnancies) and Parity (number of births >24 weeks).",
    "Ask for the 'LMP' (Last Menstrual Period) and determine if cycles are regular.",
    "Be sensitive: Create a private environment before asking about sexual history, STIs, or urinary incontinence.",
    "In pregnancy, always ask about fetal movements (quickening) and any vaginal bleeding or 'leaking of liquor'.",
    "Always have a chaperone present for any intimate examination (Speculum/Bimanual).",
    "Empty bladder: Ensure the patient has emptied their bladder before a gynecological palpation unless otherwise specified.",
  ],
};

export function TypingIndicator({
  category = "internal_medicine",
}: {
  category?: string;
}) {
  const tips = TIPS[category] ?? TIPS.internal_medicine;
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * tips.length),
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % tips.length);
        setVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-col  md:px-10 px-4 gap-y-1.5 items-end">
      <div className="flex gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className=" bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center h-9.5">
          <span className="h-2 w-2 rounded-full bg-linear-to-bl   from-sky-500 to-indigo-500 dot-1" />
          <span className="h-2 w-2 rounded-full bg-linear-to-bl   from-sky-500 to-indigo-500 dot-2" />
          <span className="h-2 w-2 rounded-full bg-linear-to-bl   from-sky-500 to-indigo-500 dot-3" />
        </div>
      </div>

      <p
        className="text-[11px] text-muted-foreground ml-10 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}>
        <span className="text-primary/70 font-medium">Tip:</span> {tips[index]}
      </p>
    </div>
  );
}
