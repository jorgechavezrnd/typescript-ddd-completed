import { Express } from 'express';

import { CoursesPostController } from '../controllers/CoursesPostController';
import container from '../dependency-injection';

export const register = (app: Express) => {
	const coursesPostController: CoursesPostController = container.get(
		'Apps.Backoffice.Backend.controllers.CoursesPostController'
	);

	app.post('/courses', coursesPostController.run.bind(coursesPostController));
};
