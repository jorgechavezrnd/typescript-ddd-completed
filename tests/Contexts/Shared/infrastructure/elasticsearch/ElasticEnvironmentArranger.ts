import { Client as ElasticClient } from '@elastic/elasticsearch';
import { ResponseError } from '@elastic/elasticsearch/lib/errors';
import bodybuilder from 'bodybuilder';
import httpStatus from 'http-status';

import { EnvironmentArranger } from '../arranger/EnvironmentArranger';

export class ElasticEnvironmentArranger extends EnvironmentArranger {
	constructor(
		private readonly contextName: string,
		private readonly _client: Promise<ElasticClient>
	) {
		super();
	}

	public async arrange(): Promise<void> {
		await this.cleanDatabase();
	}

	protected async cleanDatabase(): Promise<void> {
		try {
			const body = bodybuilder().query('match_all').build();
			const indexes = await this.indexes();

			for (const index of indexes) {
				(await this.client()).deleteByQuery({ index, body });
			}
		} catch (e) {
			if (!this.isNotFoundError(e)) {
				throw e;
			}
		}
	}

	private async indexes(): Promise<string[]> {
		const client = await this.client();
		const indexesInfo = await client.cat.indices({
			format: 'json',
			h: ['index'],
			index: `${this.contextName}*`
		});
		const indexesName = indexesInfo.body.map((x: any) => x.index) as string[];

		return indexesName;
	}

	private isNotFoundError(e: unknown) {
		return this.isResponseError(e) && e.meta.statusCode === httpStatus.NOT_FOUND;
	}

	private isResponseError(e: unknown): e is ResponseError {
		return e instanceof ResponseError;
	}

	protected async client(): Promise<ElasticClient> {
		return this._client;
	}

	public async close(): Promise<void> {
		return (await this.client()).close();
	}
}
