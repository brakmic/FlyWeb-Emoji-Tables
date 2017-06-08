const helpers = require('./helpers');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const path = require('path');
/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
// const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const TITLE = process.env.TITLE || 'flyamp';
const METADATA = webpackMerge(commonConfig({
    env: ENV
}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});
/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
    return webpackMerge(commonConfig({
        env: ENV
    }), {
         /*
         * The entry point for the bundle
         * Our Angular.js app
         *
         * See: http://webpack.github.io/docs/configuration.html#entry
         */
        entry: {
            'polyfills': './src/init/polyfills.ts',
            'vendor': './src/init/vendor.ts',
            'main': './src/init/main.ts'
        },
        /**
         * Developer tool to enhance debugging
         *
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'cheap-module-source-map',
        /**
         * Options affecting the output of the compilation.
         *
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {
            publicPath: '/dist/',
            /**
             * The output directory as absolute path (required).
             *
             * See: http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root('dist'),
            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].bundle.js',
            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].map',
            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].chunk.js',
            library: 'ac_[name]',
            libraryTarget: 'var',
        },
        plugins: [
            /**
             * Plugin LoaderOptionsPlugin (experimental)
             *
             * See: https://gist.github.com/sokra/27b24881210b56bbaff7
             */
            new LoaderOptionsPlugin({
                debug: true,
                options: {
                    context: __dirname,
                    output: {
                        path: helpers.root('dist')
                    },
                    /**
                     * Static analysis linter for TypeScript advanced options configuration
                     * Description: An extensible linter for the TypeScript language.
                     *
                     * See: https://github.com/wbuchwalter/tslint-loader
                     */
                    tslint: {
                        emitErrors: false,
                        failOnHint: false,
                        resourcePath: 'src'
                    },
                    resolve: {}
                }
            }),
            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                }
            }),
            /*
             * Plugin: ForkCheckerPlugin
             * Description: Do type checking in a separate process, so webpack don't need to wait.
             *
             * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
             */
            // new ForkCheckerPlugin(),
             /**
             * Plugin: NamedModulesPlugin (experimental)
             * Description: Uses file names as module name.
             *
             * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
             */
            new NamedModulesPlugin(),
            /*
             * Plugin: CommonsChunkPlugin
             * Description: Shares common code between the pages.
             * It identifies common modules and put them into a commons chunk.
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
             * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
             */
            new webpack.optimize.CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            /*
             * Plugin: CopyWebpackPlugin
             * Description: Copy files and directories in webpack.
             *
             * Copies project static assets.
             *
             * See: https://www.npmjs.com/package/copy-webpack-plugin
             */
             new CopyWebpackPlugin([
                    {
                    from: 'src/assets',
                    to: 'assets'
                    },
                    {
                    from: './favicon.ico'
                    },
                    {
                    from: './manifest.webapp'
                    }
                    ], {
                    ignore: [
                        'humans.txt',
                        'robots.txt'
                    ]
                }),
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename
             * which changes every compilation.
             *
             * See: https://github.com/ampedandwired/html-webpack-plugin
             */
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                isDevServer: METADATA.isDevServer,
                favicon: 'favicon.ico',
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'head'
            }),
            /*
             * Plugin: ScriptExtHtmlWebpackPlugin
             * Description: Enhances html-webpack-plugin functionality
             * with different deployment options for your scripts including:
             *
             * See: https://github.com/numical/script-ext-html-webpack-plugin
             */
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            /*
             * Plugin: HtmlHeadConfigPlugin
             * Description: Generate html tags based on javascript maps.
             *
             * If a publicPath is set in the webpack output configuration, it will be automatically added to
             * href attributes, you can disable that by adding a "=href": false property.
             * You can also enable it to other attribute by settings "=attName": true.
             *
             * The configuration supplied is map between a location (key) and an element definition object (value)
             * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
             *
             * Example:
             *  Adding this plugin configuration
             *  new HtmlElementsPlugin({
             *    headTags: { ... }
             *  })
             *
             *  Means we can use it in the template like this:
             *  <%= webpackConfig.htmlElements.headTags %>
             *
             * Dependencies: HtmlWebpackPlugin
             */
            new HtmlElementsPlugin({
                headTags: require('./head-config.common')
            }),
        ],
        /**
         * Webpack Development Server configuration
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client,
         * which reacts to those events.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            outputPath: helpers.root('dist')
        },
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
    });
};