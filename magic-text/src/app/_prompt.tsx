export enum PromptType {
  Professional = "Professional",
  Longer = "Longer",
  Shorter = "Shorter",
  ActionItems = "ActionItems",
  Explain = "Explain",
}

export function makePrompt({
  promptType,
  text,
}: {
  promptType: PromptType;
  text: string;
}) {
  if (promptType === PromptType.Professional) {
    return `Rewrite this text in a professional manner: ${text} \nRewrite:`;
  } else if (promptType === PromptType.Longer) {
    return `Rewrite this text in a longer manner: ${text} \nRewrite:`;
  } else if (promptType === PromptType.Shorter) {
    return `Rewrite this text in a shorter manner: ${text} \nRewrite:`;
  } else if (promptType === PromptType.ActionItems) {
    return `Rewrite this text in a manner that includes action items: ${text} \nRewrite:`;
  } else if (promptType === PromptType.Explain) {
    return `Rewrite this text in a manner that explains simply: ${text} \nRewrite:`;
  } else {
    // if no prompt type is specified, return the text and warn the user
    console.warn("No prompt type specified. Returning text.");
    return text;
  }
}
