import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQQueueFormatter } from './RabbitMQQueueFormatter';

export class RabbitMQConfigurer {
	constructor(
		private readonly connection: RabbitMQConnection,
		private readonly queueNameFormatter: RabbitMQQueueFormatter
	) {}

	async configure(params: {
		exchange: string;
		subscribers: Array<DomainEventSubscriber<DomainEvent>>;
	}): Promise<void> {
		await this.connection.exchange({ name: params.exchange });

		for (const subscriber of params.subscribers) {
			await this.addQueue(subscriber, params.exchange);
		}
	}

	private async addQueue(subscriber: DomainEventSubscriber<DomainEvent>, exchange: string) {
		const routingKeys = subscriber.subscribedTo().map(event => event.EVENT_NAME);
		const queue = this.queueNameFormatter.format(subscriber);

		await this.connection.queue({ routingKeys, name: queue, exchange });
	}
}
