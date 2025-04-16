import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CreateCourseCommand } from '../../../../Contexts/Mooc/Courses/domain/CreateCourseCommand';
import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { Controller } from './Controller';

type CoursePutRequest = Request & {
	body: {
		id: string;
		name: string;
		duration: string;
	};
};

export class CoursePutController implements Controller {
	constructor(private readonly commandBus: CommandBus) {}

	async run(req: CoursePutRequest, res: Response): Promise<void> {
		try {
			const { id, name, duration } = req.body;
			const createCoursecommand = new CreateCourseCommand({ id, name, duration });
			await this.commandBus.dispatch(createCoursecommand);

			res.status(httpStatus.CREATED).send();
		} catch (error) {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
		}
	}
}
