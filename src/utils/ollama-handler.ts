import ollama from "ollama";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { getUrls } from "./get-urls";
import { scrapeData } from "./scrape-data";

export const ollamaHandler = async (query: string) => {
  console.log(`Query: ${query}`);

  const spinner = createSpinner();
  const searchResults = await getUrls(query, spinner);

  const text = await scrapeData(searchResults, spinner);
  
  spinner.start({
    text: "Generating answer",
  });
  const response = await ollama.chat({
    model: "gemma2",
    messages: [
      {
        role: "system",
        content: `You are a helpful web search assistant. You are provided with a set of web search results as a 'context' on the basis of users query, you will use these search results to generate a crisp to the point summary answering the user's questions. You will not deviate from the user's question and in case you dont have the answer reply appropriately that you dont have the answer. Context of the user query is as following: ${text} `,
      },
    ],
    stream: true,
  });
  spinner.success({
    text: "Output generated",
  });

  for await (const chunk of response) {
    process.stdout.write(chunk.message.content);
  }
};
