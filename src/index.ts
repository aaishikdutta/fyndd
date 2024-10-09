#!/usr/bin/env node

import { textSync } from "figlet";
import { Command } from "commander";
import { ollamaHandler } from "./utils/ollama-handler";

const program = new Command();
program
  .version("0.1.0")
  .description(`${textSync("fyndd")}\nAn ollama based web search agent on the cli`)
  .argument("<query>")
  .action(ollamaHandler)

console.log();

program.parse();
