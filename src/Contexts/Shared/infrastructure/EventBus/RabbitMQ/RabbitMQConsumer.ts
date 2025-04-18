import { ConsumeMessage } from 'amqplib';

import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { DomainEventDeserializer } from '../DomainEventDeserializer';
import { RabbitMQConnection } from './RabbitMQConnection';

export class RabbitMQConsumer {
	private readonly subscriber: DomainEventSubscriber<DomainEvent>;
	private readonly deserializer: DomainEventDeserializer;
	private readonly connection: RabbitMQConnection;
	private readonly maxRetries: number;
	private readonly queueName: string;
	private readonly exchange: string;

	constructor(params: {
		subscriber: DomainEventSubscriber<DomainEvent>;
		deserializer: DomainEventDeserializer;
		connection: RabbitMQConnection;
		queueName: string;
		exchange: string;
		maxRetries: number;
	}) {
		this.subscriber = params.subscriber;
		this.deserializer = params.deserializer;
		this.connection = params.connection;
		this.maxRetries = params.maxRetries;
		this.queueName = params.queueName;
		this.exchange = params.exchange;
	}

	async onMessage(message: ConsumeMessage) {
		const content = message.content.toString();
		const domainEvent = this.deserializer.deserialize(content);

		try {
			await this.subscriber.on(domainEvent);
		} catch (error) {
			this.handleError(message);
		} finally {
			this.connection.ack(message);
		}
	}

	private async handleError(message: ConsumeMessage) {
		if (this.hasBeenRedeliveredTooMuch(message)) {
			await this.deadLetter(message);
		} else {
			await this.retry(message);
		}
	}

	private async retry(message: ConsumeMessage) {
		await this.connection.retry(message, this.queueName, this.exchange);
	}

	private async deadLetter(message: ConsumeMessage) {
		await this.connection.deadLetter(message, this.queueName, this.exchange);
	}

	private hasBeenRedeliveredTooMuch(message: ConsumeMessage) {
		if (this.hasBeenRedelivered(message)) {
			const count = parseInt(message.properties.headers['redelivery_count']);

			return count >= this.maxRetries;
		}

		return false;
	}

	private hasBeenRedelivered(message: ConsumeMessage) {
		return message.properties.headers['redelivery_count'] !== undefined;
	}
}
