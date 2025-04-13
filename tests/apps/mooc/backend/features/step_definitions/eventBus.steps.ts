import { Given } from 'cucumber';

import container from '../../../../../../src/apps/mooc/backend/dependency-injection';
import { DomainEventDeserializer } from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventDeserializer';
import { DomainEventSubscribers } from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';

const eventBus = container.get('Mooc.Shared.domain.EventBus');
const deserializer = buildDeserializer();

Given('I send an event to the event bus:', async (event: any) => {
	const domainEvent = deserializer.deserialize(event);

	await eventBus.publish([domainEvent]);
	await wait(100);
});

function buildDeserializer() {
	const subscribers = DomainEventSubscribers.from(container);

	return DomainEventDeserializer.configure(subscribers);
}

async function wait(milliseconds: number) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
