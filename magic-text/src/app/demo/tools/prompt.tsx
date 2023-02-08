export function makePrompt(command: string, history: string) {
  const prompt = `
You are an assistant who has access to some additional tools to help answer question:
Use thinking to answer the question, but you can use the tools to help you. When you use an
Action stop.

Tool:
    WIKIPEDIA
    use this to get information about a topic if you use this tool stop thinking

Use the following format:
Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [WIKIPEDIA]
Action Input: the input to the action
Result: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question"""

Begin!

Question: ${command}
Thought: ${history}
`;
  return prompt;
}
