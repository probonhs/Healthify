export interface UserJourneyScreen {
  screenName: string;
  description: string;
}

export interface FeatureItem {
  featureName: string;
  description: string;
  dataStored: string;
}

export interface BuildPhase {
  phaseId: string;
  title: string;
  focus: string;
}

export interface StudioPrompt {
  phaseId: string;
  fileToUpdate: string;
  tabSection: string;
  localStorageKey: string;
  dataModel: string;
  uiLayout: string;
  behaviorAndValidation: string;
  promptText: string;
}

export interface DeploymentStep {
  stepName: string;
  commands: string;
  details: string;
}

export interface ArchitectPlan {
  reasoningCoT: string;
  userJourney: UserJourneyScreen[];
  features: FeatureItem[];
  phases: BuildPhase[];
  prompts: StudioPrompt[];
  deployment: DeploymentStep[];
}
