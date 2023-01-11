const path = require('path'); //eslint-disable-line @typescript-eslint/no-var-requires
const cssLoader = require.resolve('css-loader');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
    reactScriptsVersion: 'react-scripts', // {default value}
    style: {
        sass: {
            modules: {
                exportLocalsConvention: 'camelCase'
            }
        }
    },
    webpack: {
        alias: {
            '@ra': resolve('src/vendor/react-arsenal')
        },
        configure: (webpackConfig) => {
            webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
                if (!Array.isArray(rule.oneOf)) {
                    return rule;
                }

                rule.oneOf = rule.oneOf
                    .map((loader) => {
                        // remove non module loaders
                        if (String(loader.test) === String(sassRegex)) {
                            return null;
                        }

                        // match non .module.scss files with the configuration for scss modules
                        if (String(loader.test) === String(sassModuleRegex)) {
                            loader.test = sassRegex;
                        }
                        loader.use?.forEach((styleLoader) => {
                            if (styleLoader.loader !== cssLoader) {
                                return;
                            }
                            styleLoader.options.modules.exportLocalsConvention = 'camelCaseOnly';
                        });
                        return loader;
                    })
                    .filter(Boolean);

                return rule;
            });

            return webpackConfig;
        }
    },
    babel: {
        plugins: process.env.NODE_ENV !== 'development' ? ['transform-remove-console'] : [],
        loaderOptions: {
            ignore: ['./node_modules/mapbox-gl/dist/mapbox-gl.js']
        }
    }
};
