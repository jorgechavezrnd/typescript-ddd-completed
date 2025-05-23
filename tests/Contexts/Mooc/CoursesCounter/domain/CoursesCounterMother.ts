import { CoursesCounter } from '../../../../../src/Contexts/Mooc/CoursesCounter/domain/CoursesCounter';
import { CoursesCounterId } from '../../../../../src/Contexts/Mooc/CoursesCounter/domain/CoursesCounterId';
import { CoursesCounterTotal } from '../../../../../src/Contexts/Mooc/CoursesCounter/domain/CoursesCounterTotal';
import { CourseId } from '../../../../../src/Contexts/Mooc/Shared/domain/Courses/CourseId';
import { Repeater } from '../../../Shared/domain/Repeater';
import { CourseIdMother } from '../../Shared/domain/Courses/CourseIdMother';
import { CoursesCounterTotalMother } from './CoursesCounterTotalMother';

export class CoursesCounterMother {
	static random() {
		const total = CoursesCounterTotalMother.random();

		return new CoursesCounter(
			CoursesCounterId.random(),
			total,
			Repeater.random(CourseIdMother.random.bind(CourseIdMother), total.value)
		);
	}

	static withOne(courseId: CourseId) {
		return new CoursesCounter(CoursesCounterId.random(), new CoursesCounterTotal(1), [courseId]);
	}
}
