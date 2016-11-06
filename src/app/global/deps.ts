import './style.scss';
require('jquery');
require('../../vendor/datatables/js/jquery.dataTables.min');
import '../../vendor/bootstrap/js/bootstrap.min.js';
import * as _ from 'lodash';
import * as Ractive from 'ractive';
(<any>window).Ractive = Ractive;
const RactiveAdaptorsAmpersand = require('ractive-adaptors-ampersand');
import Router from './router';

/**
 * Initialize some (still unused) defaults like ractive adaptors, client-side router etc.
 */
export default (function() {
   (<any>localStorage).debug = true;
   // set debugging for Ractive
   (<any>window).Ractive.DEBUG = (<any>/unminified/).test(() => { /*unminified*/ });
   (<any>window).Ractive.DEBUG_PROMISES = false;
   (<any>window).Ractive.adaptors.Ampersand = RactiveAdaptorsAmpersand;
   new Router();
}());

