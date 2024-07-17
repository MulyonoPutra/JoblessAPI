export const jobAdsSelector = () => {
    return {
        id: true,
        title: true,
        description: true,
        requirements: true,
        salary: true,
        createdAt: true,
        updatedAt: true,
        location: true,
        workType: true,
        payType: true,
    };
}
