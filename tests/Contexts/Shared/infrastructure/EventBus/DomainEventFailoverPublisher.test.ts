import { DomainEventFailoverPublisher } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { MongoEnvironmentArranger } from '../mongo/MongoEnvironmentArranger';
import { DomainEventDummyMother } from './__mocks__/DomainEventDummy';
import { DomainEventDeserializerMother } from './__mother__/DomainEventDeserializerMother';
import { RabbitMQMongoClientMother } from './__mother__/RabbitMQMongoClientMother';

describe('DomainEventFailoverPublisher test', () => {
	let arranger: MongoEnvironmentArranger;
	const mongoClient = RabbitMQMongoClientMother.create();
	const deserializer = DomainEventDeserializerMother.create();

	beforeAll(async () => {
		arranger = new MongoEnvironmentArranger(mongoClient);
	});

	beforeEach(async () => {
		await arranger.arrange();
	});

	it('should save the published events', async () => {
		const eventBus = new DomainEventFailoverPublisher(mongoClient, deserializer);
		const event = DomainEventDummyMother.random();

		await eventBus.publish(event);

		expect(await eventBus.consume()).toEqual([event]);
	});
});
