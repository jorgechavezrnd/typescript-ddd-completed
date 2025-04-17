import { Express } from 'express';

import { CoursesGetController } from '../controllers/CoursesGetController';
import { CoursesPostController } from '../controllers/CoursesPostController';
import container from '../dependency-injection';

export const register = (app: Express) => {
	const coursesPostController: CoursesPostController = container.get(
		'Apps.Backoffice.Backend.controllers.CoursesPostController'
	);
	const coursesGetController: CoursesGetController = container.get(
		'Apps.Backoffice.Backend.controllers.CoursesGetController'
	);

	app.post('/courses', coursesPostController.run.bind(coursesPostController));
	app.get('/courses', coursesGetController.run.bind(coursesGetController));
};
