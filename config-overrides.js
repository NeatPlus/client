const path = require('path');
const {
    override,
    addBabelPlugins, 
    adjustStyleLoaders,
} = require('customize-cra');

const resolve = dir => path.resolve(__dirname, dir);

module.exports = override(
    adjustStyleLoaders(({use: [ , css]}) => {
        css.options.modules = {
            ...css.options.modules,
            exportLocalsConvention: 'camelCase'
        };
    }),
    function (config) {
        config.resolve.alias = Object.assign(config.resolve.alias, {
            '@ra': resolve('src/vendor/react-arsenal'),
        });

        return config;
    },
    process.env.NODE_ENV !== 'development' && addBabelPlugins('transform-remove-console'),
);

