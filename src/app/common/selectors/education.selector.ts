export const educationSelector = () => {
    return {
        select: {
            id: true,
            startDate: true,
            endDate: true,
            title: true,
            institution: true,
            description: true,
            GPA: true,
        },
    };
}