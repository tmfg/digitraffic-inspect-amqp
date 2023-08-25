#!/usr/bin/env node
import { main } from "./main";
import type { Config } from "./main";
import fs from "fs-extra";
import { program } from "commander";

export interface Options {
  cert: string;
  key: string;
  outputFile: string;
  config: string;
  timeout: number;
}

const defaultConnectionOptions = {
  transport: "tls",
  port: 5671,
  enable_sasl_external: true,
  rejectUnauthorized: false,
  reconnect: false
} satisfies Partial<Config["connectionOptions"]>;

function parseConfig(options: Options): Config {
  const config = fs.readJSONSync(options.config);

  return {
    connectionOptions: {
      ...defaultConnectionOptions,
      ...config.connectionOptions,
      cert: fs.readFileSync(options.cert),
      key: fs.readFileSync(options.key)
    } satisfies Config["connectionOptions"],
    receiverOptions: config.receiverOptions satisfies Config["receiverOptions"]
  };
}

program
  .option("-c, --cert <path>", "Certificate path", "cert.pem")
  .option("-k, --key <path>", "Key path", "key.pem")
  .option("-o, --output-file <path>", "Output file", "output.json")
  .option("-C, --config <path>", "Config file", "config.json")
  .option("-t, --timeout <number>", "Timeout in seconds", "10")
  .action((options: Options) => {
    const config = parseConfig(options);
    main(config, options);
  });

program.parse();
