import { INavigator } from 'app/interfaces';
import { IFlyWebFetchEvent } from 'app/interfaces';
const parse = require('url-parse');
const html = require('../app/main/microapp.html');
const bows = require('../platform/helpers/bows-alt');
const BASE_URL = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
const browser = <INavigator>navigator; // let TypeScript know about the FlyWeb API
declare var Response: any;
declare var fetch: any;
let counter = 0;

/* 
* Creates responses containing js, html and other contents
*/
const doFetch = (event: IFlyWebFetchEvent, path: string, contentType: string): void => {
    fetch(BASE_URL + path)
    .then((response) => {
        return response.blob();
    })
    .then((blob) => {
        event.respondWith(new Response(blob, {
        headers: {
            'Content-Type': contentType
        }
        }));
    });
};
/*
* Creates a new FlyWeb server
*/
export default (function () {
    const name = `Emojis_${counter++}`;
    const logger = bows(name);
    browser.publishServer(name, undefined).then(server => {
        server.onfetch = (event: IFlyWebFetchEvent) => {
            const headers =  { 'Content-Type': 'text/html' };
            const url = parse(event.request.url);
            // Here we define all available contents to be served from our FlyWeb apps
            switch (url.pathname) {
                case '/microapp.js': {
                    doFetch(event, '/microapp/microapp.js', 'text/javascript');
                }
                break;
                case '/style.css': {
                    doFetch(event, '/microapp/style.css', 'text/css');
                }
                break;
                default: {
                    event.respondWith(new Promise((resolve, reject) => {
                        resolve(new Response(html, { headers } ));
                    }));
                }
            }
        };
    }).catch(error => {
        logger.log(error);
    });
}());
