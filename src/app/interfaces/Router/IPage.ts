// used with page-router: https://github.com/visionmedia/page.js
export interface IPage {
    canonicalPath: string;
    path: string;
    title: string;
    state: any;
    querystring: string;
    pathname: string;
    params: any;
    hash: string;
}
