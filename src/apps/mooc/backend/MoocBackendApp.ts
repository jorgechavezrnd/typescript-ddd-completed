import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import container from './dependency-injection';
import { Server } from './server';

export class MoocBackendApp {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? '5000';
		this.server = new Server(port);

		await this.configureEventBus();

		return this.server.listen();
	}

	get httpServer(): Server['httpServer'] | undefined {
		return this.server?.getHTTPServer();
	}

	async stop(): Promise<void> {
		const rabbitMQConnection = container.get<RabbitMQConnection>('Mooc.Shared.RabbitMQConnection');
		await rabbitMQConnection.close();

		return this.server?.stop();
	}

	private async configureEventBus() {
		const eventBus = container.get<EventBus>('Mooc.Shared.domain.EventBus');
		const rabbitMQConnection = container.get<RabbitMQConnection>('Mooc.Shared.RabbitMQConnection');
		await rabbitMQConnection.connect();

		eventBus.addSubscribers(DomainEventSubscribers.from(container));
	}
}
