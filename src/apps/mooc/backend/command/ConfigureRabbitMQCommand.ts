import { RabbitMQConfig } from '../../../../Contexts/Mooc/Shared/infrastructure/RabbitMQ/RabbitMQConfigFactory';
import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMQConnection } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import container from '../dependency-injection';

export class ConfigureRabbitMQCommand {
	static async run() {
		const connection = container.get<RabbitMQConnection>('Mooc.Shared.RabbitMQConnection');
		const { name: exchange } = container.get<RabbitMQConfig>(
			'Mooc.Shared.RabbitMQConfig'
		).exchangeSettings;
		await connection.connect();

		const configurer = container.get<RabbitMQConfigurer>('Mooc.Shared.RabbitMQConfigurer');
		const subscribers = DomainEventSubscribers.from(container).items;

		await configurer.configure({ exchange, subscribers });
		await connection.close();
	}
}
