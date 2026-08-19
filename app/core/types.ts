export type ChoiceId = "help" | "decline" | "wait";
export type RealitySource = "experience" | "learned" | "unclear";

export interface Choice {
  id: ChoiceId;
  label: string;
}

export interface ExclusionReason {
  id: string;
  label: string;
  protects: string;
}

export interface SituationAnswers {
  firstChoice?: ChoiceId;
  firstExclusion?: string;
  firstReality?: RealitySource;
  secondExclusion?: string;
  secondReality?: RealitySource;
  openCondition?: string;
  finalChoice?: ChoiceId;
}

export interface PebbleTrailSession {
  version: 1;
  stage: AppStage;
  situationOne: SituationAnswers;
  updatedAt: string;
}

export type AppStage =
  | "welcome"
  | "purpose"
  | "situation"
  | "exclusion-one"
  | "reality-one"
  | "exclusion-two"
  | "reality-two"
  | "space"
  | "rejudge"
  | "discovery"
  | "home";

export interface Discovery {
  headline: string;
  summary: string;
  firstStandard: string;
  secondStandard: string;
  movement: string;
}
