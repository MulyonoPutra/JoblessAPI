export type ProfileResponseType = {
	id: string;
	name: string;
	email: string;
	avatar: string;
	phone: string;
	role: string;
	createdAt: Date;
	seeker: SeekerResponseType;
};

type SeekerResponseType = {
	id: string;
	summary: string;
	resume: string;
	coverLetter: string;
	desireSalary: string;
	startDate: any;
	createdAt: Date;
	updatedAt: Date;
};
