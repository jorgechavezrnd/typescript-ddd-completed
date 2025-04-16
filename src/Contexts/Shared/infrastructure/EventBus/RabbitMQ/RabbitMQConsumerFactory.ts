import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { DomainEventDeserializer } from '../DomainEventDeserializer';
import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQConsumer } from './RabbitMQConsumer';

export class RabbitMQconsumerFactory {
	constructor(
		private readonly deserializer: DomainEventDeserializer,
		private readonly connection: RabbitMQConnection,
		private readonly maxRetries: number
	) {}

	build(subscriber: DomainEventSubscriber<DomainEvent>, exchange: string, queueName: string) {
		return new RabbitMQConsumer({
			subscriber,
			deserializer: this.deserializer,
			connection: this.connection,
			queueName,
			exchange,
			maxRetries: this.maxRetries
		});
	}
}
