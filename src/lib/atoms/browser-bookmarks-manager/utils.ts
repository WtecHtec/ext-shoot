
export const getWebPageStatus = (id, url): Promise<[any, any]> => {
    return new Promise((resolve) => {
        fetch(url, {
            method: "HEAD",
            mode: "no-cors",
        })
            .then((response) => {
                const isDeadBookmark =
                    response.status == 404 ||
                    response.status == 410;
                resolve(['', { id, isDeadBookmark }]);
            })
            .catch((error) => {
                resolve([error, {}]);
            });
    });
};
