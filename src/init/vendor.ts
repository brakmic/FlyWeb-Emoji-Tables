// Vendor scripts go here
// -----------------------
import 'jquery';
// DOM4 Polyfills for IE
import '../platform/helpers/dom4.js';

import '../vendor/bootstrap/css/bootstrap.min.css';
import '../vendor/bootstrap/css/bootstrap-theme.min.css';
import '../vendor/bootstrap/js/bootstrap.min.js';

// Hammjer.js
import 'hammerjs';

import '../vendor/jquery/jquery.hammer.js';
// Lodash
import * as _ from 'lodash';
// Themes
import 'bootstrap-loader';
import 'font-awesome-sass-loader';

// Prevent Ghost Clicks (for Hammer.js)
import '../platform/helpers/browser-events';

// Circular JSON (for better serialization of complex objects)
import 'circular-json';
