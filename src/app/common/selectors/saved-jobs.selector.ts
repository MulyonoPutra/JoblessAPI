import { jobAdsSelector } from './job-ads.selector';

export const savedJobAdsSelector = () => {
    return {
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            isBookmark: true,
            jobAds: {
                select: jobAdsSelector(),
            },
        },
    };
};
