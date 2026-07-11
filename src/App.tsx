import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Activity, 
  Award, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  Clipboard, 
  Cpu, 
  Database, 
  Download, 
  ExternalLink, 
  Layers, 
  Lightbulb, 
  MapPin, 
  Play, 
  Plus, 
  RefreshCw, 
  Save, 
  Sparkles, 
  Terminal, 
  Trash2, 
  User, 
  Users 
} from "lucide-react";
import { ArchitectPlan, UserJourneyScreen, FeatureItem, BuildPhase, StudioPrompt, DeploymentStep } from "./types";

// Dynamic templates for quick demonstration
const EXAMPLE_TEMPLATES = [
  {
    name: "Desk Worker Hydration & Stretch Coach",
    problem: "Desk workers sit for hours without drinking water or moving. The app needs to nudge them to take water breaks every hour, lead simple 1-minute chair stretches, and use an AI wellness companion that suggests customized micro-stretches based on their specific back or shoulder tightness.",
    audience: "Desk-bound professionals and remote developers",
    extra: "Animated posture reminders, hourly glass counter, custom Gemini stretch assistant"
  },
  {
    name: "Seniors Safe Cardiac Walking Companion",
    problem: "Older adults need a very simple, high-contrast walking tracker that records daily steps and cardiac minutes. It must calculate safe walking zones based on age, log simple daily pill schedules with checkbox compliance, and have a supportive AI companion that speaks encouragingly and handles basic voice-to-text notes.",
    audience: "Seniors and cardiovascular rehab patients",
    extra: "Extra-large text theme, high contrast colors, heart-rate zone simulator, daily motivational quotes"
  },
  {
    name: "College Student Late Night Brain Food Planner",
    problem: "Students study late and make unhealthy nutrition choices. They need a quick late-night snack calorie logger, a pantry ingredient scanner to suggest healthy snacks with whatever they have, and an AI planner that converts ramen or quick items into nutrient-balanced mini meals.",
    audience: "University students and busy night-owls",
    extra: "Ingredient checklist, budget-friendly meal logs, quick late night preset cards"
  }
];

// High-quality default static plan to load immediately so the UI is active and visually rich on first load
const DEFAULT_ARCHITECT_PLAN: ArchitectPlan = {
  reasoningCoT: "Designing a highly responsive, single-page application for desk workers. To optimize user execution, we separate the static presentation shell from the user profile database, and roll out individual tracking layers before binding the Gemini AI inference model.",
  userJourney: [
    { screenName: "Landing & Daily Dashboard", description: "First visual point. Displays daily calorie logs, step rings, current water level, and the quick-add actions drawer." },
    { screenName: "Onboarding Profile Creator", description: "Interactive health questionnaire capturing age, weight, goal targets, and desk job activity factors to calculate baseline targets." },
    { screenName: "Nutrition & Food Feed", description: "Food log view with custom calorie presets, macro-nutrient sliders, and quick search filters." },
    { screenName: "Movement & Exercise Monitor", description: "Activity timeline tracking active sessions, MET intensity points, and remaining walk steps." },
    { screenName: "AI Coach Chatbot Lab", description: "Immersive chat interface with voice-text, smart recommendations, and proactive health recommendations." }
  ],
  features: [
    { featureName: "Personalized Calorie Goal Calculator", description: "Calculates personal daily calorie budgets using Mifflin-St Jeor formula based on active goals.", dataStored: "localStorage key `HEALTHIFY_PROFILE`" },
    { featureName: "Preset Snack/Meal Logger", description: "Logs items rapidly with macro percentages for Protein, Carbs, and Fats.", dataStored: "localStorage key `HEALTHIFY_MEALS`" },
    { featureName: "Active Minute Tracker", description: "Converts moderate and high-intensity exercises into daily active duration metrics.", dataStored: "localStorage key `HEALTHIFY_WORKOUTS`" },
    { featureName: "AI Wellness Coach Chat", description: "Provides smart advice utilizing custom profile targets and daily logged items.", dataStored: "localStorage key `HEALTHIFY_CHATS`" }
  ],
  phases: [
    { phaseId: "Phase 1", title: "Visual Presentation Shell", focus: "Static layout, responsive sidebar grid, and placeholder navigation tabs." },
    { phaseId: "Phase 2", title: "Auth & User Profile Capture", focus: "Onboarding form, BMR calculation parameters, and profile local persistence." },
    { phaseId: "Phase 3", title: "Core Food Nutrition Logs", focus: "Calorie increments, food database presets, and daily macro bar logs." },
    { phaseId: "Phase 4", title: "Active Movement Monitor", focus: "MET-based burn counters, custom workout manual adds, and step targets." },
    { phaseId: "Phase 5", title: "Gemini AI Wellness Companion", focus: "Integrates the server-side coach API proxy with systemic instruction context." }
  ],
  prompts: [
    {
      phaseId: "Phase 1",
      fileToUpdate: "index.html",
      tabSection: "Visual Presentation Shell Structure",
      localStorageKey: "HEALTHIFY_SHELL_TAB",
      dataModel: "currentTab: 'dashboard' | 'meals' | 'workouts' | 'coach'",
      uiLayout: "A beautiful clean layout with a left navigation sidebar, top status bar, and responsive workspace card grid.",
      behaviorAndValidation: "Smooth tab selection transitions, dynamic header greetings, and clean CSS flex containment.",
      promptText: "Build a single-view visual presentation shell for HealthifyYou using HTML, Tailwind CSS, and vanilla JS. Design a clean header, a left navigation sidebar, and a central workspace card grid with placeholder tabs. Save the current selected tab state in localStorage key `HEALTHIFY_SHELL_TAB` and ensure fluid layout responsiveness."
    },
    {
      phaseId: "Phase 2",
      fileToUpdate: "index.html",
      tabSection: "Onboarding Profile Creator",
      localStorageKey: "HEALTHIFY_USER_PROFILE",
      dataModel: "name: string, age: number, weight: kg, height: cm, goal: string, dailyCalories: number",
      uiLayout: "A centered popup card modal or full-width view with input fields, select sliders, and action buttons.",
      behaviorAndValidation: "Validate all form parameters. Run the Mifflin-St Jeor equation to suggest custom daily target limits.",
      promptText: "Update the existing app to implement an onboarding questionnaire. Ask for name, age, weight, height, and health goal. Calculate personal daily calories with BMR metrics and write the user profile state safely under localStorage key `HEALTHIFY_USER_PROFILE`. Add full form validations."
    },
    {
      phaseId: "Phase 3",
      fileToUpdate: "index.html",
      tabSection: "Food & Meals Nutrition Tracker",
      localStorageKey: "HEALTHIFY_MEAL_LOGS",
      dataModel: "Array of logs: [{ id, name, calories, protein, carbs, fat, timestamp }]",
      uiLayout: "Log inputs with fields for meal name, calories, and macros. Plus a row of quick preset meal buttons.",
      behaviorAndValidation: "Ensure no negative inputs, render progress bar showing remaining daily calorie budget.",
      promptText: "Update the existing app to add a nutrition tracking module. Build a form to log meal name, calories, protein, carbs, and fat with quick action presets (e.g. Avocado Toast: 340 kcal). Render a dynamic progress bar subtraction from the target calorie budget and persist items under localStorage key `HEALTHIFY_MEAL_LOGS`."
    },
    {
      phaseId: "Phase 4",
      fileToUpdate: "index.html",
      tabSection: "Activity & Workout Monitor",
      localStorageKey: "HEALTHIFY_WORKOUT_LOGS",
      dataModel: "Array of logs: [{ id, type, duration, caloriesBurned, intensity, timestamp }]",
      uiLayout: "Activity selectors, manual minutes logs, and step tracking metrics card.",
      behaviorAndValidation: "Convert duration and intensity into metabolic calorie burns. Sync results instantly to central metrics.",
      promptText: "Update the existing app to implement a workout movement logger. Include exercise type dropdown, duration input, and intensity options (low, medium, high). Calculate caloric burn using simple MET rates, show daily active minute progress bar, and store entries in localStorage key `HEALTHIFY_WORKOUT_LOGS`."
    },
    {
      phaseId: "Phase 5",
      fileToUpdate: "index.html",
      tabSection: "AI Wellness Coach Chat Interface",
      localStorageKey: "HEALTHIFY_COACH_CHAT",
      dataModel: "Array of messages: [{ role, text, timestamp }]",
      uiLayout: "A splitting layout. Left: Daily health dashboard metrics overview. Right: Chat area with scrollable response window.",
      behaviorAndValidation: "Execute server-side POST fetch to /api/gemini/coach forwarding user profile targets and daily nutrition logs.",
      promptText: "Update the existing app to integrate the AI Health Coach chat module. Create a split dashboard. On the right, include a real-time chat interface. Send request payloads with the user's logged meals and exercises context to the server-side `/api/gemini/coach` route, and display formatted answers. Store chats in localStorage key `HEALTHIFY_COACH_CHAT`."
    }
  ],
  deployment: [
    { stepName: "Create GitHub Repository", commands: "git init\ngit add .\ngit commit -m 'Initial commit'\ngit branch -M main\ngit remote add origin <your-repo-url>\ngit push -u origin main", details: "Creates a version-controlled codebase and publishes it to your remote GitHub profile for pipeline integration." },
    { stepName: "Deploy to Vercel/Cloud Run", commands: "npm i -g vercel\nvercel login\nvercel", details: "Hooks up the build environment. Specify environment variable GEMINI_API_KEY in your hosting dashboard for secure server-side proxy handling." }
  ]
};

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [appName, setAppName] = useState<string>("FitFlow AI");
  const [targetAudience, setTargetAudience] = useState<string>("Remote Desk Workers");
  const [extraFeatures, setExtraFeatures] = useState<string>("Stretch alerts, posture triggers, customizable micro-break timers");
  const [plan, setPlan] = useState<ArchitectPlan>(DEFAULT_ARCHITECT_PLAN);
  
  // Interface interactive state helper
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [currentLogText, setCurrentLogText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual customization handlers
  const handleUpdateJourney = (index: number, key: keyof UserJourneyScreen, value: string) => {
    const updatedJourney = [...plan.userJourney];
    updatedJourney[index] = { ...updatedJourney[index], [key]: value };
    setPlan({ ...plan, userJourney: updatedJourney });
  };

  const handleUpdateFeature = (index: number, key: keyof FeatureItem, value: string) => {
    const updatedFeatures = [...plan.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [key]: value };
    setPlan({ ...plan, features: updatedFeatures });
  };

  const handleUpdatePrompt = (index: number, key: keyof StudioPrompt, value: string) => {
    const updatedPrompts = [...plan.prompts];
    updatedPrompts[index] = { ...updatedPrompts[index], [key]: value };
    setPlan({ ...plan, prompts: updatedPrompts });
  };

  const handleApplyTemplate = (tpl: typeof EXAMPLE_TEMPLATES[0]) => {
    setAppName(tpl.name);
    setProblemStatement(tpl.problem);
    setTargetAudience(tpl.audience);
    setExtraFeatures(tpl.extra);
  };

  const runArchitectAPI = async () => {
    if (!problemStatement.trim()) {
      setErrorMsg("Please specify a problem statement before running the AI architect.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationLogs([]);
    setCurrentLogText("Contacting Gemini cognitive engine...");

    const logStates = [
      "Analyzing wellness target specifications...",
      "Mapping holistic user journey frames...",
      "Extracting critical micro-feature constraints...",
      "Formulating relational local storage state blueprints...",
      "Sequencing the 5-phase dependency matrices...",
      "Polishing code prompts for Google AI Studio..."
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < logStates.length) {
        setGenerationLogs(prev => [...prev, logStates[logIdx]]);
        setCurrentLogText(logStates[logIdx]);
        logIdx++;
      }
    }, 1200);

    try {
      const response = await fetch("/api/gemini/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemStatement,
          appName,
          targetAudience,
          extraFeatures
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile the architecture plan. Is the server online?");
      }

      const generatedPlan = await response.json();
      clearInterval(interval);
      setPlan(generatedPlan);
      setActiveStep(1); // Auto-jump to the user journey step!
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setErrorMsg(err.message || "An error occurred compiling parameters.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to generate downloadable Markdown of the plan
  const handleExportMarkdown = () => {
    const mdContent = `
# ${appName} - Hackathon Build Specification
*Architected with HealthifyYou Hackathon Architect Companion*

## Core Problem Statement
${problemStatement || "General health tracker formulation"}

## Target Audience
${targetAudience || "Health and wellness seekers"}

## Key System Dependency Reasoning (CoT)
${plan.reasoningCoT}

---

## Step 1: User Journey Roadmap
${plan.userJourney.map((screen, idx) => `### Screen ${idx + 1}: ${screen.screenName}\n- ${screen.description}\n`).join("\n")}

---

## Step 2: Telemetry & Feature Map
${plan.features.map((feat, idx) => `### Feature: ${feat.featureName}\n- **Goal**: ${feat.description}\n- **Storage Model**: \`${feat.dataStored}\`\n`).join("\n")}

---

## Step 3: Phase Grouping & Milestones
${plan.phases.map((ph, idx) => `- **${ph.phaseId}: ${ph.title}**\n  - Focus: ${ph.focus}\n`).join("\n")}

---

## Step 4: AI Prompt Lab (Google AI Studio Copy-Paste Targets)
${plan.prompts.map((pr, idx) => `
### ${pr.phaseId}: ${pr.tabSection}
- **File target**: \`${pr.fileToUpdate}\`
- **Tab/Component**: ${pr.tabSection}
- **Storage Target**: \`${pr.localStorageKey}\`
- **Data Model**: ${pr.dataModel}
- **Prompt Text**:
\`\`\`text
${pr.promptText}
\`\`\`
`).join("\n")}

---

## Step 5: Terminal Deployment Instructions
${plan.deployment.map((dep, idx) => `### Step: ${dep.stepName}\n- **Action command**:\n\`\`\`bash\n${dep.commands}\n\`\`\`\n- **Guideline**: ${dep.details}\n`).join("\n")}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${appName.toLowerCase().replace(/\s+/g, "_")}_build_plan.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sidebarSteps = [
    { num: "00", label: "App Intake", icon: BookOpen },
    { num: "01", label: "User Journey", icon: Users },
    { num: "02", label: "Feature Maps", icon: Database },
    { num: "03", label: "Phase Grouping", icon: Layers },
    { num: "04", label: "AI Prompt Lab", icon: Sparkles },
    { num: "05", label: "Deployment", icon: Terminal }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      
      {/* Header matching professional blueprint */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-8 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <Activity className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-slate-800 font-bold text-base sm:text-lg tracking-tight font-display">
              HealthifyYou <span className="text-slate-400 font-normal">Hackathon Architect</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium hidden sm:inline-block">Role: Senior Product Architect</span>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <button 
            onClick={handleExportMarkdown}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Plan</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar navigation */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6 flex flex-col shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 lg:mb-6">Build Pipeline Steps</p>
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-1 pb-2 lg:pb-0 scrollbar-none">
            {sidebarSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer text-left flex-shrink-0 lg:flex-shrink-1 border ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-blue-100 shadow-xs" 
                      : "bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {step.num}
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold leading-tight">{step.label}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-100 hidden lg:block">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-blue-600" />
                <span>Compiler Hub</span>
              </h4>
              <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                <strong>Project:</strong> {appName || "Untitled"}<br />
                <strong>Audience:</strong> {targetAudience || "Everyone"}<br />
                <strong>Stack:</strong> Vanilla / SPA framework with localStorage persistence.
              </p>
            </div>
          </div>
        </aside>

        {/* Workspace Central Interface */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Chain-of-Thought hint banner */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between text-[11px] font-medium text-slate-500 italic shrink-0 overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>CoT Reasoning: {activeStep === 0 ? "Formulating target specifications..." : plan.reasoningCoT.substring(0, 100) + "..."}</span>
            </div>
            <span className="text-slate-400 hidden sm:inline-block">System: Ready</span>
          </div>

          {/* Core dynamic content stages */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              
              {/* STEP 0: Intake and specifications input */}
              {activeStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-4xl mx-auto space-y-6"
                >
                  <div className="text-left space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-800 tracking-tight">
                      Architect Your HealthifyYou Hackathon App
                    </h2>
                    <p className="text-sm text-slate-500">
                      Input your wellness challenge problem statement. Gemini will design step-by-step UI routes, model schemas, and generate individual AI Studio developer prompts!
                    </p>
                  </div>

                  {/* Pre-fill presets drawer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {EXAMPLE_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => handleApplyTemplate(tpl)}
                        className="bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group shadow-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Template {i + 1}</span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{tpl.name}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{tpl.problem}</p>
                        </div>
                        <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform pt-1">
                          Apply Template <ChevronRight className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hackathon App Name</label>
                        <input 
                          type="text"
                          value={appName}
                          onChange={e => setAppName(e.target.value)}
                          placeholder="e.g. FitTrack, MindSpace"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target User / Demographic</label>
                        <input 
                          type="text"
                          value={targetAudience}
                          onChange={e => setTargetAudience(e.target.value)}
                          placeholder="e.g. Elderly patients, college students"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Problem Statement & Scope of Wellness App</label>
                      <textarea
                        rows={4}
                        value={problemStatement}
                        onChange={e => setProblemStatement(e.target.value)}
                        placeholder="Describe the application goals, tracking metrics (like water, exercise, calories, pills), and how the AI coach should support them..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Additional Features / Integrations (Optional)</label>
                      <input 
                        type="text"
                        value={extraFeatures}
                        onChange={e => setExtraFeatures(e.target.value)}
                        placeholder="e.g. sound alarms, custom meal suggestions"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
                      />
                    </div>

                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                        <span>⚠</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={runArchitectAPI}
                        disabled={isGenerating}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Compiling Blueprint...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span>Generate 5-Phase Architecture Plan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Generation loading screen overlay */}
                  {isGenerating && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl">
                        <div className="relative w-20 h-20 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                          <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
                            <Cpu className="h-8 w-8 text-blue-600 animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-800">Gemini Architect is Crafting...</h3>
                          <p className="text-xs text-slate-500 font-mono italic">"{currentLogText}"</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto text-left space-y-1 border border-slate-100">
                          {generationLogs.map((log, lIdx) => (
                            <div key={lIdx} className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                              <span className="text-emerald-500">✔</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 1: User Journey Timeline & Wireframing */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 1 — Interaction Map</span>
                      <h3 className="text-xl font-bold font-display text-slate-800">User Screen Journey</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        This sequences every screen the user touches from registration to coaching chats. Customize screen titles or details below:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {plan.userJourney.map((screen, sIdx) => (
                        <div key={sIdx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-slate-400">Screen 0{sIdx + 1}</span>
                            <input 
                              type="text"
                              value={screen.screenName}
                              onChange={e => handleUpdateJourney(sIdx, "screenName", e.target.value)}
                              className="text-xs font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-200 focus:outline-none focus:border-blue-500 w-full"
                            />
                          </div>
                          <textarea 
                            rows={2}
                            value={screen.description}
                            onChange={e => handleUpdateJourney(sIdx, "description", e.target.value)}
                            className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-full resize-none leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side: Mock app viewport simulation */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Interactive Canvas Mockup</h4>
                    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border-4 border-slate-800 flex flex-col h-[520px]">
                      {/* Mock Phone Status bar */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pb-4 border-b border-slate-800 shrink-0">
                        <span>12:00 PM</span>
                        <span className="text-emerald-500">● {appName} LIVE SIM</span>
                        <span>100%</span>
                      </div>

                      {/* Dynamic Screen simulation viewport */}
                      <div className="flex-1 overflow-y-auto py-6 flex flex-col justify-center items-center text-center px-4 space-y-4">
                        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                          <Activity className="h-10 w-10 animate-bounce" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-base font-bold font-display">{plan.userJourney[0]?.screenName}</h4>
                          <p className="text-xs text-slate-400 max-w-sm">{plan.userJourney[0]?.description}</p>
                        </div>
                        
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 w-full max-w-xs text-left space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Elements</p>
                          <div className="h-6 bg-slate-700/50 rounded flex items-center px-2 text-[10px] text-white">🗂 Dashboard Tab Widget</div>
                          <div className="h-6 bg-slate-700/50 rounded flex items-center px-2 text-[10px] text-white">🥗 Quick Calorie Entry Button</div>
                          <div className="h-6 bg-slate-700/50 rounded flex items-center px-2 text-[10px] text-white">🏃 MET Action Drawer</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-around text-slate-500 text-[10px] font-bold shrink-0">
                        <span>🏠 Home</span>
                        <span>🍎 Food</span>
                        <span>💪 Workouts</span>
                        <span>💬 AI Coach</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Feature extraction maps */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  <div className="lg:col-span-6 space-y-6">
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 2 — Feature telemetry maps</span>
                      <h3 className="text-xl font-bold font-display text-slate-800">State Models & Features</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        These are the key components and their corresponding <code>localStorage</code> hooks that maintain state across client updates:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <input 
                              type="text"
                              value={feat.featureName}
                              onChange={e => handleUpdateFeature(fIdx, "featureName", e.target.value)}
                              className="text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-3/4"
                            />
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">localStorage</span>
                          </div>
                          <textarea 
                            rows={2}
                            value={feat.description}
                            onChange={e => handleUpdateFeature(fIdx, "description", e.target.value)}
                            className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-full resize-none leading-relaxed"
                          />
                          <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                            <Database className="h-3.5 w-3.5" />
                            <input 
                              type="text"
                              value={feat.dataStored}
                              onChange={e => handleUpdateFeature(fIdx, "dataStored", e.target.value)}
                              className="text-[10px] font-mono font-bold bg-transparent border-none p-0 focus:ring-0 w-full text-blue-700"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Left panel: DB Visual state mapping */}
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Client-Side Database Scheme Visualizer</h4>
                    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-lg space-y-6 font-mono text-xs">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-slate-400">
                        <span className="text-amber-500">localStorage Workspace Schema</span>
                        <span className="text-[10px]">Active Keys: {plan.features.length}</span>
                      </div>

                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400 font-bold">📂 {feat.dataStored.replace('localStorage key', '').replace('`', '').replace('`', '').trim()}</span>
                            <span className="text-slate-500">JSON Object</span>
                          </div>
                          <div className="pl-4 text-[10px] text-slate-400 space-y-1 border-l border-slate-700">
                            <p>• <span className="text-blue-300">Name</span>: string</p>
                            <p>• <span className="text-blue-300">Timestamp</span>: ISO-8601 string</p>
                            <p>• <span className="text-blue-300">Values</span>: [ calories: number, description: string ]</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Phase grouping dependencies */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-4xl mx-auto space-y-6"
                >
                  <div className="space-y-2 text-center max-w-2xl mx-auto">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 3 — Dependency Sequencing</span>
                    <h3 className="text-2xl font-bold font-display text-slate-800">5-Phase Core Milestones</h3>
                    <p className="text-xs text-slate-500">
                      We organize features sequentially so later stages correctly inherit parameters initialized in prior steps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {plan.phases.map((ph, pIdx) => (
                      <div key={ph.phaseId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-48 border-t-4 border-t-blue-500">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400">{ph.phaseId}</span>
                          <h4 className="text-xs font-bold text-slate-800">{ph.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed mt-1.5">{ph.focus}</p>
                        </div>
                        <span className="text-[9px] bg-slate-50 text-slate-500 font-bold py-1 px-2 rounded self-start border border-slate-100">Validated</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-amber-500 animate-pulse" />
                        <span>Architectural Blueprint Rule</span>
                      </h4>
                      <p className="text-xs text-amber-700 max-w-2xl leading-relaxed">
                        <strong>Rule:</strong> The AI Companion Chat (Phase 5) strictly depends on the onboarding telemetry profile (Phase 2) and daily calories/workout log matrices (Phases 3/4) to feed personal prompt contextual inputs. Do not re-arrange the dependencies.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: AI Prompt Lab - Copy Paste Prompts */}
              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 4 — Copiable AI Developer Prompts</span>
                    <h3 className="text-xl font-bold font-display text-slate-800">Google AI Studio Prompt Lab</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Copy each prompt below and paste them sequentially into your Google AI Studio instance to build your complete wellness app!
                    </p>
                  </div>

                  <div className="space-y-6">
                    {plan.prompts.map((pr, pIdx) => (
                      <div key={pIdx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                        {/* Prompt Meta Details */}
                        <div className="lg:col-span-4 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-4 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">0{pIdx + 1}</span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">{pr.phaseId}</h4>
                                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600 uppercase">{pr.fileToUpdate}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-xs">
                              <p className="font-semibold text-slate-700">Tab section:</p>
                              <p className="text-slate-500">{pr.tabSection}</p>
                            </div>

                            <div className="space-y-1 text-xs">
                              <p className="font-semibold text-slate-700">Storage target:</p>
                              <p className="font-mono text-slate-500 bg-slate-100 p-1.5 rounded">{pr.localStorageKey}</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
                            <strong>Inherits context:</strong> {pIdx === 0 ? "None" : `Phase ${pIdx} inputs`}
                          </div>
                        </div>

                        {/* Copy-pasteable Box */}
                        <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Copy-pasteable Prompt text</label>
                            <div className="relative">
                              <textarea
                                readOnly
                                rows={5}
                                value={pr.promptText}
                                className="w-full bg-slate-900 text-slate-300 font-mono text-[11px] p-4 rounded-xl focus:outline-none focus:ring-0 resize-none leading-relaxed border border-slate-800"
                              />
                              <button
                                onClick={() => handleCopyToClipboard(pr.promptText, pIdx)}
                                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700 shadow-md"
                              >
                                {copiedIndex === pIdx ? (
                                  <>
                                    <span className="text-emerald-400">✔</span>
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Clipboard className="h-3.5 w-3.5" />
                                    <span>Copy Prompt</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
                            <div>
                              <p className="font-bold text-slate-700">UI Layout Focus</p>
                              <p className="text-slate-500 text-[11px]">{pr.uiLayout}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-700">Behaviors & Code Logic</p>
                              <p className="text-slate-500 text-[11px]">{pr.behaviorAndValidation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Deployment Guides */}
              {activeStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-4xl mx-auto space-y-6"
                >
                  <div className="space-y-2 text-center max-w-xl mx-auto">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 5 — Publish Production Workspace</span>
                    <h3 className="text-2xl font-bold font-display text-slate-800">Deployment Sandbox</h3>
                    <p className="text-xs text-slate-500">
                      Commit code pipelines and activate persistent server configurations for external sharing.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {plan.deployment.map((dep, dIdx) => (
                      <div key={dIdx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">0{dIdx + 1}</span>
                          <h4 className="text-xs font-bold text-slate-800">{dep.stepName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{dep.details}</p>
                        
                        <div className="relative">
                          <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                            <code>{dep.commands}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyToClipboard(dep.commands, dIdx + 100)}
                            className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-700 shadow-md"
                          >
                            {copiedIndex === dIdx + 100 ? (
                              <>
                                <span className="text-emerald-400">✔</span>
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Clipboard className="h-3.5 w-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white text-center space-y-4 shadow-lg shadow-blue-500/20">
                    <h3 className="text-xl font-bold font-display">Ready to submit to the Hackathon? 🚀</h3>
                    <p className="text-xs text-blue-100 max-w-xl mx-auto leading-relaxed">
                      Make sure your production hosting configuration binds securely to port 3000 and the environmental variables like <code>GEMINI_API_KEY</code> are entered in your secret vaults.
                    </p>
                    <button 
                      onClick={handleExportMarkdown}
                      className="inline-flex items-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Markdown Specifications File</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer controls for progress sequence */}
          <footer className="h-20 bg-white border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
            <div className="flex space-x-2">
              <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold rounded uppercase">Dependency Validated</span>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-bold rounded uppercase">Vanilla JS Ready</span>
            </div>
            
            <div className="flex space-x-4 items-center">
              {activeStep > 0 && (
                <button 
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Back Step
                </button>
              )}
              {activeStep < 5 ? (
                <button 
                  onClick={() => {
                    if (activeStep === 0) {
                      runArchitectAPI();
                    } else {
                      setActiveStep(prev => prev + 1);
                    }
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
                >
                  {activeStep === 0 ? "Architect App" : "Next Step"}
                </button>
              ) : (
                <button 
                  onClick={() => setActiveStep(0)}
                  className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
                >
                  Create New Plan
                </button>
              )}
            </div>
          </footer>

        </main>
      </div>

    </div>
  );
}
