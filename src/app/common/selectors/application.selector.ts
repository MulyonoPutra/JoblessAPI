export const applicationSelector = () => {
    return {
        select: {
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
                            company: true,
                        },
                    },
                    createdAt: true,
                },
            },
            id: true,
            status: true,
            date: true,
        },
    }
}