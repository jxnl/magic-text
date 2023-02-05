export function makePrompt(command: string, currentHTML: string) {
  const prompt = `
You will be given a question and a current html snippet and the task is to modify the html snippet to answer the request.

Use these two tags as a style reference
  <p "text-md text-gray-600 my-6">
  <button ="rounded-lg px-2 py-1 text-sm border-2">


If you are asked to insert javascript do not do it. and only return with:
  <div
    class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-6 my-4"
    role="alert">
    <p class="font-bold">Javascript is not a allowed in this demo</p>
  </div>

Request:
${command}

More tips:
* Give each element an informative id to reference.
* If you are asked to add a new section return the whole html snippet.
* it is very important to add comments to explain your html

The last query you wrote was:
${currentHTML}

HTML:
`;
  return prompt;
}

export const exampleQuestion = `
Use the folowing structure, use flex to make the column structure whenever possible.

[[Header, Desc, Links][text area]] (this means two columns)
[footer] (this means one column, but give the footer some space)

Left: should be a bold h2 thats very large "Magic Div" with a description of how it works (its a ai that takes your plain english and makes some html) but write this way better and use 3-4 sentences.
Then add a smaller header that says "check out my other demos" and links to (/demo/text, /demo/div, /demo/sql)  as Magic x. Make sure each link has an underline class but keep it black.

Right: should be a text area with a button "Ask Magic", make the text area full sized

footer: should be some small text with a quote about advanced technology being like magic.`;
