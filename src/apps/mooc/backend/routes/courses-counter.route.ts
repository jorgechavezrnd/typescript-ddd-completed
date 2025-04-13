import { Request, Response, Router } from 'express';

import { CoursesCounterGetController } from '../controllers/CoursesCounterGetController';
import container from '../dependency-injection';

export const register = (router: Router) => {
	const coursesCounterGetController = container.get<CoursesCounterGetController>(
		'Apps.mooc.controllers.CoursesCounterGetController'
	);
	router.get('/courses-counter', (req: Request, res: Response) =>
		coursesCounterGetController.run(req, res)
	);
};
