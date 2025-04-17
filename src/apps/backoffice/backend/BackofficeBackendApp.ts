import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import container from './dependency-injection';
import { Server } from './server';

export class BackofficeBackendApp {
	private server?: Server;

	async start() {
		const port = process.env.PORT || '4000';
		this.server = new Server(port);

		await this.configureEventBus();

		return this.server.listen();
	}

	get httpServer(): Server['httpServer'] | undefined {
		return this.server?.getHTTPServer();
	}

	async stop() {
		const rabbitMQConnection = container.get<RabbitMQConnection>(
			'Backoffice.Shared.RabbitMQConnection'
		);
		await rabbitMQConnection.close();
		await this.server?.stop();
	}

	private async configureEventBus() {
		const eventBus = container.get<EventBus>('Backoffice.Shared.domain.EventBus');
		const rabbitMQConnection = container.get<RabbitMQConnection>(
			'Backoffice.Shared.RabbitMQConnection'
		);
		await rabbitMQConnection.connect();

		eventBus.addSubscribers(DomainEventSubscribers.from(container));
	}
}
