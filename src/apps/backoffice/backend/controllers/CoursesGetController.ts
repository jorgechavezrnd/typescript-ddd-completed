import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CoursesResponse } from '../../../../Contexts/Mooc/Courses/application/SearchAll/CoursesResponse';
import { SearchAllCoursesQuery } from '../../../../Contexts/Mooc/Courses/application/SearchAll/SearchAllCoursesQuery';
import { QueryBus } from '../../../../Contexts/Shared/domain/QueryBus';
import { Controller } from './Controller';

export class CoursesGetController implements Controller {
	constructor(private readonly queryBus: QueryBus) {}

	async run(req: Request, res: Response) {
		const response = await this.searchAllCourses();
		res.status(httpStatus.OK).send(response.courses);
	}

	private async searchAllCourses() {
		return this.queryBus.ask<CoursesResponse>(new SearchAllCoursesQuery());
	}
}
