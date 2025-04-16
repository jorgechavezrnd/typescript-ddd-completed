import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';
import { DomainEventDeserializer } from '../DomainEventDeserializer';
import { DomainEventFailoverPublisher } from '../DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer';
import { DomainEventSubscribers } from '../DomainEventSubscribers';
import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQconsumerFactory } from './RabbitMQConsumerFactory';
import { RabbitMQQueueFormatter } from './RabbitMQQueueFormatter';

export class RabbitMQEventBus implements EventBus {
	private readonly failoverPublisher: DomainEventFailoverPublisher;
	private readonly connection: RabbitMQConnection;
	private readonly exchange: string;
	private readonly queueNameFormatter: RabbitMQQueueFormatter;
	private readonly maxRetries: number;

	constructor(params: {
		failoverPublisher: DomainEventFailoverPublisher;
		connection: RabbitMQConnection;
		exchange: string;
		queueNameFormatter: RabbitMQQueueFormatter;
		maxRetries: number;
	}) {
		const { failoverPublisher, connection, exchange, queueNameFormatter, maxRetries } = params;
		this.failoverPublisher = failoverPublisher;
		this.connection = connection;
		this.exchange = exchange;
		this.queueNameFormatter = queueNameFormatter;
		this.maxRetries = maxRetries;
	}

	async addSubscribers(subscribers: DomainEventSubscribers): Promise<void> {
		const deserializer = DomainEventDeserializer.configure(subscribers);
		const consumeFactory = new RabbitMQconsumerFactory(
			deserializer,
			this.connection,
			this.maxRetries
		);

		for (const subscriber of subscribers.items) {
			const queueName = this.queueNameFormatter.format(subscriber);
			const rabbitMQConsumer = consumeFactory.build(subscriber, this.exchange, queueName);

			await this.connection.consume(queueName, rabbitMQConsumer.onMessage.bind(rabbitMQConsumer));
		}
	}

	async publish(events: Array<DomainEvent>): Promise<void> {
		for (const event of events) {
			try {
				const routingKey = event.eventName;
				const content = this.serialize(event);
				const options = this.options(event);

				await this.connection.publish({ routingKey, content, options, exchange: this.exchange });
			} catch (error: any) {
				await this.failoverPublisher.publish(event);
			}
		}
	}

	private options(event: DomainEvent) {
		return {
			messageId: event.eventId,
			contentType: 'application/json',
			contentEncoding: 'utf-8'
		};
	}

	private serialize(event: DomainEvent): Buffer {
		const eventPrimitives = DomainEventJsonSerializer.serialize(event);

		return Buffer.from(eventPrimitives);
	}
}
