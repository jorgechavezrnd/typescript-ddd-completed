import { CourseRepository } from '../../domain/CourseRepository';
import { CoursesResponse } from './CoursesResponse';

export class CoursesFinder {
	constructor(private readonly coursesRepository: CourseRepository) {}

	async run() {
		const courses = await this.coursesRepository.searchAll();

		return new CoursesResponse(courses);
	}
}
