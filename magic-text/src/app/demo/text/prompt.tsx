export enum PromptType {
  Formal = "Formal",
  Casual = "Casual",
  Longer = "Longer",
  Shorter = "Shorter",
  Polite = "Polite",
  Pirate = "Pirate",
}

export function makePrompt({
  promptType,
  text,
}: {
  promptType: PromptType;
  text: string;
}) {
  if (promptType === PromptType.Formal) {
    return `Rewrite this text in a formal tone suitable for a office setting: \n\n${text} \n\nRewrite:`;
  } else if (promptType === PromptType.Casual) {
    return `Rewrite this text in a casual tone suitable for a friend: \n\n${text} \n\nRewrite:`;
  } else if (promptType === PromptType.Pirate) {
    return `Rewrite this text in a pirate's voice Arr!: \n\n${text} \n\nRewrite:`;
  } else if (promptType === PromptType.Longer) {
    return `Rewrite this text as a longer piece of text, add 3-4 more sentences and use sophisticated language: \n\n${text} \n\nRewrite:`;
  } else if (promptType === PromptType.Shorter) {
    return `Rewrite this text shorter, be concise but informative: \n\n${text} \n\nRewrite:`;
  } else if (promptType === PromptType.Polite) {
    return `Rewrite this text in a polite tone: \n\n${text} \n\nRewrite:`;
  } else {
    // if no prompt type is specified, return the text and warn the user
    console.warn("No prompt type specified. Returning text.");
    return text;
  }
}
