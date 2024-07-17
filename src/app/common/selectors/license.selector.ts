export const licenseSelector = () => {
    return {
        select: {
            id: true,
            name: true,
            organization: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    };
}