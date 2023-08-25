#!/usr/bin/env node
import { program } from "commander";

program
  .option("-c, --cert <path>", "Certificate path", "cert.pem")
  .option("-k, --key <path>", "Key path", "key.pem")
  .option("-o, --output-file <path>", "Output file", "output.json")
  .option("-C, --config <path>", "Config file", "config.json");

program.parse();
