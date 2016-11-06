declare var fetch: any;
// use fetch for all API calls
const doFetch = (url: string): Promise<any> => {
    return fetch(url)
    .then(response => {
        if (response.status >= 400) {
            throw new Error('Bad response from server');
        }
        return response.json();
    });
};

export default doFetch;
