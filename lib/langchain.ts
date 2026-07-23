import { ChatSchemaType, ModelType } from "@/schemas";
import { ChatGoogle } from "@langchain/google";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  retrieveByCategory,
  formatRetrievedContext,
  type MedicalCategory,
} from "./medical-knowledge";

// ---------------------------------------------------------------------------
// 1. Model Factory
// ---------------------------------------------------------------------------

const MODEL_CONFIG: Record<
  ModelType,
  { provider: "google" | "anthropic" | "openai"; envKey: string }
> = {
  "gemini-3-flash-preview": { provider: "google", envKey: "GOOGLE_API_KEY" },
  "claude-sonnet-5": { provider: "anthropic", envKey: "ANTHROPIC_API_KEY" },
  "gpt-5.5-2026-04-23": { provider: "openai", envKey: "OPENAI_API_KEY" },
};

export function createModel(modelType: ModelType): BaseChatModel {
  const config = MODEL_CONFIG[modelType];
  if (!config) {
    throw new Error(
      `Unsupported model: "${modelType}". Supported models: ${Object.keys(MODEL_CONFIG).join(", ")}`,
    );
  }

  const apiKey = process.env[config.envKey];
  if (!apiKey) {
    throw new Error(
      `Missing API key: ${config.envKey} is not set in your environment variables. ` +
        `Please add it to your .env file to use the "${modelType}" model.`,
    );
  }

  switch (config.provider) {
    case "google":
      return new ChatGoogle({ apiKey, model: modelType });
    case "anthropic":
      return new ChatAnthropic({ apiKey, model: modelType });
    case "openai":
      return new ChatOpenAI({ openAIApiKey: apiKey, model: modelType });
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// ---------------------------------------------------------------------------
// 2. LangGraph State Annotation
// ---------------------------------------------------------------------------

// Last-write-wins reducer: each node's partial update overwrites the field.
const lastValue = <T>() => ({
  value: (_prev: T, next: T) => next,
  default: () => "" as unknown as T,
});

const ClerkingState = Annotation.Root({
  prompt: Annotation<string>(lastValue<string>()),
  category: Annotation<MedicalCategory>({
    value: (_prev: MedicalCategory, next: MedicalCategory) => next,
    default: () => "internal_medicine" as MedicalCategory,
  }),
  context: Annotation<string>(lastValue<string>()),
  isValidMedical: Annotation<boolean>({
    value: (_prev: boolean, next: boolean) => next,
    default: () => false,
  }),
  errorMessage: Annotation<string>(lastValue<string>()),
  hpc: Annotation<string>(lastValue<string>()),
  familyHistory: Annotation<string>(lastValue<string>()),
  socialHistory: Annotation<string>(lastValue<string>()),
  drugHistory: Annotation<string>(lastValue<string>()),
  pastMedicalHistory: Annotation<string>(lastValue<string>()),
  differentialDiagnosis: Annotation<string>(lastValue<string>()),
  compiledOutput: Annotation<string>(lastValue<string>()),
});

type ClerkingStateType = typeof ClerkingState.State;

// ---------------------------------------------------------------------------
// 3. Shared Prompt Helpers
// ---------------------------------------------------------------------------

const SYSTEM_PREAMBLE = `You are ClerkWise, an expert clinical education AI designed to guide medical students through structured patient clerking. When a student provides a presenting complaint, you teach them exactly what questions to ask, what clinical information to elicit, and why each element matters. Your tone is that of an experienced consultant guiding a junior doctor at the bedside — authoritative yet encouraging. Your responses must be medically accurate, evidence-based, and formatted for easy learning.`;

function sectionPrompt(
  section: string,
  instructions: string,
  state: ClerkingStateType,
): string {
  return `${SYSTEM_PREAMBLE}

You are guiding a medical student through the **${section}** section of clerking a patient.

**Presenting Complaint:** ${state.prompt}
**Medical Specialty:** ${state.category.replace(/_/g, " ")}

**Reference Medical Knowledge:**
${state.context}

**Instructions:**
${instructions}

Generate ONLY the ${section} guidance content. Do not include section headers or titles. Use a clear, structured format mixing short explanations with bullet points and example questions. Be thorough yet concise.`;
}

// ---------------------------------------------------------------------------
// 4. Graph Node Functions
// ---------------------------------------------------------------------------

function createNodeFunctions(llm: BaseChatModel) {
  // --- validate_input ---
  async function validateInput(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const validationPrompt = `${SYSTEM_PREAMBLE}

Determine whether the following user input contains a medical presenting complaint that a student could clerk.

A VALID presenting complaint includes ANY of the following:
- Symptoms a patient might present with (e.g., "chest pain", "shortness of breath", "abdominal pain")
- A clinical scenario with a complaint (e.g., "45-year-old male with chest pain")
- A medical condition with symptoms (e.g., "Type 2 diabetes presenting with polyuria")
- Multiple symptoms (e.g., "fever, cough, and weight loss")

An INVALID input is one that:
- Asks a general knowledge question unrelated to medicine (e.g., "What is the weather?")
- Is a greeting or casual conversation (e.g., "Hello, how are you?")
- Is nonsensical or empty
- Asks about non-clinical topics (e.g., "Tell me about football")

User input: "${state.prompt}"

Respond with EXACTLY one word: "VALID" or "INVALID". Nothing else.`;

    try {
      const response = await llm.invoke([
        { role: "user", content: validationPrompt },
      ]);
      const result =
        typeof response.content === "string"
          ? response.content.trim().toUpperCase()
          : "";
      const isValid = result.includes("VALID") && !result.includes("INVALID");
      return { isValidMedical: isValid };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown validation error";
      console.error("Validation node error:", message);
      return {
        isValidMedical: false,
        errorMessage: `An error occurred while validating your input: ${message}`,
      };
    }
  }

  // --- error_handler ---
  async function errorHandler(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const errorMsg =
      state.errorMessage ||
      `**Your input does not appear to be a presenting complaint.**

ClerkWise guides you through clerking patients based on their presenting complaints. Please enter a symptom or clinical presentation, for example:

- *"chest pain"*
- *"45-year-old male with acute abdominal pain"*
- *"fever and cough in a 3-year-old child"*
- *"vaginal bleeding at 32 weeks gestation"*
- *"right iliac fossa pain"*

You can be brief (just the complaint) or include patient details for more tailored guidance.`;

    return { compiledOutput: errorMsg };
  }

  // --- retrieve_context ---
  async function retrieveContext(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    try {
      const docs = retrieveByCategory(state.category);
      const context = formatRetrievedContext(docs);
      return { context };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown retrieval error";
      console.error("Context retrieval error:", message);
      return {
        context:
          "No additional medical context available. Rely on general medical knowledge.",
      };
    }
  }

  // --- generate_hpc ---
  async function generateHPC(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "History of Presenting Complaint (HPC)",
      `Guide the student on how to take a thorough History of Presenting Complaint for a patient with this complaint. Structure your response as:

1. **Opening the consultation** — How to begin the conversation with the patient (open-ended questions to start).

2. **Key questions to ask** — Provide the specific questions the student should ask to explore this complaint, organized using the SOCRATES framework where relevant:
   - **S**ite: Where exactly?
   - **O**nset: When and how did it start?
   - **C**haracter: What does it feel like?
   - **R**adiation: Does it go anywhere else?
   - **A**ssociated symptoms: What else have you noticed?
   - **T**iming: Is it constant or does it come and go?
   - **E**xacerbating/relieving factors: What makes it better or worse?
   - **S**everity: How bad is it on a scale of 1-10?

3. **Symptom-specific probes** — Additional questions tailored to this specific presenting complaint that help narrow the differential (e.g., for chest pain: relationship to exertion, position, breathing).

4. **Clinical reasoning tips** — Brief notes on why each question matters and what the answers might suggest diagnostically.

Provide actual example questions the student can ask the patient, written in plain language (e.g., "Can you show me exactly where the pain is?").`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        hpc: typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("HPC generation error:", message);
      return { hpc: `*Error generating HPC: ${message}*` };
    }
  }

  // --- generate_family_hx ---
  async function generateFamilyHistory(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "Family History",
      `Guide the student on how to take a relevant Family History for a patient with this presenting complaint. Structure your response as:

1. **Why family history matters here** — Briefly explain the clinical relevance of family history to this specific complaint (e.g., hereditary risk, genetic predisposition).

2. **Essential questions to ask** — Provide specific questions:
   - Health status of first-degree relatives (parents, siblings, children)
   - Any family members with the same or related conditions
   - Ages of onset for relevant conditions in the family
   - Causes of death in deceased relatives

3. **Condition-specific family history** — Questions specifically relevant to this complaint (e.g., for chest pain: "Has anyone in your family had a heart attack or stroke? At what age?").

4. **Pertinent negatives to document** — Which family history negatives are important to specifically record and why (e.g., "No family history of sudden cardiac death" is significant for a cardiac presentation).

5. **Hereditary conditions to screen for** — List conditions with genetic links that are relevant to this complaint and specialty.

Provide actual example questions in patient-friendly language.`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        familyHistory:
          typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Family history generation error:", message);
      return {
        familyHistory: `*Error generating family history: ${message}*`,
      };
    }
  }

  // --- generate_social_hx ---
  async function generateSocialHistory(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "Social History",
      `Guide the student on how to take a relevant Social History for a patient with this presenting complaint. Structure your response as:

1. **Why social history matters here** — Explain how lifestyle and social factors relate to this complaint (e.g., smoking and respiratory symptoms, alcohol and liver disease).

2. **Standard social history questions** — The core questions every student should ask:
   - Smoking: "Do you smoke? Have you ever smoked? How many per day and for how long?" (explain pack-year calculation)
   - Alcohol: "How much alcohol do you drink in a typical week?" (explain units)
   - Recreational drugs: "Do you use any recreational substances?"
   - Occupation: "What do you do for work? Are you exposed to any chemicals, dust, or fumes?"
   - Living situation: "Who do you live with? Do you have stairs at home?"

3. **Complaint-specific social questions** — Additional questions particularly relevant to this complaint (e.g., for respiratory: occupational exposures, pets; for pediatrics: school, safeguarding).

4. **Functional assessment** — How to assess activities of daily living (ADLs) and why this matters for this presentation.

5. **Sensitive topics** — How to sensitively approach topics like sexual history, domestic violence, or substance use when relevant, including suggested phrasing.

Provide actual example questions in patient-friendly language.`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        socialHistory:
          typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Social history generation error:", message);
      return {
        socialHistory: `*Error generating social history: ${message}*`,
      };
    }
  }

  // --- generate_drug_hx ---
  async function generateDrugHistory(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "Drug History",
      `Guide the student on how to take a thorough Drug History for a patient with this presenting complaint. Structure your response as:

1. **Why drug history matters here** — Explain how medications can relate to this complaint (e.g., drugs that cause this symptom as a side effect, drugs that mask symptoms, drug interactions).

2. **Essential questions to ask** — The core drug history questions:
   - "What medications are you currently taking, including doses?"
   - "Do you take any over-the-counter medications, vitamins, or supplements?"
   - "Have any medications been started, stopped, or changed recently?"
   - "Do you have any drug allergies?" (and if yes: "What happens when you take it?" — distinguish allergy from intolerance)
   - "Do you use any herbal or traditional remedies?"
   - "Do you take your medications as prescribed?"

3. **Complaint-specific drug considerations** — Medications particularly relevant to this presentation:
   - Drugs that could CAUSE these symptoms
   - Drugs the patient might already be taking FOR these symptoms
   - Important drug interactions to consider
   - Medications that affect management decisions (e.g., anticoagulants before surgery)

4. **Clinical pearls** — Tips for the student on common drug history pitfalls (e.g., patients forgetting inhalers, not mentioning the contraceptive pill, herbal remedies affecting coagulation).

Provide actual example questions in patient-friendly language.`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        drugHistory:
          typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Drug history generation error:", message);
      return { drugHistory: `*Error generating drug history: ${message}*` };
    }
  }

  // --- generate_pmh ---
  async function generatePastMedicalHistory(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "Past Medical History",
      `Guide the student on how to take a relevant Past Medical History for a patient with this presenting complaint. Structure your response as:

1. **Why PMH matters here** — Explain how pre-existing conditions relate to this complaint (e.g., previous episodes, comorbidities that alter management, surgical history implications).

2. **Systematic approach** — Teach the student to use the **MJ THREADS** mnemonic:
   - **M**yocardial infarction / heart disease
   - **J**aundice / liver disease
   - **T**uberculosis
   - **H**ypertension
   - **R**heumatic fever
   - **E**pilepsy
   - **A**sthma / COPD
   - **D**iabetes
   - **S**troke
   Explain which of these are particularly relevant to this complaint and why.

3. **Key questions to ask** — Provide specific questions:
   - "Do you have any medical conditions or see a doctor regularly?"
   - "Have you ever been in hospital before? What for?"
   - "Have you had any operations?"
   - "Have you ever had anything similar to this before?"

4. **Complaint-specific PMH** — Conditions particularly relevant to this presentation that the student should specifically ask about. Explain why each matters.

5. **Pertinent negatives** — Which PMH negatives are important to document for this complaint and why (e.g., "No previous DVT/PE" is relevant for a patient with pleuritic chest pain).

Provide actual example questions in patient-friendly language.`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        pastMedicalHistory:
          typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("PMH generation error:", message);
      return {
        pastMedicalHistory: `*Error generating past medical history: ${message}*`,
      };
    }
  }

  // --- generate_ddx ---
  async function generateDifferentialDiagnosis(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const prompt = sectionPrompt(
      "Differential Diagnosis",
      `Guide the student on how to formulate a differential diagnosis for this presenting complaint in ${state.category.replace(/_/g, " ")}. Structure your response as:

1. **How to think about this complaint** — Teach the student a systematic approach to generating differentials for this symptom (e.g., anatomical approach, surgical sieve, by system, most common vs most dangerous).

2. **Key differentials to consider** — List 5-8 differential diagnoses in a structured format:
   - Condition name
   - Key features from the history that would SUPPORT this diagnosis
   - Key features that would make it LESS likely
   - The "clincher" — the one question or finding that most helps confirm or exclude it

3. **Red flags to watch for** — Danger signs in this presentation that require urgent action. Explain why each is a red flag and what it might indicate.

4. **Initial investigations** — What investigations the student should consider requesting and why:
   - Bedside tests (observations, ECG, urine dip, blood glucose)
   - Blood tests (and what abnormalities to look for)
   - Imaging (and what findings would help)
   - Special tests (if relevant)

5. **Clinical reasoning framework** — Help the student understand how to rank differentials by likelihood and severity, balancing "most common" against "must not miss" diagnoses.

Teach the student to THINK, not just memorize lists.`,
      state,
    );

    try {
      const response = await llm.invoke([{ role: "user", content: prompt }]);
      return {
        differentialDiagnosis:
          typeof response.content === "string" ? response.content : "",
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("DDx generation error:", message);
      return {
        differentialDiagnosis: `*Error generating differential diagnosis: ${message}*`,
      };
    }
  }

  // --- compile_clerking ---
  async function compileClerking(
    state: ClerkingStateType,
  ): Promise<Partial<ClerkingStateType>> {
    const categoryLabel = state.category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const compiled = `## ClerkWise Clerking Guide — ${categoryLabel}

**Presenting Complaint:** ${state.prompt}

This guide walks you through a structured approach to clerking a patient with this presentation. Use it as a framework — adapt your questions based on the patient's responses.

---

### 📋 History of Presenting Complaint

${state.hpc}

---

### 👨‍👩‍👧 Family History

${state.familyHistory}

---

### 🏠 Social History

${state.socialHistory}

---

### 💊 Drug History

${state.drugHistory}

---

### 🏥 Past Medical History

${state.pastMedicalHistory}

---

### 🔍 Differential Diagnosis & Investigations

${state.differentialDiagnosis}`;

    return { compiledOutput: compiled };
  }

  return {
    validateInput,
    errorHandler,
    retrieveContext,
    generateHPC,
    generateFamilyHistory,
    generateSocialHistory,
    generateDrugHistory,
    generatePastMedicalHistory,
    generateDifferentialDiagnosis,
    compileClerking,
  };
}

// ---------------------------------------------------------------------------
// 5. Graph Builder
// ---------------------------------------------------------------------------

function buildClerkingGraph(llm: BaseChatModel) {
  const nodes = createNodeFunctions(llm);

  const routeAfterValidation = (state: ClerkingStateType): string => {
    return state.isValidMedical ? "retrieve_context" : "error_handler";
  };

  const graph = new StateGraph(ClerkingState)
    // Register all nodes
    .addNode("validate_input", nodes.validateInput)
    .addNode("error_handler", nodes.errorHandler)
    .addNode("retrieve_context", nodes.retrieveContext)
    .addNode("generate_hpc", nodes.generateHPC)
    .addNode("generate_family_hx", nodes.generateFamilyHistory)
    .addNode("generate_social_hx", nodes.generateSocialHistory)
    .addNode("generate_drug_hx", nodes.generateDrugHistory)
    .addNode("generate_pmh", nodes.generatePastMedicalHistory)
    .addNode("generate_ddx", nodes.generateDifferentialDiagnosis)
    .addNode("compile_clerking", nodes.compileClerking)

    // Entry point
    .addEdge(START, "validate_input")

    // Conditional routing after validation
    .addConditionalEdges("validate_input", routeAfterValidation, [
      "retrieve_context",
      "error_handler",
    ])

    // Error path
    .addEdge("error_handler", END)

    // Sequential clerking workflow
    .addEdge("retrieve_context", "generate_hpc")
    .addEdge("generate_hpc", "generate_family_hx")
    .addEdge("generate_family_hx", "generate_social_hx")
    .addEdge("generate_social_hx", "generate_drug_hx")
    .addEdge("generate_drug_hx", "generate_pmh")
    .addEdge("generate_pmh", "generate_ddx")
    .addEdge("generate_ddx", "compile_clerking")
    .addEdge("compile_clerking", END)

    .compile();

  return graph;
}

// ---------------------------------------------------------------------------
// 6. Exported Functions
// ---------------------------------------------------------------------------

/**
 * Runs the full clerking workflow and streams the compiled output
 * section-by-section. Returns an async generator compatible with
 * the existing API route's `for await` loop.
 */
export async function* streamLLM(
  prompt: string,
  category: ChatSchemaType["category"],
  model: ModelType,
): AsyncGenerator<{ content: string }> {
  // Write a space immediately to open the HTTP connection and prevent Vercel 504 gateway timeout
  yield { content: " " };

  const llm = createModel(model);
  const graph = buildClerkingGraph(llm);

  try {
    const stream = await graph.stream({
      prompt: prompt,
      category: category as MedicalCategory,
      context: "",
      isValidMedical: false,
      errorMessage: "",
      hpc: "",
      familyHistory: "",
      socialHistory: "",
      drugHistory: "",
      pastMedicalHistory: "",
      differentialDiagnosis: "",
      compiledOutput: "",
    });

    for await (const event of stream) {
      const eventAny = event as any;
      const nodeName = Object.keys(eventAny)[0];
      const stateUpdate = eventAny[nodeName];

      if (nodeName === "validate_input" && stateUpdate) {
        if (stateUpdate.isValidMedical) {
          const categoryLabel = (category as string)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          yield {
            content: `## ClerkWise Clerking Guide — ${categoryLabel}\n\n**Presenting Complaint:** ${prompt}\n\nThis guide walks you through a structured approach to clerking a patient with this presentation. Use it as a framework — adapt your questions based on the patient's responses.`,
          };
        }
      }

      if (nodeName === "error_handler" && stateUpdate?.compiledOutput) {
        yield { content: stateUpdate.compiledOutput };
      }

      if (nodeName === "generate_hpc" && stateUpdate?.hpc) {
        yield { content: `\n\n---\n\n### 📋 History of Presenting Complaint\n\n${stateUpdate.hpc}` };
      }

      if (nodeName === "generate_family_hx" && stateUpdate?.familyHistory) {
        yield { content: `\n\n---\n\n### 👨‍👩‍👧 Family History\n\n${stateUpdate.familyHistory}` };
      }

      if (nodeName === "generate_social_hx" && stateUpdate?.socialHistory) {
        yield { content: `\n\n---\n\n### 🏠 Social History\n\n${stateUpdate.socialHistory}` };
      }

      if (nodeName === "generate_drug_hx" && stateUpdate?.drugHistory) {
        yield { content: `\n\n---\n\n### 💊 Drug History\n\n${stateUpdate.drugHistory}` };
      }

      if (nodeName === "generate_pmh" && stateUpdate?.pastMedicalHistory) {
        yield { content: `\n\n---\n\n### 🏥 Past Medical History\n\n${stateUpdate.pastMedicalHistory}` };
      }

      if (nodeName === "generate_ddx" && stateUpdate?.differentialDiagnosis) {
        yield { content: `\n\n---\n\n### 🔍 Differential Diagnosis & Investigations\n\n${stateUpdate.differentialDiagnosis}` };
      }
    }
  } catch (error) {
    console.error("Error in graph streaming:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    yield { content: `\n\n---\n\n*An error occurred while streaming response: ${message}*` };
  }
}

/**
 * Non-streaming invocation. Runs the full clerking workflow and
 * returns the compiled output as a single string.
 */
export async function askLLM(prompt: string, model: ModelType) {
  const llm = createModel(model);
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response;
}
