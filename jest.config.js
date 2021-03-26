module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    transform: {
        '/^.+\\.[t|j]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: ['node_modules/']
};

