export const jobAdsSelector = () => {
    return {
        id: true,
        title: true,
        description: true,
        requirements: true,
        salary: true,
        location: true,
        workType: true,
        payType: true,
        createdAt: true,
        updatedAt: true,
    };
};
