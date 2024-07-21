export const companySelector = () => {
    return {
        select: {
            id: true,
            name: true,
            logo: true,
            header: true,
            website: true,
            industry: true,
            size: true,
            location: true,
            description: true,
            benefit: true,
            contactInfo: true,
            createdAt: true,
            updatedAt: true,
        },
    };
};
