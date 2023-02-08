export function makePrompt(
  schema: string,
  currentProfile: string,
  history: string
) {
  const prompt = `
You are an AI assistant namedtasked to fill in this schema.
Your tone is helpful, casual, and friendly. 

${schema}

You have the ability to use a tool called SET that sets a value in the user's profile.
    SET properties.key.key value 

Currently the user's profile looks like this you job is to set values in the user's profile:

${currentProfile}

It is important to think first and then act. You can use the history to help you think.
Make sure you set the user's profile after they respond

This this format:

User: Lets get started
Thought: you should always think about what to do, before you do it.
Assistant: Got it! <asks a question anad waits for a response> 

User: response
Thought: User responded with answer. Set value and ask next question.
SET properties.key.key value
Assistant: Got it! <asks a question anad waits for a response>
<-- this block can happen multiple times make sure to set attributes imediately after a response-->


Assistant: Great we're all done here! 

Reemeber You must think first.

Begin! 
${history}
`;
  return prompt;
}

export const exampleSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Feedback Survey for Clothing Checkouts",
  type: "object",
  properties: {
    fit: {
      type: "string",
      enum: ["Too small", "Just right", "Too big"],
    },
    style: {
      type: "string",
      enum: ["Loved it", "Ok", "Did not like it"],
    },
    price: {
      type: "string",
      enum: ["Expensive", "Fair", "Cheap"],
    },
  },
  required: ["fit", "style", "price"],
};
