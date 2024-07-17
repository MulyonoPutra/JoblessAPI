export const userSelector = () => {
    return {
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthday: true,
            gender: true,
        },
    };
};
