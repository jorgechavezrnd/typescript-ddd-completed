import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';
import { DomainEventFailoverPublisher } from '../DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer';
import { DomainEventSubscribers } from '../DomainEventSubscribers';
import { RabbitMQConnection } from './RabbitMQConnection';

export class RabbitMQEventBus implements EventBus {
	private readonly failoverPublisher: DomainEventFailoverPublisher;
	private readonly connection: RabbitMQConnection;
	private readonly exchange: string;

	constructor(params: {
		failoverPublisher: DomainEventFailoverPublisher;
		connection: RabbitMQConnection;
		exchange: string;
	}) {
		const { failoverPublisher, connection, exchange } = params;
		this.failoverPublisher = failoverPublisher;
		this.connection = connection;
		this.exchange = exchange;
	}

	addSubscribers(subscribers: DomainEventSubscribers): void {
		throw new Error('Method not implemented.');
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

		return Buffer.from(JSON.stringify(eventPrimitives));
	}
}
