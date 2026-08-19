import type { Choice, ChoiceId, Discovery, ExclusionReason, RealitySource, SituationAnswers } from "./types";

export const situationOne = {
  title: "A friend asks for something important",
  scene: "An old friend suddenly asks for an important favor. You already have an important commitment of your own. They need your answer today.",
};

export const choices: Choice[] = [
  { id: "help", label: "I will help my friend." },
  { id: "decline", label: "I will politely decline." },
  { id: "wait", label: "I will take a little more time." },
];

const exclusions: Record<ChoiceId, ExclusionReason[]> = {
  help: [
    { id: "help-self", label: "Protecting my own schedule first feels too distant from the relationship.", protects: "the relationship" },
    { id: "help-delay", label: "Waiting longer could leave my friend without enough time.", protects: "a timely response" },
    { id: "help-doubt", label: "I do not want uncertainty to decide whether I show up.", protects: "being dependable" },
  ],
  decline: [
    { id: "decline-self", label: "My existing commitment needs to remain protected.", protects: "the commitment already made" },
    { id: "decline-promise", label: "I do not want to promise what I may not be able to complete.", protects: "a reliable promise" },
    { id: "decline-repeat", label: "Helping now may turn this into an expectation later.", protects: "a sustainable boundary" },
  ],
  wait: [
    { id: "wait-facts", label: "I need to know what the favor actually requires.", protects: "enough information" },
    { id: "wait-both", label: "There may be a way to protect both commitments.", protects: "both sides of the decision" },
    { id: "wait-urgency", label: "The urgency should be clear before I answer.", protects: "a proportionate response" },
  ],
};

export function reasonsFor(choice: ChoiceId, excluded: string[] = []) {
  return exclusions[choice].filter((item) => !excluded.includes(item.id));
}

export const realityOptions: { id: RealitySource; label: string }[] = [
  { id: "experience", label: "It seems to come from something I have experienced." },
  { id: "learned", label: "It seems to come from something I learned somewhere." },
  { id: "unclear", label: "I am not sure where it comes from." },
];

export const openConditions = [
  "If I knew exactly how much time the favor required.",
  "If my friend could accept only part of the help.",
  "If I could move my own commitment without breaking a promise.",
  "If I could explain my limit clearly before answering.",
];

function findReason(id?: string) {
  if (!id) return undefined;
  return Object.values(exclusions).flat().find((item) => item.id === id);
}

function choiceLabel(id?: ChoiceId) {
  return choices.find((item) => item.id === id)?.label ?? "";
}

export function buildDiscovery(answers: SituationAnswers): Discovery {
  const first = findReason(answers.firstExclusion);
  const second = findReason(answers.secondExclusion);
  const changed = answers.firstChoice !== answers.finalChoice;
  return {
    headline: changed ? "Your decision moved when the conditions became visible." : "Your decision remained, but its foundation became clearer.",
    summary: `You began with “${choiceLabel(answers.firstChoice)}” and returned to the situation after examining what the other choices might cost.`,
    firstStandard: first?.protects ?? "your first standard",
    secondStandard: second?.protects ?? "another standard",
    movement: changed
      ? `You changed your answer to “${choiceLabel(answers.finalChoice)}.” The new condition created room for a different judgment.`
      : `You kept “${choiceLabel(answers.finalChoice)}.” This time the answer includes the standards you tested along the way.`,
  };
}
