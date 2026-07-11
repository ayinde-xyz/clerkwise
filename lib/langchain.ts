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

const SYSTEM_PREAMBLE = `You are ClerkWise, an expert medical AI assistant designed for clinical education. You generate realistic, detailed medical clerking notes based on presenting complaints. Your responses should be medically accurate, well-structured, and suitable for medical students learning clinical history-taking.`;

function sectionPrompt(
  section: string,
  instructions: string,
  state: ClerkingStateType,
): string {
  return `${SYSTEM_PREAMBLE}

You are generating the **${section}** section of a medical clerking.

**Patient Scenario:** ${state.prompt}
**Medical Category:** ${state.category.replace(/_/g, " ")}

**Reference Medical Knowledge:**
${state.context}

**Instructions:**
${instructions}

Generate ONLY the ${section} content. Do not include section headers or titles — just the clinical content. Be specific, realistic, and educational.`;
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

Determine whether the following user input describes a medical scenario, clinical case, or patient presenting complaint. 

A VALID medical scenario includes ANY of the following:
- A patient with symptoms (e.g., "45-year-old male with chest pain")
- A clinical presentation (e.g., "acute abdomen in a young female")
- A medical condition to clerk (e.g., "Type 2 diabetes presenting with polyuria")
- A brief symptom description (e.g., "chest pain and shortness of breath")

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
      `**Your input does not appear to be a medical scenario.**

To use ClerkWise, please provide a clinical presenting complaint. For example:

- *"45-year-old male presenting with acute chest pain radiating to the left arm"*
- *"28-year-old pregnant woman at 32 weeks with vaginal bleeding"*
- *"6-month-old infant with fever, irritability, and a non-blanching rash"*
- *"35-year-old female with right iliac fossa pain for 12 hours"*

Your prompt should describe a patient scenario including relevant details such as age, sex, and presenting symptoms.`;

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
      `Generate a detailed history of presenting complaint based on the patient scenario. Include:
- Onset and duration of symptoms
- Character and nature of the complaint
- Location and radiation (if applicable)
- Associated symptoms
- Severity and progression
- Aggravating and relieving factors
- Timeline of events
- What the patient has tried so far

Use the SOCRATES framework where relevant (Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating/relieving factors, Severity).
Write as a flowing clinical narrative, not bullet points.`,
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
      `Generate a relevant family history for this patient scenario. Include:
- First-degree relatives' medical conditions (parents, siblings)
- Hereditary conditions relevant to the presenting complaint
- Age and health status of family members
- Any family history of the same or related conditions
- Relevant genetic/inherited conditions for this specialty

Make the family history clinically relevant to the presenting complaint and category. Include both positive and negative findings (pertinent negatives).`,
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
      `Generate a relevant social history for this patient scenario. Include:
- Occupation and occupational exposures
- Smoking history (pack-years if applicable)
- Alcohol consumption (units per week)
- Recreational drug use
- Living situation and social support
- Functional status and activities of daily living
- Travel history (if relevant)
- Sexual history (if relevant to the presentation)
- Diet and exercise habits

Focus on aspects that are clinically relevant to the presenting complaint.`,
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
      `Generate a relevant drug history for this patient scenario. Include:
- Current regular medications (with doses and frequency)
- Over-the-counter medications
- Recent medication changes
- Known drug allergies and the nature of the reactions
- Herbal or alternative remedies
- Compliance/adherence to medications
- Any relevant drug interactions

Ensure medications listed are realistic and relevant to the clinical scenario and any comorbidities suggested by the presentation.`,
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
      `Generate a relevant past medical history for this patient scenario. Include:
- Previous medical conditions and diagnoses
- Previous surgical history (with dates if appropriate)
- Previous hospitalizations
- Relevant childhood illnesses
- Immunization status (if relevant, especially for pediatrics)
- Screening history (if relevant)
- Previous similar episodes
- Chronic conditions and their management

Use the mnemonic MJ THREADS if helpful (Myocardial infarction, Jaundice, Tuberculosis, Hypertension, Rheumatic fever, Epilepsy, Asthma, Diabetes, Stroke). Include both positive and pertinent negative findings.`,
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
      `Based on the presenting complaint, history, and the category of ${state.category.replace(/_/g, " ")}, generate a differential diagnosis. Include:

1. **Most likely diagnosis** — State the most probable diagnosis with reasoning based on the clinical features
2. **Differential diagnoses** — List 4-6 alternative diagnoses in order of likelihood, each with:
   - The condition name
   - Key features that support or argue against this diagnosis
   - Any investigations that would help confirm or exclude it
3. **Red flags** — Identify any red flag features in the presentation that require urgent attention
4. **Recommended investigations** — Suggest initial investigations to narrow the differential (bloods, imaging, special tests)

Be systematic and use clinical reasoning. Justify your differential ranking based on the available clinical information.`,
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

    const compiled = `## Clinical Clerking — ${categoryLabel}

**Presenting Complaint:** ${state.prompt}

---

### History of Presenting Complaint

${state.hpc}

---

### Family History

${state.familyHistory}

---

### Social History

${state.socialHistory}

---

### Drug History

${state.drugHistory}

---

### Past Medical History

${state.pastMedicalHistory}

---

### Differential Diagnosis

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
  // Build the model and graph
  const llm = createModel(model);
  const graph = buildClerkingGraph(llm);

  // Run the full graph to completion
  const result = await graph.invoke({
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

  // Stream the compiled output in chunks for progressive display
  if (result.compiledOutput) {
    // Split into sections by the "---" separator for progressive streaming
    const sections = result.compiledOutput.split("\n---\n");
    for (const section of sections) {
      yield { content: section.trim() + "\n\n---\n\n" };
    }
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
