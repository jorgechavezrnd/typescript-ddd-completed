import { deserialize, serialize } from 'bson';
import fs from 'fs';

import { CourseId } from '../../../Shared/domain/Courses/CourseId';
import { Course } from '../../domain/Course';
import { CourseDuration } from '../../domain/CourseDuration';
import { CourseName } from '../../domain/CourseName';
import { CourseRepository } from '../../domain/CourseRepository';

export class FileCourseRepository implements CourseRepository {
	private readonly FILE_NAME = `${__dirname}/courses`;

	async save(course: Course): Promise<void> {
		await fs.promises.writeFile(
			this.filePath(course.id.value),
			serialize({ id: course.id.value, name: course.name.value, duration: course.duration.value })
		);
	}

	async search(courseId: string): Promise<Course> {
		const courseData = await fs.promises.readFile(this.filePath(courseId));
		const { id, name, duration } = deserialize(courseData);

		return new Course(new CourseId(id), new CourseName(name), new CourseDuration(duration));
	}

	private filePath(id: string): string {
		return `${this.FILE_NAME}.${id}.repo`;
	}
}
