import { json, urlencoded } from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';

import Logger from '../../../Contexts/Shared/domain/Logger';
import container from './dependency-injection';
import { registerRoutes } from './routes';

export class Server {
	private readonly express: express.Express;
	readonly port: string;
	private readonly logger: Logger;
	private httpServer?: http.Server;

	constructor(port: string) {
		this.port = port;
		this.logger = container.get('Shared.Logger');
		this.express = express();
		this.express.use(json());
		this.express.use(urlencoded({ extended: true }));
		this.express.use(helmet.xssFilter());
		this.express.use(helmet.noSniff());
		this.express.use(helmet.hidePoweredBy());
		this.express.use(helmet.frameguard({ action: 'deny' }));
		this.express.use(compress());
		const router = Router();
		router.use(cors());
		router.use(errorHandler());
		this.express.use(router);
		registerRoutes(router);

		router.use((err: Error, req: Request, res: Response, next: Function) => {
			this.logger.error(err);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
		});
	}

	async listen(): Promise<void> {
		return new Promise(resolve => {
			const env = this.express.get('env') as string;
			this.httpServer = this.express.listen(this.port, () => {
				this.logger.info(
					`  Backoffice Backend App is running at http://localhost:${this.port} in ${env} mode`
				);
				this.logger.info('  Press CTRL-C to stop\n');
				resolve();
			});
		});
	}

	getHTTPServer(): Server['httpServer'] {
		return this.httpServer;
	}

	async stop(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.httpServer) {
				this.httpServer.close(error => {
					if (error) {
						reject(error);

						return;
					}

					resolve();
				});
			}

			resolve();
		});
	}
}
