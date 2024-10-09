import * as cheerio from "cheerio";
import { createSpinner, Spinner } from "nanospinner";

export const scrapeData = async (urls: string[], spinner: Spinner) => {
  let texts = "";
  spinner.start({
    text: "Scraping search results",
  });

  for await (const url of urls) {
    try {
      spinner.update({ text: `Scraping ${url}` });
      const $ = await cheerio.fromURL(url);
      $(
        "script, source, style, head, img, svg, a, form, link, iframe"
      ).remove();
      $("*").removeClass();
      $("*").each((_, el) => {
        if (el.type === "tag" || el.type === "script" || el.type === "style") {
          for (const attr of Object.keys(el.attribs || {})) {
            if (attr.startsWith("data-")) {
              $(el).removeAttr(attr);
            }
          }
        }
      });
      const text = $("body").text().replace(/\s+/g, " ");
      texts = texts.concat(`Source: ${url}\n\n${text}\n\n`);
      spinner.success({
        text: `Scraped ${url}`,
      });
    } catch (err) {
      spinner.error({
        text: `Could not scrape ${url}`,
      });
    }
  }
  spinner.update({
    text: "Scraped all sources",
  });
  return texts;
};
