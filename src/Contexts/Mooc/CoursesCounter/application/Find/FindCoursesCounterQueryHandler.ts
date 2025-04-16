import { Query } from '../../../../Shared/domain/Query';
import { QueryHandler } from '../../../../Shared/domain/QueryHandler';
import { CoursesCounterFinder } from './CoursesCounterFinder';
import { FindCoursesCounterQuery } from './FindCoursesCounterQuery';
import { FindCoursesCounterResponse } from './FindCoursesCounterResponse';

export class FindCoursesCounterQueryHandler
	implements QueryHandler<FindCoursesCounterQuery, FindCoursesCounterResponse>
{
	constructor(private readonly finder: CoursesCounterFinder) {}

	subscribedTo(): Query {
		return FindCoursesCounterQuery;
	}

	async handle(query: FindCoursesCounterQuery): Promise<FindCoursesCounterResponse> {
		const counter = await this.finder.run();

		return new FindCoursesCounterResponse(counter);
	}
}
