import { ApplicationEntity } from './application.entity';
import { EducationEntity } from './education.entity';
import { ExperienceEntity } from './experience.entity';
import { SavedJobsEntity } from './saved-jobs.entity';
import { UserEntity } from './user.entity';

export class SeekerEntity {
	id: string;
	summary: string;
	education?: EducationEntity[];
	experience?: ExperienceEntity[];
	user?: UserEntity;
	savedJobs?: SavedJobsEntity[];
	Application?: ApplicationEntity[];
}
