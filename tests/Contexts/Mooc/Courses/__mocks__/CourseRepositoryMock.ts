import { Course } from '../../../../../src/Contexts/Mooc/Courses/domain/Course';
import { CourseRepository } from '../../../../../src/Contexts/Mooc/Courses/domain/CourseRepository';

export class CourseRepositoryMock implements CourseRepository {
	private readonly saveMock: jest.Mock;

	constructor() {
		this.saveMock = jest.fn();
	}

	async save(course: Course): Promise<void> {
		await this.saveMock(course);
	}

	async searchAll(): Promise<Course[]> {
		return [];
	}

	assertSaveHaveBeenCalledWith(expected: Course): void {
		expect(this.saveMock).toHaveBeenCalledWith(expected);
	}
}
