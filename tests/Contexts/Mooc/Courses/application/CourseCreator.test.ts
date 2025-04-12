import { CourseCreator } from '../../../../../src/Contexts/Mooc/Courses/application/CourseCreator';
import { CourseNameLengthExceeded } from '../../../../../src/Contexts/Mooc/Courses/domain/CourseNameLengthExceeded';
import { CourseRepositoryMock } from '../__mocks__/CourseRepositoryMock';
import EventBusMock from '../__mocks__/EventBusMock';
import { CourseCreatedDomainEventMother } from '../domain/CourseCreatedDomainEventMother';
import { CourseMother } from '../domain/CourseMother';
import { CreateCourseRequestMother } from './CreateCourseRequestMother';

let repository: CourseRepositoryMock;
let creator: CourseCreator;
let eventBus: EventBusMock;

beforeEach(() => {
	repository = new CourseRepositoryMock();
	eventBus = new EventBusMock();
	creator = new CourseCreator(repository, eventBus);
});

describe('CourseCreator', () => {
	it('should create a valid course', async () => {
		const request = CreateCourseRequestMother.random();
		const course = CourseMother.fromRequest(request);
		const domainEvent = CourseCreatedDomainEventMother.fromCourse(course);

		await creator.run(request);

		repository.assertLastSavedCourseIs(course);
		eventBus.assertLastPublishedEventIs(domainEvent);
	});

	it('should throw error if course name length is exceeded', async () => {
		expect(() => {
			const request = CreateCourseRequestMother.invalidRequest();

			const course = CourseMother.fromRequest(request);

			creator.run(request);

			repository.assertLastSavedCourseIs(course);
		}).toThrow(CourseNameLengthExceeded);
	});
});
