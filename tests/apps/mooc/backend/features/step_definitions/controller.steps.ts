import assert from 'assert';
import { AfterAll, BeforeAll, Given, Then } from 'cucumber';
import request from 'supertest';

import container from '../../../../../../src/apps/mooc/backend/dependency-injection';
import { MoocBackendApp } from '../../../../../../src/apps/mooc/backend/MoocBackendApp';
import { EnvironmentArranger } from '../../../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';

let _request: request.Test;
let application: MoocBackendApp;
let _response: request.Response;

Given('I send a GET request to {string}', (route: string) => {
	_request = request(application.httpServer).get(route);
});

Then('the response status code should be {int}', async (status: number) => {
	_response = await _request.expect(status);
});

Given('I send a PUT request to {string} with body:', (route: string, body: string) => {
	_request = request(application.httpServer)
		.put(route)
		.send(JSON.parse(body) as object);
});

Then('the response should be empty', () => {
	assert.deepStrictEqual(_response.body, {});
});

BeforeAll(async () => {
	const environmentArranger: Promise<EnvironmentArranger> = container.get(
		'Mooc.EnvironmentArranger'
	);
	await (await environmentArranger).arrange();
	application = new MoocBackendApp();
	await application.start();
});

AfterAll(async () => {
	const environmentArranger: Promise<EnvironmentArranger> = container.get(
		'Mooc.EnvironmentArranger'
	);
	await (await environmentArranger).arrange();
	await (await environmentArranger).close();
	await application.stop();
});
