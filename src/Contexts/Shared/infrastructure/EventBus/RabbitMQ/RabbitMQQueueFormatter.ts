import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';

export class RabbitMQQueueFormatter {
	constructor(private readonly moduleName: string) {}

	format(subscriber: DomainEventSubscriber<DomainEvent>) {
		const value = subscriber.constructor.name;
		const name = value
			.split(/(?=[A-Z])/)
			.join('_')
			.toLowerCase();

		return `${this.moduleName}.${name}`;
	}
}
