import { RabbitMQConfig } from '../../../../Contexts/Backoffice/Courses/infrastructure/RabbitMQ/RabbitMQConfigFactory';
import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMQConnection } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQQueueFormatter } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQQueueFormatter';
import container from '../dependency-injection';

export class ConfigureRabbitMQCommand {
	static async run() {
		const connection = container.get<RabbitMQConnection>('Backoffice.Shared.RabbitMQConnection');
		const nameFormatter = container.get<RabbitMQQueueFormatter>(
			'Backoffice.Shared.RabbitMQQueueFormatter'
		);
		const { exchangeSettings, retryTtl } = container.get<RabbitMQConfig>(
			'Backoffice.Shared.RabbitMQConfig'
		);

		await connection.connect();

		const configurer = new RabbitMQConfigurer(connection, nameFormatter, retryTtl);
		const subscribers = DomainEventSubscribers.from(container).items;

		await configurer.configure({ exchange: exchangeSettings.name, subscribers });
		await connection.close();
	}
}
