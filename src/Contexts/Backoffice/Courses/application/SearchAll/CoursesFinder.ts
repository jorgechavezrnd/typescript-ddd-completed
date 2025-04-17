import { BackofficeCourseRepository } from '../../domain/BackofficeCourseRepository';

export class CoursesFinder {
	constructor(private readonly coursesRepository: BackofficeCourseRepository) {}

	async run() {
		const courses = await this.coursesRepository.searchAll();

		return courses;
	}
}
