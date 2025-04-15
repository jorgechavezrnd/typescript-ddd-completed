export class RabbitMQQueueFormatter {
	constructor(private readonly moduleName: string) {}

	format(value: string) {
		const name = value
			.split(/(?=[A-Z])/)
			.join('_')
			.toLowerCase();

		return `${this.moduleName}.${name}`;
	}
}
