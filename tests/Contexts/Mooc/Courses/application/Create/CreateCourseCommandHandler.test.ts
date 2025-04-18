import { CourseCreator } from '../../../../../../src/Contexts/Mooc/Courses/application/Create/CourseCreator';
import { CreateCourseCommandHandler } from '../../../../../../src/Contexts/Mooc/Courses/application/Create/CreateCourseCommandHandler';
import { CourseNameLengthExceeded } from '../../../../../../src/Contexts/Mooc/Courses/domain/CourseNameLengthExceeded';
import EventBusMock from '../../../Shared/domain/EventBusMock';
import { CourseRepositoryMock } from '../../__mocks__/CourseRepositoryMock';
import { CourseCreatedDomainEventMother } from '../../domain/CourseCreatedDomainEventMother';
import { CourseMother } from '../../domain/CourseMother';
import { CreateCoursecommandMother } from './CreateCourseCommandMother';

let repository: CourseRepositoryMock;
let creator: CourseCreator;
let eventBus: EventBusMock;
let handler: CreateCourseCommandHandler;

beforeEach(() => {
	repository = new CourseRepositoryMock();
	eventBus = new EventBusMock();
	creator = new CourseCreator(repository, eventBus);
	handler = new CreateCourseCommandHandler(creator);
});

describe('CreateCourseCommandHandler', () => {
	it('should create a valid course', async () => {
		const command = CreateCoursecommandMother.random();
		const course = CourseMother.from(command);
		const domainEvent = CourseCreatedDomainEventMother.fromCourse(course);

		await handler.handle(command);

		repository.assertSaveHaveBeenCalledWith(course);
		eventBus.assertLastPublishedEventIs(domainEvent);
	});

	it('should throw error if course name length is exceeded', async () => {
		expect(() => {
			const command = CreateCoursecommandMother.invalid();

			const course = CourseMother.from(command);

			handler.handle(command);

			repository.assertSaveHaveBeenCalledWith(course);
		}).toThrow(CourseNameLengthExceeded);
	});
});
