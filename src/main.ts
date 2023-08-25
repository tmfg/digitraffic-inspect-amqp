import { ReceiverEvents, EventContext } from "rhea-promise";
import fs from "fs-extra";
import type { ConnectionOptions, ReceiverOptions } from "rhea-promise";
import { Connection } from "rhea-promise";
import { setTimeout } from "node:timers/promises";
import pino from "pino";
import type { Options } from ".";

const logger = pino();

export interface Config {
  connectionOptions: ConnectionOptions & { enable_sasl_external: boolean };
  receiverOptions: {
    name: string;
    source: string;
  };
}

export interface AmqpMessage {
  user_id: Buffer;
  body: {
    typecode: number;
    content: Buffer;
  };
}

function bufferToString(obj: AmqpMessage) {
  return {
    ...obj,
    user_id: obj.user_id.toString("hex"),
    body: { typecode: obj.body.typecode, content: obj.body.content.toString("hex") }
  };
}

function createReceiverOptions(config: Config): ReceiverOptions {
  return {
    ...config.receiverOptions,
    onMessage: (context) => {
      logger.debug({ type: "receiver-on-message", context });
    },
    onError: (context) => {
      logger.error({ type: "receiver-on-error", context });
    },
    onSessionError: (context) => {
      const sessionError = context.session && context.session.error;
      if (sessionError) {
        logger.error({ type: "receiver-on-session-error", sessionError, context });
      }
    }
  } satisfies ReceiverOptions;
}

export async function main(config: Config, opts: Options) {
  const connection = new Connection(config.connectionOptions);

  await connection.open();
  const receiverOptions = createReceiverOptions(config);

  const receiver = await connection.createReceiver(receiverOptions);

  receiver.on(ReceiverEvents.message, (context: EventContext) => {
    const message = context.message as AmqpMessage | undefined;
    if (!message) {
      logger.error({ message: "Message is undefined", context });
      return;
    }
    logger.info({ message: bufferToString(message) });
    fs.writeFile(opts.outputFile, `${JSON.stringify(bufferToString(message), null, 2)}\n`, {
      flag: "a"
    });
  });

  receiver.on(ReceiverEvents.receiverError, (context: EventContext) => {
    const receiverError = context.receiver && context.receiver.error;
    if (receiverError) {
      logger.error({
        message: `An error occured for receiver '${connection.id}' '${receiverOptions.name}' '${receiverError}`,
        connection,
        context
      });
    }
  });

  await setTimeout(opts.timeout * 1000);
  await receiver.close();
  await connection.close();
}
