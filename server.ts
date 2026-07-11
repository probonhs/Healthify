import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy-loaded Google GenAI client to prevent crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route for Gemini Coaching Assistant (Legacy endpoint kept for safety and fallback)
  app.post("/api/gemini/coach", async (req, res) => {
    try {
      const { message, history, userData, loggedWorkouts, loggedMeals } = req.body;
      const ai = getAi();
      const systemInstruction = `You are the HealthifyYou Coach, a personalized AI wellness companion. Respond concisely.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: message }] }],
        config: { systemInstruction },
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Coach Error:", error);
      res.status(500).json({ error: error.message || "An error occurred." });
    }
  });

  // API Route for HealthifyYou Hackathon Plan Architect
  app.post("/api/gemini/architect", async (req, res) => {
    try {
      const { problemStatement, appName, targetAudience, extraFeatures } = req.body;
      
      const ai = getAi();
      
      const prompt = `
Analyze the following Health & Wellness Hackathon app idea and produce a complete, professional, phase-by-phase build plan with copy-pasteable AI Studio prompts.

App Details:
- Name: ${appName || "HealthifyYou"}
- Problem Statement: ${problemStatement || "A personalized health platform."}
- Target Audience: ${targetAudience || "General Public / Health Enthusiasts"}
- Extra Custom Features desired: ${extraFeatures || "None specified"}

Produce a valid JSON object matching the following structure exactly. Do not wrap in markdown or backticks (return raw JSON).
Output Schema:
{
  "reasoningCoT": "A short, professional thinking process outlining how the components depend on each other and why we partition them into these 5 phases.",
  "userJourney": [
    { "screenName": "string", "description": "string" }
  ],
  "features": [
    { "featureName": "string", "description": "string", "dataStored": "string" }
  ],
  "phases": [
    { "phaseId": "Phase 1", "title": "string", "focus": "string" },
    { "phaseId": "Phase 2", "title": "string", "focus": "string" },
    { "phaseId": "Phase 3", "title": "string", "focus": "string" },
    { "phaseId": "Phase 4", "title": "string", "focus": "string" },
    { "phaseId": "Phase 5", "title": "string", "focus": "string" }
  ],
  "prompts": [
    {
      "phaseId": "Phase 1",
      "fileToUpdate": "index.html (vanilla JS, no frameworks unless specified)",
      "tabSection": "Visual Shell / Base Page structure",
      "localStorageKey": "e.g., HEALTHIFY_SHELL_STATE",
      "dataModel": "Plain English description of state objects and keys",
      "uiLayout": "Plain English visual structure of containers, colors, sidebar, spacing, and header layouts",
      "behaviorAndValidation": "Detailed interactive states, tab switching, form input validations",
      "promptText": "Short, dense copy-pasteable AI Studio prompt focusing strictly on layout and interactivity. Include: 'Build a single-view visual shell for...' with no flowery descriptions."
    },
    {
      "phaseId": "Phase 2",
      "fileToUpdate": "index.html",
      "tabSection": "Onboarding & Custom Health Profile Form",
      "localStorageKey": "e.g., HEALTHIFY_USER_PROFILE",
      "dataModel": "Age, Weight, Height, Target Goals",
      "uiLayout": "Onboarding card, clean input sliders, goal select chips, elegant typography",
      "behaviorAndValidation": "Mifflin-St Jeor calculation, validation for bounds, save trigger to localStorage",
      "promptText": "Update the existing app... Short, copy-pasteable prompt for onboarding state capture."
    },
    {
      "phaseId": "Phase 3",
      "fileToUpdate": "index.html",
      "tabSection": "Core Tracker 1 (Nutrition & Food Logs)",
      "localStorageKey": "e.g., HEALTHIFY_MEALS",
      "dataModel": "Array of meal logs with name, calories, macros, timestamp",
      "uiLayout": "Log form, quick presets, food timeline, real-time progress indicators",
      "behaviorAndValidation": "Validate non-negative limits, delete items, reset button",
      "promptText": "Update the existing app... Short, copy-pasteable prompt for adding full food/nutrition tracker."
    },
    {
      "phaseId": "Phase 4",
      "fileToUpdate": "index.html",
      "tabSection": "Core Tracker 2 (Activity & Workout logs)",
      "localStorageKey": "e.g., HEALTHIFY_WORKOUTS",
      "dataModel": "Array of workout logs with type, duration, calories burned, timestamp",
      "uiLayout": "Exercise select dropdown, manual form, movement goal progress bar",
      "behaviorAndValidation": "Burn rate calculation based on MET coefficients, progress updates",
      "promptText": "Update the existing app... Short, copy-pasteable prompt for adding movement tracker."
    },
    {
      "phaseId": "Phase 5",
      "fileToUpdate": "index.html",
      "tabSection": "AI Health Coach Brain & Summary Dashboard",
      "localStorageKey": "e.g., HEALTHIFY_COACH_CHAT",
      "dataModel": "Chat messages, health analysis scores",
      "uiLayout": "Split screen. Left: Beautiful metric charts (Recharts/D3 if appropriate, or styled Tailwind indicators). Right: Fully interactive AI Coach chat interface.",
      "behaviorAndValidation": "Fetch recommendations, system instructions loading user state, loader animations",
      "promptText": "Update the existing app... Short, copy-pasteable prompt for loading Gemini 3.5 API and adding the coach chat with history."
    }
  ],
  "deployment": [
    { "stepName": "string", "commands": "string", "details": "string" }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error("Gemini Architect Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with the AI architect model." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
