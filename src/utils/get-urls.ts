import { Spinner } from "nanospinner";
import { input } from '@inquirer/prompts';

let searchUrl = process.env.SEARCH_ENGINE_URL;
export const getUrls = async (query: string, spinner: Spinner) => {
    if(!searchUrl) {
        const answer = await input({ message: 'Please enter a valid searxng instance:' }); 
        searchUrl = answer
    }
    spinner.start({
        text: `Searching with searxng instance at ${searchUrl}`
    })
    try {
        const response = await fetch(`${searchUrl}?q=${query}&format=json`)
        const data = await response.json()
        const results = data?.results
        const searchResults = results.slice(0, 3).map((result: any) => result?.url)
        spinner.success({
            text: "Searxng search complete",
        });
        console.log(`Top 3 sources returned by searxng instance:\n`, searchResults)
        return searchResults
    }catch(err) {
        spinner.error({
            text: `Could'nt search using searxng instance at ${searchUrl} `
        })
    }
};
