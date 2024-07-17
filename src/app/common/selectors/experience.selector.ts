export const experienceSelector = () => {
    return {
        select: {
            id: true,
            startDate: true,
            endDate: true,
            location: true,
            position: true,
            companyName: true,
            responsibilities: true,
        },
    };
}