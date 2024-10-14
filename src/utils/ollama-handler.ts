import ollama from "ollama";
import { createSpinner } from "nanospinner";
import { getUrls } from "./get-urls";
import { scrapeData } from "./scrape-data";

export const ollamaHandler = async (query: string) => {
  const spinner = createSpinner();
  const searchResults = await getUrls(query, spinner);

  const text = await scrapeData(searchResults, spinner);

  spinner.start({
    text: "Generating answer",
  });
  const response = await ollama.chat({
    model: "llama3.2",
    messages: [
      {
        role: "system",
        content: `You are a helpful web search assistant. You will try to answer a users query by using only the context from the web provided. Context: ${text}`,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });
  console.log("\n", response.message.content, "\n");
  spinner.success({
    text: "Generated answer",
  });
};
