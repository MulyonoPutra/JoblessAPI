import { educationSelector } from './education.selector';
import { experienceSelector } from './experience.selector';
import { licenseSelector } from './license.selector';
import { skillSelector } from './skill.selector';

export const seekerSelector = () => {
    return {
        select: {
            id: true,
            summary: true,
            resume: true,
            coverLetter: true,
            desireSalary: true,
            startDate: true,
            createdAt: true,
            updatedAt: true,
            education: educationSelector(),
            experience: experienceSelector(),
            skills: skillSelector(),
            license: licenseSelector(),
        },
    };
};
