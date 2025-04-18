import { DomainEventFailoverPublisher } from '../../../../Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { RabbitMQConnection } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQEventBus } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQEventBus';
import { RabbitMQQueueFormatter } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQQueueFormatter';
import { RabbitMQConfig } from './RabbitMQConfigFactory';

export class RabbitMQEventBusFactory {
	static create(
		failoverPublisher: DomainEventFailoverPublisher,
		connection: RabbitMQConnection,
		queueNameFormatter: RabbitMQQueueFormatter,
		config: RabbitMQConfig
	): RabbitMQEventBus {
		return new RabbitMQEventBus({
			failoverPublisher,
			connection,
			exchange: config.exchangeSettings.name,
			queueNameFormatter,
			maxRetries: config.maxRetries
		});
	}
}
