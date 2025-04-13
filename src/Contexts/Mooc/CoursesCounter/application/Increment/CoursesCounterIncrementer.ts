import { EventBus } from '../../../../Shared/domain/EventBus';
import { CourseId } from '../../../Shared/domain/Courses/CourseId';
import { CoursesCounter } from '../../domain/CoursesCounter';
import { CoursesCounterId } from '../../domain/CoursesCounterId';
import { CoursesCounterRepository } from '../../domain/CoursesCounterRepository';

export class CoursesCounterIncrementer {
	constructor(
		private readonly repository: CoursesCounterRepository,
		private readonly bus: EventBus
	) {}

	async run(courseId: CourseId) {
		const counter = (await this.repository.search()) || this.initializeCounter();

		if (!counter.hasIncremented(courseId)) {
			counter.increment(courseId);

			await this.repository.save(counter);
			await this.bus.publish(counter.pullDomainEvents());
		}
	}

	private initializeCounter(): CoursesCounter {
		return CoursesCounter.initialize(CoursesCounterId.random());
	}
}
