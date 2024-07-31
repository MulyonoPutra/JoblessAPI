import { companySelector } from './company.selector';

export const applicationSelector = () => {
    return {
        select: {
            id: true,
            status: true,
            date: true,
            jobAds: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    requirements: true,
                    salary: true,
                    employer: {
                        select: {
                            id: true,
                            accountName: true,
                            company: companySelector(),
                        },
                    },
                    createdAt: true,
                },
            },
        },
    };
};
