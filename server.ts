import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase JSON limit for handling base64 signatures and letterhead uploads if needed
app.use(express.json({ limit: "25mb" }));

// Initialize Google GenAI client (lazy or safe fallback if key not configured yet)
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Drafting endpoint
app.post("/api/draft", async (req, res) => {
  try {
    const { prompt, currentDocument, conversationHistory } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.",
      });
    }

    const systemInstruction = `You are an elite, highly experienced Administrative Officer and Official Government Drafting Assistant, specializing in Indian Government and Government of West Bengal official correspondence (letters, notices, memorandums, office orders, show cause notices, compliance reports).

Your duties:
1. Maintain highest standards of official civil-service drafting: formal, dignified, concise, and grammatically impeccable.
2. USE STANDARD OFFICIAL CORRESPONDENCE IDIOMS:
   - "In inviting reference to the subject cited above..."
   - "I am directed to request you to..."
   - "Under the circumstances, you are hereby requested to..."
   - "In this connection, it is stated that..."
   - "This may please be treated as extremely urgent."
   - "Memo No. ... Copy forwarded for favour of kind information and taking necessary action to..."
3. STRICT ANTI-HALLUCINATION & FACT PRESERVATION RULES (CRITICAL):
   - You must NOT invent:
     * Memo numbers
     * Dates
     * Names of officials or individuals
     * Designations
     * Physical addresses or office names not provided by the user
     * Notification numbers or Government Order (G.O.) numbers
     * Legal provisions, acts, or section numbers
     * Court case numbers or writ petition details
     * Deadlines / timeframes
     * Financial figures or budget sanctions
     * References to prior communications
     * Enclosures
   - If required factual details are missing, KEEP THEM EXPLICITLY AS PLACEHOLDERS in square brackets, such as:
     "[Memo No.]", "[Date]", "[Name]", "[Designation]", "[Reference No.]", "[Deadline - e.g. 3 days]", "[Enclosure Details]".
   - NEVER present an invented figure, number, or name as true fact.
   - Always preserve all factual information supplied by the user.

4. CONVERSATIONAL DOCUMENT EVOLUTION:
   - You are provided with the 'currentDocument'. If the user asks to modify one aspect (e.g. "Make the subject shorter", "Change deadline to 3 days", "Add a reminder warning paragraph"), MODIFY ONLY the requested parts while preserving the rest of the document!
   - Do NOT rewrite unrelated fields if the user only wanted a targeted tweak.
   - If converting between document types (e.g. letter to notice or office order), adjust salutation, subject line, and format appropriately (e.g., Notices do not require "To [Individual]", they have "NOTICE" title and wide public distribution; Memorandums have "MEMORANDUM" heading).

5. RETURN STRICT JSON:
   You must return a JSON response matching the provided schema, including:
   - 'assistantMessage': A polite, concise explanation of what changes you made or what information is needed.
   - 'document': The updated document object with all structured fields.`;

    const promptPayload = `Current Document State:
${JSON.stringify(currentDocument || {}, null, 2)}

Recent Conversation History:
${JSON.stringify(conversationHistory || [], null, 2)}

User Instruction:
"${prompt}"

Please process the user's instruction, update the official document accordingly while adhering strictly to all government drafting and anti-hallucination rules, and return the updated fields and an explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptPayload,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for deterministic, factual, and strictly compliant drafting
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assistantMessage: {
              type: Type.STRING,
              description: "A brief, clear note to the user explaining the draft modifications made or highlighting placeholders that need user details.",
            },
            document: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Concise document name suitable for filename, e.g. 'Reminder to BDO Tehatta-I' or 'Letter regarding Action Taken Report'",
                },
                documentType: {
                  type: Type.STRING,
                  description: "Type of document: official_letter, reminder, notice, office_memorandum, office_order, request_letter, direction_letter, show_cause, forwarding_letter, compliance_letter",
                },
                officeName: { type: Type.STRING },
                department: { type: Type.STRING },
                officeAddress: { type: Type.STRING },
                contactInfo: { type: Type.STRING },
                memoNo: { type: Type.STRING },
                date: { type: Type.STRING },
                toPrefix: { type: Type.STRING },
                toName: { type: Type.STRING },
                toDesignation: { type: Type.STRING },
                toOffice: { type: Type.STRING },
                toAddress: { type: Type.STRING },
                subject: { type: Type.STRING },
                reference: { type: Type.STRING },
                salutation: { type: Type.STRING },
                body: {
                  type: Type.STRING,
                  description: "Full body of the letter. Standard paragraphs or numbered points (1., 2., 3.) separated by newlines.",
                },
                closing: { type: Type.STRING },
                signatoryName: { type: Type.STRING },
                signatoryDesignation: { type: Type.STRING },
                signatoryOffice: { type: Type.STRING },
                enclosures: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of enclosed documents",
                },
                copyTo: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of distribution / endorsement copies (Memo No. ... Copy forwarded to...)",
                },
              },
              required: ["subject", "body", "closing"],
            },
          },
          required: ["assistantMessage", "document"],
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No response received from model");
    }

    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI drafting error:", error);
    return res.status(500).json({
      error: error.message || "Failed to draft letter using AI assistant.",
    });
  }
});

// Vite middleware / static files setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Official Letter Assistant server running on port ${PORT}`);
  });
}

startServer();
