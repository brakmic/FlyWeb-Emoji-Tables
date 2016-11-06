const year = (new Date()).getFullYear();
const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');
/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    port: 3000,
    host: 'localhost',
    title: 'flyamp',
    urlPrefix: '/',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer()
};
/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
    var isProd = options.env === 'production';
    return {
        /*
         * Options affecting the resolving of modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#resolve
         */
        resolve: {
            /*
             * An array of extensions that should be used to resolve modules.
             *
             * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
             */
            extensions: ['.ts', '.js', '.json', '.css', '.scss'],
            // An array of directory names to be resolved to the current directory
            modules: [
                helpers.root('src'),
                helpers.root('src/app'),
                helpers.root('src/platform'),
                helpers.root('src/init'),
                helpers.root('src/vendor'),
                helpers.root('node_modules')
            ],
            alias: {
                'request-frame': helpers.root('src/platform/polyfills/request-frame.js'),
                'underscore': helpers.root('node_modules/underscore/underscore-min.js'),
                'lodash': helpers.root('node_modules/lodash/index.js'),
                'config.json': helpers.root('src/config.json')
            },
        },
        /*
         * Options affecting the normal modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#module
         */
        module: {
            /*
             * An array of automatically applied loaders.
             *
             * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
             * This means they are not resolved relative to the configuration file.
             *
             * See: http://webpack.github.io/docs/configuration.html#module-loaders
             */
            rules: [
                /*
                 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
                 *
                 * See: https://github.com/s-panferov/awesome-typescript-loader
                 */
                {
                    test: /\.ts$/,
                    loaders: [
                        'awesome-typescript-loader'
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                /*
                 * Json loader support for *.json files.
                 *
                 * See: https://github.com/webpack/json-loader
                 */
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                /*
                 * Raw loader support for *.css files
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'raw-loader', 'css-loader']
                        //loaders: ['raw-loader']
                },
                /*
                 * Load Sass Styles
                 * See: See: https://github.com/jtangelder/sass-loader
                 */
                {
                    test: /\.scss$/,
                    loaders: ['to-string-loader', 'raw-loader', 'sass-loader']
                        // loaders: ['raw-loader', 'sass-loader']
                }, 
                {
                    test: /\.woff(2)?(\?v=.+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                }, {
                    test: /\.(ttf|eot|svg)(\?v=.+)?$/,
                    loader: 'file-loader'
                }, {
                    test: /bootstrap\/dist\/js\/umd\//,
                    loader: 'imports?jQuery=jquery'
                },
                {
                    test: /style\.scss$/,
                    loader: ExtractTextPlugin.extract(
                    { 
                        fallbackLoader: 'style-loader', 
                        loader: 'css-loader!sass-loader?sourceMap' 
                    })
                },
                /* Raw loader support for *.html
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                /* File loader for supporting images, for example, in CSS files.
                 */
                {
                    test: /\.(jpg|png|gif)$/,
                    loader: 'file'
                },
                {
                    enforce: 'post',
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    query: {
                        search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
                        replace: 'var sourceMappingUrl = "";',
                        flags: 'g'
                    }
                }
            ]
        },
        /*
         * Add additional plugins to the compiler.
         *
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [
            new ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
            /**
             * Plugin: NamedModulesPlugin (experimental)
             * Description: Uses file names as module name.
             *
             * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
             */
            new NamedModulesPlugin(),

            new DashboardPlugin(),
            new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),

            new AssetsPlugin({
                path: helpers.root('dist'),
                filename: 'webpack-assets.json',
                prettyPrint: true
            }),
            /**
             * Plugin LoaderOptionsPlugin (experimental)
             *
             * See: https://gist.github.com/sokra/27b24881210b56bbaff7
             */
            new LoaderOptionsPlugin({
                options: {
                    METADATA: METADATA,
                    context: __dirname,
                    output: {
                        path: helpers.root('dist')
                    },
                    resolve: {}
                }
            }),
        ],
        /*
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
};