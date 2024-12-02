import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";

import defaultConfig from "@assets/config/default";
import logger from "@utils/functions/logger";
import app  from "./app";

const server = app.listen(process.env.PORT, async () => {
    const address = server.address();
    const mode = defaultConfig.mode;
    if (typeof address === 'object' && address !== null) {
        const host = address.address === '::' ? 'localhost' : address.address;
        logger.info(`🚀 Server iniciado em: ${chalk.blueBright('http://' + host + ':' + address.port)}`);
        logger.info(`mode: ${mode =='developing' ? chalk.green(mode) : chalk.red(mode)}`);
    };
});

process.on('SIGINT', () => {
    logger.error("[server] Server encerrado")
    server.close();
});