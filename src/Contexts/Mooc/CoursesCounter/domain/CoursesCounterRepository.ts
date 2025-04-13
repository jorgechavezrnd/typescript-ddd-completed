import { Nullable } from '../../../Shared/domain/Nullable';
import { CoursesCounter } from './CoursesCounter';

export interface CoursesCounterRepository {
	search(): Promise<Nullable<CoursesCounter>>;
	save(counter: CoursesCounter): Promise<void>;
}
