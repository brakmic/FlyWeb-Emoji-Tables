const page = require('page');
import { IPage } from 'app/interfaces';
import * as _ from 'lodash';
const bows = require('../../platform/helpers/bows-alt');
const logger = bows('Router');

/**
 * A very simple router based on Page.js
 */
export default class Router {
    constructor() {
        this.init();
    }
    private init() {
        page('/', this.page);
        page('/page/:pg', this.page);
        page('*', this.ignore);
        page();
    }
    private page(pg: IPage) {
        const no = _.last(_.split(pg.path, '/'));
        switch (no) {
            default: {
                console.log(`${_.upperFirst(no)} selected`);
            }
        }
    }
    private ignore() {
    }
}
