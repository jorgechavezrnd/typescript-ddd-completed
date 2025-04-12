import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CourseCreator } from '../../../../Contexts/Mooc/Courses/application/CourseCreator';
import { Controller } from './Controller';

export class CoursePutController implements Controller {
	constructor(private readonly courseCreator: CourseCreator) {}

	async run(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const { name, duration } = req.body;
			await this.courseCreator.run({ id, name, duration });
			res.status(httpStatus.CREATED).send();
		} catch (error) {
			console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
		}
	}
}
